const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { onCall } = require('firebase-functions/v2/https');

// Create marketplace order
exports.createMarketplaceOrder = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const {
    items,
    totalAmount,
    deliveryAddress,
    paymentMethod,
    deliveryDate,
    specialInstructions
  } = request.data;

  try {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new functions.https.HttpsError('invalid-argument', 'Items are required');
    }

    const orderRef = admin.firestore().collection('orders').doc();
    const orderData = {
      id: orderRef.id,
      customerId: request.auth.uid,
      type: 'marketplace',
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      deliveryDate,
      specialInstructions: specialInstructions || '',
      status: 'pending',
      paymentStatus: 'pending',
      trackingId: `TRK${Date.now()}`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await orderRef.set(orderData);

    // Update user stats
    await admin.firestore().collection('userStats').doc(request.auth.uid).set({
      totalOrders: admin.firestore.FieldValue.increment(1),
      totalSpent: admin.firestore.FieldValue.increment(totalAmount),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return { success: true, orderId: orderRef.id, order: orderData };
  } catch (error) {
    console.error('Error creating marketplace order:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create order');
  }
});

// Create rental booking
exports.createRentalBooking = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const {
    items,
    startDate,
    endDate,
    totalAmount,
    securityDeposit,
    deliveryAddress,
    pickupOption,
    paymentMethod,
    insurance
  } = request.data;

  try {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new functions.https.HttpsError('invalid-argument', 'Items are required');
    }

    const rentalRef = admin.firestore().collection('rentals').doc();
    const rentalData = {
      id: rentalRef.id,
      customerId: request.auth.uid,
      type: 'rental',
      items,
      startDate,
      endDate,
      totalAmount,
      securityDeposit,
      deliveryAddress,
      pickupOption,
      paymentMethod,
      insurance: insurance || false,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await rentalRef.set(rentalData);

    // Update user stats
    await admin.firestore().collection('userStats').doc(request.auth.uid).set({
      totalRentals: admin.firestore.FieldValue.increment(1),
      totalSpent: admin.firestore.FieldValue.increment(totalAmount + securityDeposit),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return { success: true, rentalId: rentalRef.id, rental: rentalData };
  } catch (error) {
    console.error('Error creating rental booking:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create rental booking');
  }
});

// Get user orders (marketplace)
exports.getUserOrders = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { status, limit = 20, lastDoc } = request.data;

  try {
    let query = admin.firestore()
      .collection('orders')
      .where('customerId', '==', request.auth.uid)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (status) {
      query = query.where('status', '==', status);
    }

    if (lastDoc) {
      const lastDocRef = await admin.firestore().collection('orders').doc(lastDoc).get();
      query = query.startAfter(lastDocRef);
    }

    const snapshot = await query.get();
    const orders = [];

    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    return { orders, hasMore: orders.length === limit };
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get orders');
  }
});

// Get user rentals
exports.getUserRentals = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { status, limit = 20, lastDoc } = request.data;

  try {
    let query = admin.firestore()
      .collection('rentals')
      .where('customerId', '==', request.auth.uid)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (status) {
      query = query.where('status', '==', status);
    }

    if (lastDoc) {
      const lastDocRef = await admin.firestore().collection('rentals').doc(lastDoc).get();
      query = query.startAfter(lastDocRef);
    }

    const snapshot = await query.get();
    const rentals = [];

    snapshot.forEach(doc => {
      rentals.push({ id: doc.id, ...doc.data() });
    });

    return { rentals, hasMore: rentals.length === limit };
  } catch (error) {
    console.error('Error getting user rentals:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get rentals');
  }
});

// Update order status
exports.updateOrderStatus = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { orderId, status, trackingInfo } = request.data;

  try {
    const orderRef = admin.firestore().collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Order not found');
    }

    const order = orderDoc.data();

    // Check permissions (customer can only view, admin/worker can update)
    if (request.auth.uid !== order.customerId && !(await isAdmin(request.auth.uid))) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized to update this order');
    }

    const updateData = {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (trackingInfo) {
      updateData.trackingInfo = trackingInfo;
    }

    await orderRef.update(updateData);

    // Create notification for customer
    await admin.firestore().collection('notifications').add({
      userId: order.customerId,
      title: 'Order Status Updated',
      message: `Your order ${orderId} status has been updated to ${status}`,
      type: 'order_update',
      orderId: orderId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update order status');
  }
});

// Update rental status
exports.updateRentalStatus = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { rentalId, status, notes } = request.data;

  try {
    const rentalRef = admin.firestore().collection('rentals').doc(rentalId);
    const rentalDoc = await rentalRef.get();

    if (!rentalDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Rental not found');
    }

    const rental = rentalDoc.data();

    // Check permissions
    if (request.auth.uid !== rental.customerId && !(await isAdmin(request.auth.uid))) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized to update this rental');
    }

    const updateData = {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (notes) {
      updateData.notes = notes;
    }

    await rentalRef.update(updateData);

    // Create notification for customer
    await admin.firestore().collection('notifications').add({
      userId: rental.customerId,
      title: 'Rental Status Updated',
      message: `Your rental ${rentalId} status has been updated to ${status}`,
      type: 'rental_update',
      rentalId: rentalId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating rental status:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update rental status');
  }
});

// Helper function to check if user is admin
async function isAdmin(uid) {
  try {
    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    return userDoc.exists && userDoc.data().role === 'admin';
  } catch (error) {
    return false;
  }
}
