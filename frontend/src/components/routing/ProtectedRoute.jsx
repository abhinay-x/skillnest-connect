import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, requireAuth = true, allowedRoles = [], redirectTo = '/login' }) => {
  const { currentUser, userProfile, loading, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authentication is not required but user is authenticated, redirect to dashboard
  if (!requireAuth && isAuthenticated()) {
    const dashboardPath = userProfile?.userType === 'worker' ? '/worker/dashboard' : '/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  // If specific roles are required, check user role
  if (allowedRoles.length > 0 && isAuthenticated()) {
    const hasRequiredRole = allowedRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If user is authenticated but profile is incomplete, redirect to onboarding
  if (requireAuth && isAuthenticated() && userProfile && !isProfileComplete()) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Helper component for checking profile completion
const isProfileComplete = (userProfile) => {
  if (!userProfile) return false;
  
  const requiredFields = ['displayName', 'email'];
  const profileFields = ['firstName', 'lastName', 'address', 'city', 'state'];
  
  const hasRequiredFields = requiredFields.every(field => userProfile[field]);
  const hasProfileFields = profileFields.every(field => userProfile.profile?.[field]);
  
  return hasRequiredFields && hasProfileFields;
};

export default ProtectedRoute;
