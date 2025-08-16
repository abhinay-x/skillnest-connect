importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

// Your Firebase configuration (same as in firebase.js)
const firebaseConfig = {
  apiKey: "AIzaSyCVpQ_RKXkEQvYD_En1LLkU-3-iz0K9qtQ",
  authDomain: "skillnest-portal-39ed4.firebaseapp.com",
  projectId: "skillnest-portal-39ed4",
  storageBucket: "skillnest-portal-39ed4.firebasestorage.app",
  messagingSenderId: "645013827643",
  appId: "1:645013827643:web:4a4a747e7868491e322c1e",
  measurementId: "G-LWMZBJW9DZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Optional: Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message:', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/favicon.ico'
  };
  
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
