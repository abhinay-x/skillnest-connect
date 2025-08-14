const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { onCall } = require('firebase-functions/v2/https');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: functions.config().razorpay?.key_id || process.env.RAZORPAY_KEY_ID,
  key_secret: functions.config().razorpay?.key_secret || process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
exports.createRazorpayOrder = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { amount, currency = 'INR', receipt, bookingId, notes = {} } = request.data;

  try {
    if (!amount || amount < 100) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid amount');
    }

    // Verify booking exists and belongs to user
    if (bookingId) {
      const bookingDoc = await admin.firestore().collection('bookings').doc(bookingId).get();
      if (!bookingDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Booking not found');
      }
      
      const booking = bookingDoc.data();
      if (booking.customerId !== request.auth.uid) {
        throw new functions.https.HttpsError('permission-denied', 'Not authorized');
      }
    }

    const orderOptions = {
      amount: amount,
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        userId: request.auth.uid,
        bookingId: bookingId || '',
        ...notes
      }
    };

    const order = await razorpay.orders.create(orderOptions);

    // Save order to database
    const orderRef = admin.firestore().collection('orders').doc();
    await orderRef.set({
      id: order.id,
      entity: order.entity,
      amount: order.amount,
      amount_paid: order.amount_paid,
      amount_due: order.amount_due,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      attempts: order.attempts,
      notes: order.notes,
      created_at: new Date(order.created_at * 1000),
      userId: request.auth.uid,
      bookingId: bookingId || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: razorpay.key_id
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create order');
  }
});

// Verify Razorpay payment
exports.verifyRazorpayPayment = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = request.data;

  try {
    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', razorpay.key_secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid signature');
    }

    // Get order details
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    if (payment.status !== 'captured') {
      throw new functions.https.HttpsError('failed-precondition', 'Payment not captured');
    }

    // Update order in database
    const orderSnapshot = await admin.firestore()
      .collection('orders')
      .where('id', '==', razorpay_order_id)
      .limit(1)
      .get();

    if (orderSnapshot.empty) {
      throw new functions.https.HttpsError('not-found', 'Order not found');
    }

    const orderDoc = orderSnapshot.docs[0];
    await orderDoc.ref.update({
      paymentId: razorpay_payment_id,
      status: 'paid',
      paymentStatus: 'completed',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create payment record
    const paymentRef = admin.firestore().collection('payments').doc();
    await paymentRef.set({
      id: payment.id,
      entity: payment.entity,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      order_id: payment.order_id,
      invoice_id: payment.invoice_id,
      international: payment.international,
      method: payment.method,
      amount_refunded: payment.amount_refunded,
      refund_status: payment.refund_status,
      captured: payment.captured,
      description: payment.description,
      card_id: payment.card_id,
      bank: payment.bank,
      wallet: payment.wallet,
      vpa: payment.vpa,
      email: payment.email,
      contact: payment.contact,
      notes: payment.notes,
      fee: payment.fee,
      tax: payment.tax,
      error_code: payment.error_code,
      error_description: payment.error_description,
      error_source: payment.error_source,
      error_step: payment.error_step,
      error_reason: payment.error_reason,
      acquirer_data: payment.acquirer_data,
      created_at: new Date(payment.created_at * 1000),
      userId: orderDoc.data().userId,
      bookingId: orderDoc.data().bookingId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update booking if linked
    if (orderDoc.data().bookingId) {
      await admin.firestore().collection('bookings').doc(orderDoc.data().bookingId).update({
        paymentStatus: 'completed',
        paymentId: paymentRef.id,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Create booking confirmation notification
      const bookingDoc = await admin.firestore()
        .collection('bookings')
        .doc(orderDoc.data().bookingId)
        .get();
      
      if (bookingDoc.exists) {
        const booking = bookingDoc.data();
        await admin.firestore().collection('notifications').add({
          userId: booking.customerId,
          title: 'Payment Successful',
          message: `Payment of ₹${payment.amount / 100} for ${booking.serviceName} has been confirmed`,
          type: 'payment_success',
          bookingId: booking.id,
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        await admin.firestore().collection('notifications').add({
          userId: booking.workerId,
          title: 'Payment Received',
          message: `Payment of ₹${payment.amount / 100} for ${booking.serviceName} has been received`,
          type: 'payment_received',
          bookingId: booking.id,
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    return {
      success: true,
      paymentId: payment.id,
      amount: payment.amount,
      status: payment.status
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new functions.https.HttpsError('internal', 'Failed to verify payment');
  }
});

// Get user payments
exports.getUserPayments = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { limit = 20, lastDoc } = request.data;

  try {
    let query = admin.firestore()
      .collection('payments')
      .where('userId', '==', request.auth.uid)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (lastDoc) {
      const lastDocRef = await admin.firestore().collection('payments').doc(lastDoc).get();
      query = query.startAfter(lastDocRef);
    }

    const snapshot = await query.get();
    const payments = [];

    snapshot.forEach(doc => {
      payments.push({ id: doc.id, ...doc.data() });
    });

    return { payments, hasMore: payments.length === limit };
  } catch (error) {
    console.error('Error getting user payments:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get payments');
  }
});

// Process refund
exports.processRefund = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { paymentId, amount, reason } = request.data;

  try {
    // Verify user is admin or payment owner
    const paymentDoc = await admin.firestore().collection('payments').doc(paymentId).get();
    
    if (!paymentDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Payment not found');
    }

    const payment = paymentDoc.data();
    
    if (payment.userId !== request.auth.uid && !(await isAdmin(request.auth.uid))) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized to process refund');
    }

    // Process refund via Razorpay
    const refund = await razorpay.payments.refund(payment.id, {
      amount: amount || payment.amount,
      notes: {
        reason: reason || 'Customer request',
        requestedBy: request.auth.uid
      }
    });

    // Save refund record
    const refundRef = admin.firestore().collection('refunds').doc();
    await refundRef.set({
      id: refund.id,
      entity: refund.entity,
      amount: refund.amount,
      currency: refund.currency,
      payment_id: refund.payment_id,
      status: refund.status,
      speed_processed: refund.speed_processed,
      speed_requested: refund.speed_requested,
      receipt: refund.receipt,
      notes: refund.notes,
      created_at: new Date(refund.created_at * 1000),
      userId: payment.userId,
      paymentId: paymentId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update payment record
    await paymentDoc.ref.update({
      amount_refunded: refund.amount,
      refund_status: refund.status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      refundId: refund.id,
      amount: refund.amount,
      status: refund.status
    };
  } catch (error) {
    console.error('Error processing refund:', error);
    throw new functions.https.HttpsError('internal', 'Failed to process refund');
  }
});

// Helper function to check if user is admin
async function isAdmin(userId) {
  const userDoc = await admin.firestore().collection('users').doc(userId).get();
  return userDoc.exists && userDoc.data().role === 'admin';
}
