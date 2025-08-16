const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } = require('firebase-functions/v2/firestore');
const { onCall, onRequest } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { setGlobalOptions } = require('firebase-functions/v2');

// Set global options
setGlobalOptions({
  maxInstances: 10,
  region: 'asia-south2'
});

// Initialize Firebase Admin
admin.initializeApp();

// Import all function modules
const auth = require('./auth');
const bookings = require('./bookings');
const orders = require('./orders');
const notifications = require('./notifications');
const payments = require('./payments');
const search = require('./search');

// Export all functions
module.exports = {
  ...auth,
  ...bookings,
  ...orders,
  ...notifications,
  ...payments,
  ...search
};
