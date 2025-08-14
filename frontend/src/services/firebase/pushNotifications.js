import { messaging } from './config';
import { getToken, onMessage } from 'firebase/messaging';

class PushNotificationService {
  constructor() {
    this.token = null;
    this.permission = null;
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      
      if (permission === 'granted') {
        return await this.getToken();
      } else {
        console.log('Notification permission denied');
        return null;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return null;
    }
  }

  async getToken() {
    try {
      if (!messaging) {
        console.warn('Firebase messaging not initialized');
        return null;
      }

      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        console.warn('VAPID key not configured');
        return null;
      }

      this.token = await getToken(messaging, { vapidKey });
      
      if (this.token) {
        console.log('FCM Token:', this.token);
        return this.token;
      } else {
        console.log('No registration token available');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  onMessageReceived(callback) {
    if (!messaging) {
      console.warn('Firebase messaging not initialized');
      return () => {};
    }

    return onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      callback(payload);
    });
  }

  async sendNotification(userId, notification) {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          notification: {
            title: notification.title,
            body: notification.body,
            icon: notification.icon || '/logo192.png',
            badge: '/badge-72x72.png',
            ...notification.data
          }
        })
      });

      return response.json();
    } catch (error) {
      console.error('Error sending notification:', error);
      return { success: false, error: error.message };
    }
  }

  async subscribeToTopic(topic) {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: this.token,
          topic
        })
      });

      return response.json();
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      return { success: false, error: error.message };
    }
  }

  async unsubscribeFromTopic(topic) {
    try {
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: this.token,
          topic
        })
      });

      return response.json();
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
      return { success: false, error: error.message };
    }
  }

  async saveTokenToFirestore(userId, token) {
    try {
      await window.firebase.firestore().collection('users').doc(userId).update({
        fcmToken: token,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error saving token to Firestore:', error);
      return { success: false, error: error.message };
    }
  }

  async removeTokenFromFirestore(userId) {
    try {
      await window.firebase.firestore().collection('users').doc(userId).update({
        fcmToken: null,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error removing token from Firestore:', error);
      return { success: false, error: error.message };
    }
  }
}

export const pushNotificationService = new PushNotificationService();
export default pushNotificationService;
