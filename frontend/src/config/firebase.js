// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

// Your Firebase configuration (from your console)
const firebaseConfig = {
  apiKey: "AIzaSyASAINwlKcyeNPxhtc72LmrZpu_cBYm3Y0",
  authDomain: "skillnest-portal.firebaseapp.com",
  projectId: "skillnest-portal",
  storageBucket: "skillnest-portal.firebasestorage.app",
  messagingSenderId: "547331327729",
  appId: "1:547331327729:web:4c4af0aa897c494dbd0b50",
  measurementId: "G-1MSHF6VB66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

// Export for use in other files
export { app, auth, db, storage, messaging };

// Backend URLs for your project
export const backendUrls = {
  functions: 'https://us-central1-skillnest-portal.cloudfunctions.net',
  firestore: 'https://firestore.googleapis.com/v1/projects/skillnest-portal/databases/(default)/documents',
  storage: 'gs://skillnest-portal.firebasestorage.app'
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