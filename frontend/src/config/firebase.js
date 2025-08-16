// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";
import { getDatabase } from "firebase/database";
import { getFunctions } from "firebase/functions";

// Your Firebase configuration (from your console)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: "https://skillnest-portal-39ed4-default-rtdb.firebaseio.com"
};

// Validate configuration
if (!firebaseConfig.apiKey) {
  throw new Error('Missing Firebase API Key. Please check your .env file');
}

// Initialize Firebase app only if it doesn't exist
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);
const database = getDatabase(app);
const functions = getFunctions(app, 'asia-south2');

// Export for use in other files
export { app, auth, db, storage, messaging, database, functions };

// Backend URLs for your project
export const backendUrls = {
  functions: 'https://us-central1-skillnest-portal-39ed4.cloudfunctions.net',
  firestore: 'https://firestore.googleapis.com/v1/projects/skillnest-portal-39ed4/databases/(default)/documents',
  storage: 'gs://skillnest-portal-39ed4.firebasestorage.app'
};



// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyASAINwlKcyeNPxhtc72LmrZpu_cBYm3Y0",
//   authDomain: "skillnest-portal.firebaseapp.com",
//   projectId: "skillnest-portal",
//   storageBucket: "skillnest-portal.firebasestorage.app",
//   messagingSenderId: "547331327729",
//   appId: "1:547331327729:web:4c4af0aa897c494dbd0b50",
//   measurementId: "G-1MSHF6VB66"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);