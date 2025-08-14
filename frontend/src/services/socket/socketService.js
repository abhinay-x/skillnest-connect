import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  // Connect to socket server
  connect(userId, userType) {
    if (this.socket) {
      this.disconnect();
    }

    const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    this.socket = io(serverUrl, {
      auth: {
        userId,
        userType,
        token: localStorage.getItem('skillnest-token')
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventListeners();
    
    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('Socket connected:', this.socket.id);
        resolve(this.socket.id);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        reject(error);
      });
    });
  }

  // Disconnect from socket server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  // Setup default event listeners
  setupEventListeners() {
    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('Socket disconnected');
    });

    this.socket.on('reconnect', () => {
      this.isConnected = true;
      console.log('Socket reconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  // Join a room
  joinRoom(roomId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_room', roomId);
    }
  }

  // Leave a room
  leaveRoom(roomId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_room', roomId);
    }
  }

  // Send message
  sendMessage(chatId, message) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', {
        chatId,
        message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Listen for messages
  onMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
      this.listeners.set('new_message', callback);
    }
  }

  // Update location (for workers)
  updateLocation(location) {
    if (this.socket && this.isConnected) {
      this.socket.emit('update_location', location);
    }
  }

  // Listen for location updates
  onLocationUpdate(callback) {
    if (this.socket) {
      this.socket.on('location_update', callback);
      this.listeners.set('location_update', callback);
    }
  }

  // Update booking status
  updateBookingStatus(bookingId, status, data = {}) {
    if (this.socket && this.isConnected) {
      this.socket.emit('booking_status_update', {
        bookingId,
        status,
        ...data,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Listen for booking updates
  onBookingUpdate(callback) {
    if (this.socket) {
      this.socket.on('booking_update', callback);
      this.listeners.set('booking_update', callback);
    }
  }

  // Send notification
  sendNotification(userId, notification) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_notification', {
        userId,
        notification,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Listen for notifications
  onNotification(callback) {
    if (this.socket) {
      this.socket.on('notification', callback);
      this.listeners.set('notification', callback);
    }
  }

  // Worker availability status
  updateAvailability(isAvailable) {
    if (this.socket && this.isConnected) {
      this.socket.emit('update_availability', { isAvailable });
    }
  }

  // Listen for worker availability updates
  onAvailabilityUpdate(callback) {
    if (this.socket) {
      this.socket.on('availability_update', callback);
      this.listeners.set('availability_update', callback);
    }
  }

  // Typing indicators
  startTyping(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_start', { chatId });
    }
  }

  stopTyping(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_stop', { chatId });
    }
  }

  onTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
      this.listeners.set('user_typing', callback);
    }
  }

  // Generic event listener
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      this.listeners.set(event, callback);
    }
  }

  // Generic event emitter
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  // Remove event listener
  off(event) {
    if (this.socket && this.listeners.has(event)) {
      this.socket.off(event, this.listeners.get(event));
      this.listeners.delete(event);
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id || null
    };
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;

// Event types constants
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  
  // Rooms
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  
  // Messages
  SEND_MESSAGE: 'send_message',
  NEW_MESSAGE: 'new_message',
  
  // Typing
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  USER_TYPING: 'user_typing',
  
  // Location
  UPDATE_LOCATION: 'update_location',
  LOCATION_UPDATE: 'location_update',
  
  // Bookings
  BOOKING_STATUS_UPDATE: 'booking_status_update',
  BOOKING_UPDATE: 'booking_update',
  
  // Notifications
  SEND_NOTIFICATION: 'send_notification',
  NOTIFICATION: 'notification',
  
  // Worker status
  UPDATE_AVAILABILITY: 'update_availability',
  AVAILABILITY_UPDATE: 'availability_update',
  
  // Errors
  ERROR: 'error'
};
