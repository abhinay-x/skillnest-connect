const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { onCall, onDocumentCreated } = require('firebase-functions/v2/https');

// Send push notification
exports.sendPushNotification = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, title, body, data = {}, imageUrl } = request.data;

  try {
    // Get user FCM token
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    if (!userDoc.exists || !userDoc.data().fcmToken) {
      throw new functions.https.HttpsError('not-found', 'User or FCM token not found');
    }

    const fcmToken = userDoc.data().fcmToken;

    const message = {
      notification: {
        title: title,
        body: body
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK'
      },
      android: {
        priority: 'high',
        notification: {
          channel_id: 'default',
          sound: 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default'
          }
        }
      },
      token: fcmToken
    };

    if (imageUrl) {
      message.notification.imageUrl = imageUrl;
    }

    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);

    return { success: true, messageId: response };
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send notification');
  }
});

// Send notification to multiple users
exports.sendBulkNotification = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userIds, title, body, data = {} } = request.data;

  try {
    // Get FCM tokens for all users
    const tokens = [];
    for (const userId of userIds) {
      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      if (userDoc.exists && userDoc.data().fcmToken) {
        tokens.push(userDoc.data().fcmToken);
      }
    }

    if (tokens.length === 0) {
      throw new functions.https.HttpsError('not-found', 'No valid FCM tokens found');
    }

    const message = {
      notification: {
        title: title,
        body: body
      },
      data: data,
      android: {
        priority: 'high',
        notification: {
          channel_id: 'default',
          sound: 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default'
          }
        }
      },
      tokens: tokens
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log('Successfully sent bulk message:', response);

    return { 
      success: true, 
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses
    };
  } catch (error) {
    console.error('Error sending bulk notification:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send bulk notification');
  }
});

// Mark notification as read
exports.markNotificationAsRead = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { notificationId } = request.data;

  try {
    const notificationRef = admin.firestore().collection('notifications').doc(notificationId);
    const notificationDoc = await notificationRef.get();

    if (!notificationDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Notification not found');
    }

    const notification = notificationDoc.data();

    if (notification.userId !== request.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized');
    }

    await notificationRef.update({
      read: true,
      readAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw new functions.https.HttpsError('internal', 'Failed to mark notification as read');
  }
});

// Get user notifications
exports.getUserNotifications = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { limit = 20, lastDoc, unreadOnly = false } = request.data;

  try {
    let query = admin.firestore()
      .collection('notifications')
      .where('userId', '==', request.auth.uid)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (unreadOnly) {
      query = query.where('read', '==', false);
    }

    if (lastDoc) {
      const lastDocRef = await admin.firestore().collection('notifications').doc(lastDoc).get();
      query = query.startAfter(lastDocRef);
    }

    const snapshot = await query.get();
    const notifications = [];

    snapshot.forEach(doc => {
      notifications.push({ id: doc.id, ...doc.data() });
    });

    return { notifications, hasMore: notifications.length === limit };
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get notifications');
  }
});

// Mark all notifications as read
exports.markAllNotificationsAsRead = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const batch = admin.firestore().batch();
    
    const notificationsSnapshot = await admin.firestore()
      .collection('notifications')
      .where('userId', '==', request.auth.uid)
      .where('read', '==', false)
      .get();

    notificationsSnapshot.forEach(doc => {
      batch.update(doc.ref, {
        read: true,
        readAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();

    return { success: true, count: notificationsSnapshot.size };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw new functions.https.HttpsError('internal', 'Failed to mark all notifications as read');
  }
});

// Send notification when booking is created
exports.onBookingCreated = onDocumentCreated('bookings/{bookingId}', async (event) => {
  const booking = event.data.data();
  
  try {
    // Create notification for worker
    await admin.firestore().collection('notifications').add({
      userId: booking.workerId,
      title: 'New Booking Request',
      message: `You have a new booking request for ${booking.serviceName} on ${booking.bookingDate} at ${booking.bookingTime}`,
      type: 'booking_request',
      bookingId: event.params.bookingId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Send push notification to worker
    const workerDoc = await admin.firestore().collection('users').doc(booking.workerId).get();
    if (workerDoc.exists && workerDoc.data().fcmToken) {
      try {
        await admin.messaging().send({
          notification: {
            title: 'New Booking Request',
            body: `You have a new booking request for ${booking.serviceName}`
          },
          token: workerDoc.data().fcmToken
        });
      } catch (error) {
        console.error('Error sending push notification:', error);
      }
    }
  } catch (error) {
    console.error('Error creating booking notification:', error);
  }
});
