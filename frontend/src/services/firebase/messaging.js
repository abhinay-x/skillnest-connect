import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './config';

// Request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    if (!messaging) {
      console.warn('Firebase messaging not supported in this browser');
      return { token: null, error: 'Messaging not supported' };
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      
      if (token) {
        console.log('FCM registration token:', token);
        return { token, error: null };
      } else {
        console.log('No registration token available.');
        return { token: null, error: 'No registration token available' };
      }
    } else {
      console.log('Unable to get permission to notify.');
      return { token: null, error: 'Permission denied' };
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
    return { token: null, error: error.message };
  }
};

// Listen for foreground messages
export const onForegroundMessage = (callback) => {
  if (!messaging) {
    console.warn('Firebase messaging not supported');
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    callback(payload);
  });
};

// Show notification
export const showNotification = (title, options = {}) => {
  if ('serviceWorker' in navigator && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options
        });
      });
    }
  }
};

// Notification types
export const NOTIFICATION_TYPES = {
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_CANCELLED: 'booking_cancelled',
  WORKER_ASSIGNED: 'worker_assigned',
  WORKER_ARRIVED: 'worker_arrived',
  JOB_COMPLETED: 'job_completed',
  PAYMENT_RECEIVED: 'payment_received',
  NEW_MESSAGE: 'new_message',
  NEW_REVIEW: 'new_review',
  SYSTEM_UPDATE: 'system_update'
};

// Handle different notification types
export const handleNotification = (payload) => {
  const { notification, data } = payload;
  
  switch (data?.type) {
    case NOTIFICATION_TYPES.BOOKING_CONFIRMED:
      showNotification('Booking Confirmed! 🎉', {
        body: notification.body || 'Your service booking has been confirmed.',
        icon: '/icons/booking-confirmed.png',
        tag: 'booking',
        actions: [
          { action: 'view', title: 'View Details' },
          { action: 'close', title: 'Close' }
        ]
      });
      break;
      
    case NOTIFICATION_TYPES.WORKER_ASSIGNED:
      showNotification('Worker Assigned! 👷', {
        body: notification.body || 'A worker has been assigned to your booking.',
        icon: '/icons/worker-assigned.png',
        tag: 'worker',
        actions: [
          { action: 'contact', title: 'Contact Worker' },
          { action: 'track', title: 'Track Location' }
        ]
      });
      break;
      
    case NOTIFICATION_TYPES.NEW_MESSAGE:
      showNotification('New Message 💬', {
        body: notification.body || 'You have a new message.',
        icon: '/icons/message.png',
        tag: 'message',
        actions: [
          { action: 'reply', title: 'Reply' },
          { action: 'view', title: 'View Chat' }
        ]
      });
      break;
      
    default:
      showNotification(notification.title || 'SkillNest Notification', {
        body: notification.body || 'You have a new notification.',
        icon: notification.icon || '/favicon.ico'
      });
  }
};

// Subscribe to topic (for admin/broadcast messages)
export const subscribeToTopic = async (token, topic) => {
  try {
    // This would typically be done on the server side
    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, topic })
    });
    
    if (response.ok) {
      console.log(`Subscribed to topic: ${topic}`);
      return { success: true, error: null };
    } else {
      throw new Error('Failed to subscribe to topic');
    }
  } catch (error) {
    console.error('Error subscribing to topic:', error);
    return { success: false, error: error.message };
  }
};

// Unsubscribe from topic
export const unsubscribeFromTopic = async (token, topic) => {
  try {
    const response = await fetch('/api/notifications/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, topic })
    });
    
    if (response.ok) {
      console.log(`Unsubscribed from topic: ${topic}`);
      return { success: true, error: null };
    } else {
      throw new Error('Failed to unsubscribe from topic');
    }
  } catch (error) {
    console.error('Error unsubscribing from topic:', error);
    return { success: false, error: error.message };
  }
};
