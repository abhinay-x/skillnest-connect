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
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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

  // Improved profile fetching with error handling
  const getUserProfile = async (user) => {
    if (!user) return null;
    
    try {
      const profileDoc = await getDoc(doc(db, 'users', user.uid));
      return profileDoc.exists() ? { id: profileDoc.id, ...profileDoc.data() } : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };

  // Auth state listener
  useEffect(() => {
    console.log('AuthContext: Setting up auth state listener');
    let isMounted = true; // Track if component is still mounted
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return; // Prevent state updates if component unmounted
      
      if (user) {
        try {
          // Wait for user to be fully authenticated
          await user.getIdToken();
          console.log('AuthContext: User authenticated, fetching profile for:', user.uid);
          
          // Add a small delay to ensure Firebase auth is fully ready
          setTimeout(async () => {
            if (!isMounted) return; // Check again after timeout
            
            try {
              const profile = await getUserProfile(user);
              if (isMounted) {
                setCurrentUser(user);
                setUserProfile(profile);
                setLoading(false);
                console.log('AuthContext: Profile loaded successfully');
              }
            } catch (profileError) {
              console.error('Error loading profile after delay:', profileError);
              if (isMounted) {
                // Set user but no profile if profile fetch fails
                setCurrentUser(user);
                setUserProfile(null);
                setLoading(false);
              }
            }
          }, 100);
          
        } catch (error) {
          console.error('Auth state error:', error);
          if (isMounted) {
            setCurrentUser(null);
            setUserProfile(null);
            setLoading(false);
          }
        }
      } else {
        if (isMounted) {
          setCurrentUser(null);
          setUserProfile(null);
          setLoading(false);
          console.log('AuthContext: No user, clearing profile');
        }
      }
    });

    return () => {
      isMounted = false; // Mark as unmounted
      unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signup = async (email, password, additionalData = {}) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('AuthContext: Starting signup process for:', email);
      const result = await signUpWithEmailAndPassword(email, password, additionalData);
      
      if (result.error) {
        setError(result.error);
        console.error('AuthContext: Signup error:', result.error);
        return { success: false, error: result.error };
      }
      
      console.log('AuthContext: Signup successful, user created:', result.user.uid);
      
      // Don't manually set loading to false here - let the auth state listener handle it
      // The auth state change will trigger and set the user and profile
      
      return { success: true, user: result.user };
    } catch (error) {
      setError(error.message);
      console.error('AuthContext: Signup exception:', error);
      setLoading(false); // Only set loading false on error
      return { success: false, error: error.message };
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
        setLoading(false); // Only set loading false on error
        return { success: false, error: result.error };
      }
      
      // Don't set loading to false here - let the auth state listener handle it
      // The auth state change will trigger and manage the loading state
      return { success: true, user: result.user };
    } catch (error) {
      setError(error.message);
      setLoading(false); // Only set loading false on error
      return { success: false, error: error.message };
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
        setLoading(false); // Only set loading false on error
        return { success: false, error: result.error };
      }
      
      // Don't set loading to false here - let the auth state listener handle it
      return { success: true, user: result.user };
    } catch (error) {
      setError(error.message);
      setLoading(false); // Only set loading false on error
      return { success: false, error: error.message };
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
        setLoading(false); // Only set loading false on error
        return { success: false, error: result.error };
      }
      
      setLoading(false); // Set loading false for phone auth since it doesn't complete login
      return { success: true, confirmationResult: result.confirmationResult };
    } catch (error) {
      setError(error.message);
      setLoading(false); // Only set loading false on error
      return { success: false, error: error.message };
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
        setLoading(false); // Only set loading false on error
        return { success: false, error: result.error };
      }
      
      // Don't set loading to false here - let the auth state listener handle it
      return { success: true, user: result.user };
    } catch (error) {
      setError(error.message);
      setLoading(false); // Only set loading false on error
      return { success: false, error: error.message };
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
      
      // Immediately update local state with the new data
      setUserProfile(prev => {
        const updated = { ...prev };
        
        // Update displayName if provided
        if (profileData.displayName) {
          updated.displayName = profileData.displayName;
        }
        
        // Merge profile object if provided
        if (profileData.profile) {
          updated.profile = { ...prev?.profile, ...profileData.profile };
        }
        
        // Merge other top-level fields
        Object.keys(profileData).forEach(key => {
          if (key !== 'profile' && key !== 'displayName') {
            updated[key] = profileData[key];
          }
        });
        
        console.log('Updated local userProfile:', updated);
        return updated;
      });
      
      // Wait a moment for Firestore to update, then fetch the latest profile
      setTimeout(async () => {
        const { profile } = await getUserProfile(currentUser.uid);
        if (profile) {
          console.log('Fetched updated profile from Firestore:', profile);
          setUserProfile(profile);
        }
      }, 1000);
      
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
  const isAuthenticated = () => {
    const authenticated = !!currentUser;
    console.log('AuthContext: isAuthenticated check:', authenticated, currentUser ? currentUser.uid : 'no user');
    return authenticated;
  };
  
  const isCustomer = () => userProfile?.userType === USER_TYPES.CUSTOMER;
  
  const isWorker = () => userProfile?.userType === USER_TYPES.WORKER;
  
  const isAdmin = () => userProfile?.userType === USER_TYPES.ADMIN;

  const hasRole = (role) => userProfile?.userType === role;

  const isProfileComplete = () => {
    if (!userProfile) {
      console.log('Profile completeness check: No userProfile');
      return false;
    }
    
    // For basic profile completeness, only check essential fields
    const essentialFields = ['email'];
    const hasEssentialFields = essentialFields.every(field => 
      userProfile[field] && userProfile[field].trim() !== ''
    );
    
    // Check if user has at least a display name or first/last name
    const hasName = (userProfile.displayName && userProfile.displayName.trim() !== '') ||
                   (userProfile.profile?.firstName && userProfile.profile.firstName.trim() !== '');
    
    const isComplete = hasEssentialFields && hasName;
    
    console.log('Profile completeness check:', {
      email: userProfile.email,
      displayName: userProfile.displayName,
      firstName: userProfile.profile?.firstName,
      hasEssentialFields,
      hasName,
      complete: isComplete
    });
    
    return isComplete;
  };
  
  // Separate function for checking if full onboarding is needed
  const needsOnboarding = () => {
    if (!userProfile) return true;
    
    // More lenient onboarding check - only require essential fields
    const essentialOnboardingFields = ['firstName'];
    const hasEssentialOnboardingFields = essentialOnboardingFields.every(field => 
      userProfile.profile?.[field] && userProfile.profile[field].trim() !== ''
    );
    
    // Also check if user has a displayName as alternative to firstName
    const hasDisplayName = userProfile.displayName && userProfile.displayName.trim() !== '';
    
    const needsOnboard = !hasEssentialOnboardingFields && !hasDisplayName;
    
    console.log('Onboarding check:', {
      userProfile: userProfile,
      firstName: userProfile.profile?.firstName,
      displayName: userProfile.displayName,
      hasEssentialOnboardingFields,
      hasDisplayName,
      needsOnboard
    });
    
    return needsOnboard;
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
    needsOnboarding,
    
    // Clear error
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
