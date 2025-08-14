import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  requestNotificationPermission, 
  onForegroundMessage, 
  handleNotification,
  NOTIFICATION_TYPES 
} from '../services/firebase/messaging';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [fcmToken, setFcmToken] = useState(null);
  const [permission, setPermission] = useState('default');
  const [loading, setLoading] = useState(false);

  // Initialize notifications
  useEffect(() => {
    // Check current permission status
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('skillnest-notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error loading saved notifications:', error);
      }
    }

    // Setup foreground message listener
    const unsubscribe = onForegroundMessage((payload) => {
      handleForegroundNotification(payload);
    });

    return unsubscribe;
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('skillnest-notifications', JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Request notification permission
  const requestPermission = async () => {
    try {
      setLoading(true);
      const result = await requestNotificationPermission();
      
      if (result.token) {
        setFcmToken(result.token);
        setPermission('granted');
        return { success: true, token: result.token };
      } else {
        setPermission('denied');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Handle foreground notifications
  const handleForegroundNotification = (payload) => {
    const notification = {
      id: Date.now().toString(),
      title: payload.notification?.title || 'New Notification',
      body: payload.notification?.body || '',
      type: payload.data?.type || NOTIFICATION_TYPES.SYSTEM_UPDATE,
      data: payload.data || {},
      timestamp: new Date().toISOString(),
      read: false,
      priority: payload.data?.priority || 'normal'
    };

    // Add to notifications list
    addNotification(notification);

    // Handle the notification (show browser notification)
    handleNotification(payload);
  };

  // Add notification manually
  const addNotification = (notification) => {
    const newNotification = {
      id: notification.id || Date.now().toString(),
      title: notification.title,
      body: notification.body,
      type: notification.type || NOTIFICATION_TYPES.SYSTEM_UPDATE,
      data: notification.data || {},
      timestamp: notification.timestamp || new Date().toISOString(),
      read: false,
      priority: notification.priority || 'normal',
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 100)); // Keep only last 100 notifications
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Remove notification
  const removeNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Get notifications by type
  const getNotificationsByType = (type) => {
    return notifications.filter(notification => notification.type === type);
  };

  // Get unread notifications
  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.read);
  };

  // Show toast notification
  const showToast = (message, type = 'info', duration = 5000) => {
    const toast = {
      id: Date.now().toString(),
      message,
      type, // success, error, warning, info
      duration,
      timestamp: new Date().toISOString()
    };

    // Add to notifications as well
    addNotification({
      id: toast.id,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      body: message,
      type: NOTIFICATION_TYPES.SYSTEM_UPDATE,
      priority: type === 'error' ? 'high' : 'normal'
    });

    // You can integrate with a toast library here
    // For now, we'll just use browser notification if permission is granted
    if (permission === 'granted') {
      new Notification(type.charAt(0).toUpperCase() + type.slice(1), {
        body: message,
        icon: '/favicon.ico',
        tag: toast.id
      });
    }

    return toast.id;
  };

  // Create different types of notifications
  const notifyBookingConfirmed = (bookingData) => {
    addNotification({
      title: 'Booking Confirmed! 🎉',
      body: `Your booking for ${bookingData.serviceName} has been confirmed.`,
      type: NOTIFICATION_TYPES.BOOKING_CONFIRMED,
      data: { bookingId: bookingData.id },
      priority: 'high'
    });
  };

  const notifyWorkerAssigned = (workerData, bookingData) => {
    addNotification({
      title: 'Worker Assigned! 👷',
      body: `${workerData.name} has been assigned to your booking.`,
      type: NOTIFICATION_TYPES.WORKER_ASSIGNED,
      data: { 
        workerId: workerData.id, 
        bookingId: bookingData.id 
      },
      priority: 'high'
    });
  };

  const notifyWorkerArrived = (workerData) => {
    addNotification({
      title: 'Worker Arrived! 📍',
      body: `${workerData.name} has arrived at your location.`,
      type: NOTIFICATION_TYPES.WORKER_ARRIVED,
      data: { workerId: workerData.id },
      priority: 'high'
    });
  };

  const notifyJobCompleted = (bookingData) => {
    addNotification({
      title: 'Job Completed! ✅',
      body: `Your ${bookingData.serviceName} service has been completed.`,
      type: NOTIFICATION_TYPES.JOB_COMPLETED,
      data: { bookingId: bookingData.id },
      priority: 'high'
    });
  };

  const notifyPaymentReceived = (paymentData) => {
    addNotification({
      title: 'Payment Received! 💰',
      body: `Payment of ₹${paymentData.amount} has been received.`,
      type: NOTIFICATION_TYPES.PAYMENT_RECEIVED,
      data: { paymentId: paymentData.id },
      priority: 'normal'
    });
  };

  const notifyNewMessage = (messageData) => {
    addNotification({
      title: 'New Message 💬',
      body: `${messageData.senderName}: ${messageData.preview}`,
      type: NOTIFICATION_TYPES.NEW_MESSAGE,
      data: { 
        chatId: messageData.chatId,
        senderId: messageData.senderId 
      },
      priority: 'normal'
    });
  };

  const notifyNewReview = (reviewData) => {
    addNotification({
      title: 'New Review! ⭐',
      body: `You received a ${reviewData.rating}-star review.`,
      type: NOTIFICATION_TYPES.NEW_REVIEW,
      data: { reviewId: reviewData.id },
      priority: 'normal'
    });
  };

  // Check if notifications are supported
  const isSupported = () => {
    return 'Notification' in window && 'serviceWorker' in navigator;
  };

  // Get permission status
  const getPermissionStatus = () => {
    return permission;
  };

  const value = {
    // State
    notifications,
    unreadCount,
    fcmToken,
    permission,
    loading,
    
    // Methods
    requestPermission,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getNotificationsByType,
    getUnreadNotifications,
    showToast,
    
    // Specific notification methods
    notifyBookingConfirmed,
    notifyWorkerAssigned,
    notifyWorkerArrived,
    notifyJobCompleted,
    notifyPaymentReceived,
    notifyNewMessage,
    notifyNewReview,
    
    // Utilities
    isSupported,
    getPermissionStatus,
    
    // Constants
    NOTIFICATION_TYPES
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
