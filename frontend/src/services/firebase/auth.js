import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

// User types
export const USER_TYPES = {
  CUSTOMER: 'customer',
  WORKER: 'worker',
  ADMIN: 'admin'
};

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Create user profile in Firestore
export const createUserProfile = async (user, additionalData = {}) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const snapShot = await getDoc(userRef);
  
  if (!snapShot.exists()) {
    const { displayName, email, phoneNumber, photoURL } = user;
    const createdAt = new Date();
    
    try {
      const finalDisplayName = additionalData.displayName || displayName || '';
      
      await setDoc(userRef, {
        displayName: finalDisplayName,
        email,
        phoneNumber: phoneNumber || '',
        photoURL: photoURL || '',
        userType: additionalData.userType || USER_TYPES.CUSTOMER, // Ensure role is always set
        createdAt,
        updatedAt: createdAt,
        ...additionalData
      });
      
      console.log('User profile created with type:', additionalData.userType || USER_TYPES.CUSTOMER);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }
  
  return userRef;
};

// Email/Password Authentication
export const signUpWithEmailAndPassword = async (email, password, additionalData = {}) => {
  if (!auth) {
    return { user: null, error: 'Firebase auth not initialized. Please configure Firebase.' };
  }
  
  try {
    console.log('Starting signup for:', email);
    console.log('Firebase Auth Config:', {
      ...auth.app.options,
      apiKey: '***' + (auth.app.options.apiKey ? auth.app.options.apiKey.slice(-4) : '')
    });
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User created in Firebase Auth:', user.uid);
    
    // Update display name if provided
    if (additionalData.displayName) {
      await updateProfile(user, {
        displayName: additionalData.displayName
      });
      console.log('Display name updated in Firebase Auth');
    }
    
    // Create user profile in Firestore with email included
    const profileData = {
      ...additionalData,
      email: email // Ensure email is always included
    };
    await createUserProfile(user, profileData);
    console.log('User profile created in Firestore');
    
    // Force a refresh of the user to get the latest data
    await user.reload();
    
    return { user, error: null };
  } catch (error) {
    console.error('Error signing up:', {
      code: error.code,
      message: error.message,
      email: email,
      timestamp: new Date().toISOString()
    });
    
    let friendlyMessage = 'Failed to sign up. Please try again.';
    
    switch (error.code) {
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid': 
        friendlyMessage = 'Invalid Firebase configuration. Please contact support.';
        if (typeof window.testFirebaseApiKey === 'function') {
          console.warn('Detected invalid API key. Running test function...');
          try {
            await window.testFirebaseApiKey();
          } catch (testError) {
            console.error('API Key Test Function Error:', testError);
          }
        }
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        friendlyMessage = 'Invalid email or password.';
        break;
      case 'auth/network-request-failed':
        friendlyMessage = 'Network error. Please check your internet connection.';
        break;
    }
    
    throw new Error(friendlyMessage);
  }
};

export const signInWithEmail = async (email, password) => {
  if (!auth) {
    return { user: null, error: 'Firebase auth not initialized. Please configure Firebase.' };
  }
  
  try {
    console.log('Firebase Auth Config:', {
      ...auth.app.options,
      apiKey: '***' + (auth.app.options.apiKey ? auth.app.options.apiKey.slice(-4) : '')
    });
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return { user, error: null };
  } catch (error) {
    console.error('Error signing in:', {
      code: error.code,
      message: error.message,
      email: email,
      timestamp: new Date().toISOString()
    });
    
    let friendlyMessage = 'Failed to sign in. Please try again.';
    
    switch (error.code) {
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid': 
        friendlyMessage = 'Invalid Firebase configuration. Please contact support.';
        if (typeof window.testFirebaseApiKey === 'function') {
          console.warn('Detected invalid API key. Running test function...');
          try {
            await window.testFirebaseApiKey();
          } catch (testError) {
            console.error('API Key Test Function Error:', testError);
          }
        }
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        friendlyMessage = 'Invalid email or password.';
        break;
      case 'auth/network-request-failed':
        friendlyMessage = 'Network error. Please check your internet connection.';
        break;
    }
    
    throw new Error(friendlyMessage);
  }
};

// Google Authentication
export const signInWithGoogle = async (additionalData = {}) => {
  if (!auth) {
    return { user: null, error: 'Firebase auth not initialized. Please configure Firebase.' };
  }
  
  try {
    console.log('Firebase Auth Config:', {
      ...auth.app.options,
      apiKey: '***' + (auth.app.options.apiKey ? auth.app.options.apiKey.slice(-4) : '')
    });
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create user profile if it doesn't exist
    await createUserProfile(user, additionalData);
    
    return { user, error: null };
  } catch (error) {
    console.error('Error signing in with Google:', {
      code: error.code,
      message: error.message,
      timestamp: new Date().toISOString()
    });
    
    let friendlyMessage = 'Failed to sign in with Google. Please try again.';
    
    switch (error.code) {
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid': 
        friendlyMessage = 'Invalid Firebase configuration. Please contact support.';
        if (typeof window.testFirebaseApiKey === 'function') {
          console.warn('Detected invalid API key. Running test function...');
          try {
            await window.testFirebaseApiKey();
          } catch (testError) {
            console.error('API Key Test Function Error:', testError);
          }
        }
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        friendlyMessage = 'Invalid email or password.';
        break;
      case 'auth/network-request-failed':
        friendlyMessage = 'Network error. Please check your internet connection.';
        break;
    }
    
    throw new Error(friendlyMessage);
  }
};

// Phone Authentication
export const setupRecaptcha = (containerId) => {
  if (!auth) {
    console.warn('Firebase auth not initialized. Cannot setup reCAPTCHA.');
    return null;
  }
  
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: (response) => {
      console.log('reCAPTCHA solved');
    }
  });
};

export const signInWithPhone = async (phoneNumber, recaptchaVerifier) => {
  if (!auth) {
    return { confirmationResult: null, error: 'Firebase auth not initialized. Please configure Firebase.' };
  }
  
  try {
    console.log('Firebase Auth Config:', {
      ...auth.app.options,
      apiKey: '***' + (auth.app.options.apiKey ? auth.app.options.apiKey.slice(-4) : '')
    });
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { confirmationResult, error: null };
  } catch (error) {
    console.error('Error sending OTP:', {
      code: error.code,
      message: error.message,
      phoneNumber: phoneNumber,
      timestamp: new Date().toISOString()
    });
    
    let friendlyMessage = 'Failed to send OTP. Please try again.';
    
    switch (error.code) {
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid': 
        friendlyMessage = 'Invalid Firebase configuration. Please contact support.';
        if (typeof window.testFirebaseApiKey === 'function') {
          console.warn('Detected invalid API key. Running test function...');
          try {
            await window.testFirebaseApiKey();
          } catch (testError) {
            console.error('API Key Test Function Error:', testError);
          }
        }
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        friendlyMessage = 'Invalid phone number or password.';
        break;
      case 'auth/network-request-failed':
        friendlyMessage = 'Network error. Please check your internet connection.';
        break;
    }
    
    throw new Error(friendlyMessage);
  }
};

export const verifyOTP = async (confirmationResult, otp, additionalData = {}) => {
  try {
    console.log('Firebase Auth Config:', {
      ...auth.app.options,
      apiKey: '***' + (auth.app.options.apiKey ? auth.app.options.apiKey.slice(-4) : '')
    });
    const { user } = await confirmationResult.confirm(otp);
    
    // Create user profile if it doesn't exist
    await createUserProfile(user, additionalData);
    
    return { user, error: null };
  } catch (error) {
    console.error('Error verifying OTP:', {
      code: error.code,
      message: error.message,
      otp: otp,
      timestamp: new Date().toISOString()
    });
    
    let friendlyMessage = 'Failed to verify OTP. Please try again.';
    
    switch (error.code) {
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid': 
        friendlyMessage = 'Invalid Firebase configuration. Please contact support.';
        if (typeof window.testFirebaseApiKey === 'function') {
          console.warn('Detected invalid API key. Running test function...');
          try {
            await window.testFirebaseApiKey();
          } catch (testError) {
            console.error('API Key Test Function Error:', testError);
          }
        }
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        friendlyMessage = 'Invalid OTP.';
        break;
      case 'auth/network-request-failed':
        friendlyMessage = 'Network error. Please check your internet connection.';
        break;
    }
    
    throw new Error(friendlyMessage);
  }
};

// Password Reset
export const resetPassword = async (email) => {
  if (!auth) {
    return { success: false, error: 'Firebase auth not initialized. Please configure Firebase.' };
  }
  
  try {
    console.log('Firebase Auth Config:', {
      ...auth.app.options,
      apiKey: '***' + (auth.app.options.apiKey ? auth.app.options.apiKey.slice(-4) : '')
    });
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error) {
    console.error('Error sending password reset email:', {
      code: error.code,
      message: error.message,
      email: email,
      timestamp: new Date().toISOString()
    });
    
    let friendlyMessage = 'Failed to send password reset email. Please try again.';
    
    switch (error.code) {
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid': 
        friendlyMessage = 'Invalid Firebase configuration. Please contact support.';
        if (typeof window.testFirebaseApiKey === 'function') {
          console.warn('Detected invalid API key. Running test function...');
          try {
            await window.testFirebaseApiKey();
          } catch (testError) {
            console.error('API Key Test Function Error:', testError);
          }
        }
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        friendlyMessage = 'Invalid email or password.';
        break;
      case 'auth/network-request-failed':
        friendlyMessage = 'Network error. Please check your internet connection.';
        break;
    }
    
    throw new Error(friendlyMessage);
  }
};

// Update Password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    console.log('Firebase Auth Config:', {
      ...auth.app.options,
      apiKey: '***' + (auth.app.options.apiKey ? auth.app.options.apiKey.slice(-4) : '')
    });
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    
    // Re-authenticate user
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await updatePassword(user, newPassword);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error changing password:', {
      code: error.code,
      message: error.message,
      currentPassword: currentPassword,
      newPassword: newPassword,
      timestamp: new Date().toISOString()
    });
    
    let friendlyMessage = 'Failed to change password. Please try again.';
    
    switch (error.code) {
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid': 
        friendlyMessage = 'Invalid Firebase configuration. Please contact support.';
        if (typeof window.testFirebaseApiKey === 'function') {
          console.warn('Detected invalid API key. Running test function...');
          try {
            await window.testFirebaseApiKey();
          } catch (testError) {
            console.error('API Key Test Function Error:', testError);
          }
        }
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        friendlyMessage = 'Invalid email or password.';
        break;
      case 'auth/network-request-failed':
        friendlyMessage = 'Network error. Please check your internet connection.';
        break;
    }
    
    throw new Error(friendlyMessage);
  }
};

// Update Profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    console.log('Firebase Auth Config:', {
      ...auth.app.options,
      apiKey: '***' + (auth.app.options.apiKey ? auth.app.options.apiKey.slice(-4) : '')
    });
    const userRef = doc(db, 'users', userId);
    
    // Prepare the update data with proper nesting
    const updateData = {
      updatedAt: new Date()
    };
    
    // If profile object is provided, merge it with existing profile
    if (profileData.profile) {
      // Use dot notation to update nested fields
      Object.keys(profileData.profile).forEach(key => {
        updateData[`profile.${key}`] = profileData.profile[key];
      });
    }
    
    // Add any other top-level fields
    Object.keys(profileData).forEach(key => {
      if (key !== 'profile') {
        updateData[key] = profileData[key];
      }
    });
    
    console.log('Updating Firestore with:', updateData);
    await updateDoc(userRef, updateData);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating profile:', {
      code: error.code,
      message: error.message,
      userId: userId,
      profileData: profileData,
      timestamp: new Date().toISOString()
    });
    
    let friendlyMessage = 'Failed to update profile. Please try again.';
    
    switch (error.code) {
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid': 
        friendlyMessage = 'Invalid Firebase configuration. Please contact support.';
        if (typeof window.testFirebaseApiKey === 'function') {
          console.warn('Detected invalid API key. Running test function...');
          try {
            await window.testFirebaseApiKey();
          } catch (testError) {
            console.error('API Key Test Function Error:', testError);
          }
        }
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        friendlyMessage = 'Invalid email or password.';
        break;
      case 'auth/network-request-failed':
        friendlyMessage = 'Network error. Please check your internet connection.';
        break;
    }
    
    throw new Error(friendlyMessage);
  }
};

// Get User Profile
export const getUserProfile = async (userId) => {
  try {
    console.log('Firebase Auth Config:', {
      ...auth.app.options,
      apiKey: '***' + (auth.app.options.apiKey ? auth.app.options.apiKey.slice(-4) : '')
    });
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { profile: userSnap.data(), error: null };
    } else {
      // If profile doesn't exist, create a basic one
      const basicProfile = {
        createdAt: new Date(),
        userType: USER_TYPES.CUSTOMER,
        isEmailVerified: false,
        isPhoneVerified: false,
        profile: {
          firstName: '',
          lastName: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          dateOfBirth: null,
          gender: ''
        },
        preferences: {
          notifications: true,
          emailUpdates: true,
          smsUpdates: false,
          theme: 'light',
          language: 'en'
        },
        status: 'active'
      };
      
      await setDoc(userRef, basicProfile);
      return { profile: basicProfile, error: null };
    }
  } catch (error) {
    console.error('Error getting user profile:', {
      code: error.code,
      message: error.message,
      userId: userId,
      timestamp: new Date().toISOString()
    });
    
    let friendlyMessage = 'Failed to get user profile. Please try again.';
    
    switch (error.code) {
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid': 
        friendlyMessage = 'Invalid Firebase configuration. Please contact support.';
        if (typeof window.testFirebaseApiKey === 'function') {
          console.warn('Detected invalid API key. Running test function...');
          try {
            await window.testFirebaseApiKey();
          } catch (testError) {
            console.error('API Key Test Function Error:', testError);
          }
        }
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        friendlyMessage = 'Invalid email or password.';
        break;
      case 'auth/network-request-failed':
        friendlyMessage = 'Network error. Please check your internet connection.';
        break;
    }
    
    throw new Error(friendlyMessage);
  }
};

// Sign Out
export const signOutUser = async () => {
  if (!auth) {
    return { success: false, error: 'Firebase auth not initialized. Please configure Firebase.' };
  }
  
  try {
    console.log('Firebase Auth Config:', {
      ...auth.app.options,
      apiKey: '***' + (auth.app.options.apiKey ? auth.app.options.apiKey.slice(-4) : '')
    });
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    console.error('Error signing out:', {
      code: error.code,
      message: error.message,
      timestamp: new Date().toISOString()
    });
    
    let friendlyMessage = 'Failed to sign out. Please try again.';
    
    switch (error.code) {
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid': 
        friendlyMessage = 'Invalid Firebase configuration. Please contact support.';
        if (typeof window.testFirebaseApiKey === 'function') {
          console.warn('Detected invalid API key. Running test function...');
          try {
            await window.testFirebaseApiKey();
          } catch (testError) {
            console.error('API Key Test Function Error:', testError);
          }
        }
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        friendlyMessage = 'Invalid email or password.';
        break;
      case 'auth/network-request-failed':
        friendlyMessage = 'Network error. Please check your internet connection.';
        break;
    }
    
    throw new Error(friendlyMessage);
  }
};

// Auth state observer
export const onAuthStateChange = (callback) => {
  if (!auth) {
    console.warn('Firebase auth not initialized. Running in demo mode.');
    // Call callback with null user to indicate no authentication
    callback(null);
    // Return a dummy unsubscribe function
    return () => {};
  }
  
  console.log('Setting up auth state listener');
  return auth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user ? `${user.email} (${user.uid})` : 'null');
    callback(user);
  });
};

onAuthStateChanged(auth, (user) => {
  console.log('Current user:', user ? user.uid : 'No user signed in');
});

// Debug function
export const testAuthConnection = async () => {
  try {
    const auth = getAuth();
    console.log('Auth instance created', auth);
    
    // Test API connectivity
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${import.meta.env.VITE_FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'wrongpassword',
          returnSecureToken: true
        })
      }
    );
    
    const data = await response.json();
    console.log('Auth API response:', data);
    
    return data;
  } catch (error) {
    console.error('Auth test failed:', error);
    throw error;
  }
};
