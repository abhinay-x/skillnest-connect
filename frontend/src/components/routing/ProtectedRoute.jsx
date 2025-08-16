import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, requireAuth = true, allowedRoles = [], redirectTo = '/login' }) => {
  const { currentUser, userProfile, loading, isAuthenticated, hasRole, isProfileComplete, needsOnboarding } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: Checking route protection', {
    path: location.pathname,
    requireAuth,
    loading,
    currentUser: currentUser ? currentUser.uid : null,
    userProfile: userProfile ? { userType: userProfile.userType, displayName: userProfile.displayName } : null,
    isAuthenticated: isAuthenticated(),
    isProfileComplete: userProfile ? isProfileComplete() : null
  });


  if (loading) {
    console.log('ProtectedRoute: Still loading auth state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const authenticated = isAuthenticated();
  const profileComplete = userProfile ? isProfileComplete() : false;

  // If authentication is required but user is not authenticated
  if (requireAuth && !authenticated) {
    console.log('ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authentication is not required but user is authenticated
  if (!requireAuth && authenticated) {
    if (!profileComplete) {
      console.log('ProtectedRoute: User authenticated but profile incomplete, redirecting to onboarding');
      return <Navigate to="/onboarding" replace />;
    }
    const dashboardPath = userProfile?.userType === 'worker' ? '/worker/dashboard' : '/dashboard';
    console.log('ProtectedRoute: User authenticated with complete profile, redirecting to dashboard:', dashboardPath);
    return <Navigate to={dashboardPath} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && authenticated) {
    if (!userProfile?.userType) {
      console.error('ProtectedRoute: Missing userType in profile', userProfile);
      return <Navigate to="/unauthorized" replace />;
    }
    
    const hasRequiredRole = allowedRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      console.log('ProtectedRoute: User does not have required role. Has:', userProfile.userType, 'Required:', allowedRoles);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If user is authenticated but needs onboarding, redirect to onboarding
  // BUT don't redirect if we're already on the onboarding page
  if (requireAuth && authenticated && userProfile && needsOnboarding() && location.pathname !== '/onboarding') {
    console.log('ProtectedRoute: User needs onboarding, redirecting to onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  console.log('ProtectedRoute: Allowing access to route');
  return children;
};

export default ProtectedRoute;
