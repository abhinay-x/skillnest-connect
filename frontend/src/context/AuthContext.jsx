import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChange,
  signUpWithEmailAndPassword,
  signInWithEmail,
  signInWithGoogle,
  signInWithPhone,
  verifyOTP,
  resetPassword,
  changePassword,
  updateUserProfile,
  getUserProfile,
  signOutUser,
  setupRecaptcha,
  USER_TYPES
} from '../services/firebase/auth';
import { requestNotificationPermission } from '../services/firebase/messaging';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Get user profile from Firestore
        const { profile, error } = await getUserProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
          
          // Request notification permission for logged-in users
          if (profile.preferences?.notifications) {
            requestNotificationPermission();
          }
        } else if (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signup = async (email, password, additionalData = {}) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await signUpWithEmailAndPassword(email, password, additionalData);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await signInWithEmail(email, password);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const loginWithGoogle = async (additionalData = {}) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await signInWithGoogle(additionalData);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Phone authentication
  const loginWithPhone = async (phoneNumber, recaptchaVerifier) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await signInWithPhone(phoneNumber, recaptchaVerifier);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true, confirmationResult: result.confirmationResult };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyPhoneOTP = async (confirmationResult, otp, additionalData = {}) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await verifyOTP(confirmationResult, otp, additionalData);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const forgotPassword = async (email) => {
    try {
      setError(null);
      
      const result = await resetPassword(email);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Update password
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      
      const result = await changePassword(currentPassword, newPassword);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      const result = await updateUserProfile(currentUser.uid, profileData);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      // Update local profile state
      setUserProfile(prev => ({ ...prev, ...profileData }));
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);
      
      const result = await signOutUser();
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      setCurrentUser(null);
      setUserProfile(null);
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Setup reCAPTCHA
  const setupPhoneAuth = (containerId) => {
    return setupRecaptcha(containerId);
  };

  // Helper functions
  const isAuthenticated = () => !!currentUser;
  
  const isCustomer = () => userProfile?.userType === USER_TYPES.CUSTOMER;
  
  const isWorker = () => userProfile?.userType === USER_TYPES.WORKER;
  
  const isAdmin = () => userProfile?.userType === USER_TYPES.ADMIN;

  const hasRole = (role) => userProfile?.userType === role;

  const isProfileComplete = () => {
    if (!userProfile) return false;
    
    const requiredFields = ['displayName', 'email'];
    const profileFields = ['firstName', 'lastName', 'address', 'city', 'state'];
    
    const hasRequiredFields = requiredFields.every(field => userProfile[field]);
    const hasProfileFields = profileFields.every(field => userProfile.profile?.[field]);
    
    return hasRequiredFields && hasProfileFields;
  };

  const value = {
    // State
    currentUser,
    userProfile,
    loading,
    error,
    
    // Auth methods
    signup,
    login,
    loginWithGoogle,
    loginWithPhone,
    verifyPhoneOTP,
    forgotPassword,
    updatePassword,
    updateProfile,
    logout,
    setupPhoneAuth,
    
    // Helper methods
    isAuthenticated,
    isCustomer,
    isWorker,
    isAdmin,
    hasRole,
    isProfileComplete,
    
    // Clear error
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
