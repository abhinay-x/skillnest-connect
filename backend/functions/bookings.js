const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { onCall, onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');

// Create booking
exports.createBooking = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const {
    serviceId,
    workerId,
    customerId,
    bookingDate,
    bookingTime,
    duration,
    address,
    notes,
    totalAmount
  } = request.data;

  try {
    // Validate booking data
    if (!serviceId || !workerId || !customerId || !bookingDate || !bookingTime) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required booking fields');
    }

    // Check if customer is the authenticated user
    if (request.auth.uid !== customerId) {
      throw new functions.https.HttpsError('permission-denied', 'Can only create bookings for yourself');
    }

    // Get service and worker details
    const [serviceDoc, workerDoc] = await Promise.all([
      admin.firestore().collection('services').doc(serviceId).get(),
      admin.firestore().collection('users').doc(workerId).get()
    ]);

    if (!serviceDoc.exists || !workerDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Service or worker not found');
    }

    const service = serviceDoc.data();
    const worker = workerDoc.data();

    // Check worker availability
    const existingBooking = await admin.firestore()
      .collection('bookings')
      .where('workerId', '==', workerId)
      .where('bookingDate', '==', bookingDate)
      .where('bookingTime', '==', bookingTime)
      .where('status', 'in', ['pending', 'confirmed', 'in-progress'])
      .limit(1)
      .get();

    if (!existingBooking.empty) {
      throw new functions.https.HttpsError('failed-precondition', 'Worker not available at this time');
    }

    // Create booking
    const bookingRef = admin.firestore().collection('bookings').doc();
    const bookingData = {
      id: bookingRef.id,
      serviceId,
      workerId,
      customerId,
      serviceName: service.name,
      workerName: `${worker.firstName} ${worker.lastName}`,
      customerName: request.auth.token.name || 'Customer',
      bookingDate,
      bookingTime,
      duration: duration || service.duration,
      address: address || null,
      notes: notes || '',
      basePrice: service.price,
      totalAmount: totalAmount || service.price,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await bookingRef.set(bookingData);

    // Create notification for worker
    await admin.firestore().collection('notifications').add({
      userId: workerId,
      title: 'New Booking Request',
      message: `You have a new booking request for ${service.name}`,
      type: 'booking_request',
      bookingId: bookingRef.id,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update user stats
    await admin.firestore().collection('userStats').doc(customerId).update({
      totalBookings: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await admin.firestore().collection('userStats').doc(workerId).update({
      totalBookings: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, bookingId: bookingRef.id, booking: bookingData };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create booking');
  }
});

// Update booking status
exports.updateBookingStatus = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { bookingId, status, notes } = request.data;

  try {
    const bookingRef = admin.firestore().collection('bookings').doc(bookingId);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Booking not found');
    }

    const booking = bookingDoc.data();

    // Check permissions
    if (request.auth.uid !== booking.customerId && 
        request.auth.uid !== booking.workerId && 
        !(await isAdmin(request.auth.uid))) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized to update this booking');
    }

    // Validate status transitions
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['in-progress', 'cancelled'],
      'in-progress': ['completed', 'cancelled'],
      'completed': [],
      'cancelled': []
    };

    if (!validTransitions[booking.status]?.includes(status)) {
      throw new functions.https.HttpsError('failed-precondition', 'Invalid status transition');
    }

    const updateData = {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (notes) {
      updateData.notes = notes;
    }

    await bookingRef.update(updateData);

    // Create notifications based on status change
    let notificationData = {
      bookingId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (status === 'confirmed') {
      notificationData = {
        ...notificationData,
        userId: booking.customerId,
        title: 'Booking Confirmed',
        message: `Your booking for ${booking.serviceName} has been confirmed`,
        type: 'booking_confirmed'
      };
    } else if (status === 'cancelled') {
      const cancelledBy = request.auth.uid === booking.customerId ? 'customer' : 'worker';
      notificationData = {
        ...notificationData,
        userId: request.auth.uid === booking.customerId ? booking.workerId : booking.customerId,
        title: 'Booking Cancelled',
        message: `Booking for ${booking.serviceName} has been cancelled by ${cancelledBy}`,
        type: 'booking_cancelled'
      };
    } else if (status === 'completed') {
      notificationData = {
        ...notificationData,
        userId: booking.customerId,
        title: 'Booking Completed',
        message: `Your booking for ${booking.serviceName} has been completed`,
        type: 'booking_completed'
      };
    }

    if (notificationData.userId) {
      await admin.firestore().collection('notifications').add(notificationData);
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update booking status');
  }
});

// Get user bookings
exports.getUserBookings = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userType = 'customer', status, limit = 20, lastDoc } = request.data;

  try {
    let query = admin.firestore()
      .collection('bookings')
      .where(userType === 'customer' ? 'customerId' : 'workerId', '==', request.auth.uid)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (status) {
      query = query.where('status', '==', status);
    }

    if (lastDoc) {
      const lastDocRef = await admin.firestore().collection('bookings').doc(lastDoc).get();
      query = query.startAfter(lastDocRef);
    }

    const snapshot = await query.get();
    const bookings = [];

    snapshot.forEach(doc => {
      bookings.push({ id: doc.id, ...doc.data() });
    });

    return { bookings, hasMore: bookings.length === limit };
  } catch (error) {
    console.error('Error getting user bookings:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get bookings');
  }
});

// Get booking details
exports.getBookingDetails = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { bookingId } = request.data;

  try {
    const bookingDoc = await admin.firestore().collection('bookings').doc(bookingId).get();
    
    if (!bookingDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Booking not found');
    }

    const booking = bookingDoc.data();

    // Check permissions
    if (request.auth.uid !== booking.customerId && 
        request.auth.uid !== booking.workerId && 
        !(await isAdmin(request.auth.uid))) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized to view this booking');
    }

    // Get additional details
    const [serviceDoc, workerDoc, customerDoc] = await Promise.all([
      admin.firestore().collection('services').doc(booking.serviceId).get(),
      admin.firestore().collection('users').doc(booking.workerId).get(),
      admin.firestore().collection('users').doc(booking.customerId).get()
    ]);

    return {
      booking: { id: bookingId, ...booking },
      service: serviceDoc.exists ? serviceDoc.data() : null,
      worker: workerDoc.exists ? workerDoc.data() : null,
      customer: customerDoc.exists ? customerDoc.data() : null
    };
  } catch (error) {
    console.error('Error getting booking details:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get booking details');
  }
});

// Schedule booking reminders
exports.scheduleBookingReminders = onSchedule('0 9 * * *', async (event) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const bookingsSnapshot = await admin.firestore()
      .collection('bookings')
      .where('bookingDate', '==', tomorrow.toISOString().split('T')[0])
      .where('status', '==', 'confirmed')
      .get();

    const batch = admin.firestore().batch();
    
    bookingsSnapshot.forEach(doc => {
      const booking = doc.data();
      
      // Create reminder for customer
      const customerReminder = admin.firestore().collection('notifications').doc();
      batch.set(customerReminder, {
        userId: booking.customerId,
        title: 'Booking Reminder',
        message: `Your booking for ${booking.serviceName} is tomorrow at ${booking.bookingTime}`,
        type: 'booking_reminder',
        bookingId: doc.id,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Create reminder for worker
      const workerReminder = admin.firestore().collection('notifications').doc();
      batch.set(workerReminder, {
        userId: booking.workerId,
        title: 'Booking Reminder',
        message: `You have a booking for ${booking.serviceName} tomorrow at ${booking.bookingTime}`,
        type: 'booking_reminder',
        bookingId: doc.id,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();
    console.log(`Scheduled reminders for ${bookingsSnapshot.size} bookings`);
  } catch (error) {
    console.error('Error scheduling booking reminders:', error);
  }
});

// Helper function to check if user is admin
async function isAdmin(userId) {
  const userDoc = await admin.firestore().collection('users').doc(userId).get();
  return userDoc.exists && userDoc.data().role === 'admin';
}
