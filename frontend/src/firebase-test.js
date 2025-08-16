import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log("Firebase Test: Initializing with config", {
  ...firebaseConfig,
  apiKey: '***' + (firebaseConfig.apiKey ? firebaseConfig.apiKey.slice(-4) : '')
});

// Only initialize if no app exists
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();

// Test Firebase configuration without attempting sign-in
console.log("Firebase Test: Configuration loaded successfully");
console.log("Firebase Test: Auth instance created:", auth ? "✓" : "✗");

// Test API connectivity without credentials
const testApiConnectivity = async () => {
  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'testpass',
        returnSecureToken: false
      })
    });
    
    const data = await response.json();
    
    if (response.ok || data.error?.message?.includes('EMAIL_EXISTS')) {
      console.log("Firebase Test: API connectivity ✓");
    } else {
      console.log("Firebase Test: API response:", data);
    }
  } catch (error) {
    console.error("Firebase Test: API connectivity failed", error);
  }
};

testApiConnectivity();
