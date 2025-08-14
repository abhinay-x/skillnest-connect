import apiClient from './apiClient';

// Auth API endpoints
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  VERIFY_PHONE: '/auth/verify-phone',
  UPDATE_PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password'
};

// Login with email/password
export const loginWithCredentials = async (email, password) => {
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, {
      email,
      password
    });
    
    const { token, refreshToken, user } = response.data;
    
    // Store tokens
    localStorage.setItem('skillnest-token', token);
    localStorage.setItem('skillnest-refresh-token', refreshToken);
    
    return { success: true, user, token };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed'
    };
  }
};

// Register new user
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData);
    
    const { token, refreshToken, user } = response.data;
    
    // Store tokens
    localStorage.setItem('skillnest-token', token);
    localStorage.setItem('skillnest-refresh-token', refreshToken);
    
    return { success: true, user, token };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Registration failed'
    };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    
    // Clear tokens
    localStorage.removeItem('skillnest-token');
    localStorage.removeItem('skillnest-refresh-token');
    
    return { success: true };
  } catch (error) {
    // Even if API call fails, clear local tokens
    localStorage.removeItem('skillnest-token');
    localStorage.removeItem('skillnest-refresh-token');
    
    return { success: true };
  }
};

// Refresh token
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('skillnest-refresh-token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await apiClient.post(AUTH_ENDPOINTS.REFRESH, {
      refreshToken
    });
    
    const { token: newToken, refreshToken: newRefreshToken } = response.data;
    
    // Update tokens
    localStorage.setItem('skillnest-token', newToken);
    localStorage.setItem('skillnest-refresh-token', newRefreshToken);
    
    return { success: true, token: newToken };
  } catch (error) {
    // Clear invalid tokens
    localStorage.removeItem('skillnest-token');
    localStorage.removeItem('skillnest-refresh-token');
    
    return {
      success: false,
      error: error.response?.data?.message || 'Token refresh failed'
    };
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to send reset email'
    };
  }
};

// Reset password
export const resetPassword = async (token, newPassword) => {
  try {
    await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
      token,
      password: newPassword
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Password reset failed'
    };
  }
};

// Verify email
export const verifyEmail = async (token) => {
  try {
    await apiClient.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Email verification failed'
    };
  }
};

// Verify phone
export const verifyPhone = async (phone, otp) => {
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.VERIFY_PHONE, {
      phone,
      otp
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Phone verification failed'
    };
  }
};

// Update profile
export const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put(AUTH_ENDPOINTS.UPDATE_PROFILE, profileData);
    return { success: true, user: response.data.user };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Profile update failed'
    };
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    await apiClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Password change failed'
    };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return { success: true, user: response.data.user };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get user data'
    };
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('skillnest-token');
};

// Get stored token
export const getToken = () => {
  return localStorage.getItem('skillnest-token');
};
