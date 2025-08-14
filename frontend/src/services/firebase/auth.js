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
  reauthenticateWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';

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
      await setDoc(userRef, {
        displayName,
        email,
        phoneNumber,
        photoURL,
        createdAt,
        userType: additionalData.userType || USER_TYPES.CUSTOMER,
        isEmailVerified: user.emailVerified,
        isPhoneVerified: !!phoneNumber,
        profile: {
          firstName: additionalData.firstName || '',
          lastName: additionalData.lastName || '',
          address: additionalData.address || '',
          city: additionalData.city || '',
          state: additionalData.state || '',
          pincode: additionalData.pincode || '',
          dateOfBirth: additionalData.dateOfBirth || null,
          gender: additionalData.gender || ''
        },
        preferences: {
          notifications: true,
          emailUpdates: true,
          smsUpdates: false,
          theme: 'light',
          language: 'en'
        },
        status: 'active',
        ...additionalData
      });
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
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name if provided
    if (additionalData.displayName) {
      await updateProfile(user, {
        displayName: additionalData.displayName
      });
    }
    
    // Create user profile in Firestore
    await createUserProfile(user, additionalData);
    
    return { user, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { user: null, error: error.message };
  }
};

export const signInWithEmail = async (email, password) => {
  if (!auth) {
    return { user: null, error: 'Firebase auth not initialized. Please configure Firebase.' };
  }
  
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return { user, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { user: null, error: error.message };
  }
};

// Google Authentication
export const signInWithGoogle = async (additionalData = {}) => {
  if (!auth) {
    return { user: null, error: 'Firebase auth not initialized. Please configure Firebase.' };
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create user profile if it doesn't exist
    await createUserProfile(user, additionalData);
    
    return { user, error: null };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return { user: null, error: error.message };
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
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { confirmationResult, error: null };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { confirmationResult: null, error: error.message };
  }
};

export const verifyOTP = async (confirmationResult, otp, additionalData = {}) => {
  try {
    const { user } = await confirmationResult.confirm(otp);
    
    // Create user profile if it doesn't exist
    await createUserProfile(user, additionalData);
    
    return { user, error: null };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { user: null, error: error.message };
  }
};

// Password Reset
export const resetPassword = async (email) => {
  if (!auth) {
    return { success: false, error: 'Firebase auth not initialized. Please configure Firebase.' };
  }
  
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Update Password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    
    // Re-authenticate user
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await updatePassword(user, newPassword);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error changing password:', error);
    return { success: false, error: error.message };
  }
};

// Update Profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: new Date()
    });
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }
};

// Get User Profile
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { profile: userSnap.data(), error: null };
    } else {
      return { profile: null, error: 'User profile not found' };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { profile: null, error: error.message };
  }
};

// Sign Out
export const signOutUser = async () => {
  if (!auth) {
    return { success: false, error: 'Firebase auth not initialized. Please configure Firebase.' };
  }
  
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
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
  return auth.onAuthStateChanged(callback);
};
