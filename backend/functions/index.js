const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } = require('firebase-functions/v2/firestore');
const { onCall, onRequest } = require('firebase-functions/v2/https');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { setGlobalOptions } = require('firebase-functions/v2');

// Set global options
setGlobalOptions({
  maxInstances: 10,
  region: 'asia-south1'
});

// Initialize Firebase Admin
admin.initializeApp();

// Import all function modules
const authFunctions = require('./auth');
const bookingFunctions = require('./bookings');
const paymentFunctions = require('./payments');
const notificationFunctions = require('./notifications');
const chatFunctions = require('./chat');
const searchFunctions = require('./search');
const analyticsFunctions = require('./analytics');
const workerFunctions = require('./workers');
const customerFunctions = require('./customers');
const toolsFunctions = require('./tools');
const ecommerceFunctions = require('./ecommerce');

// Export all functions
module.exports = {
  ...authFunctions,
  ...bookingFunctions,
  ...paymentFunctions,
  ...notificationFunctions,
  ...chatFunctions,
  ...searchFunctions,
  ...analyticsFunctions,
  ...workerFunctions,
  ...customerFunctions,
  ...toolsFunctions,
  ...ecommerceFunctions
};
