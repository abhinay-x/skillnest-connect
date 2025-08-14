import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import SignupForm from '../../components/auth/SignupForm';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

const AuthPage = () => {
  const location = useLocation();
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup', 'forgot-password'

  // Check if we should show signup by default (from URL or state)
  React.useEffect(() => {
    if (location.pathname.includes('signup') || location.state?.mode === 'signup') {
      setAuthMode('signup');
    } else if (location.pathname.includes('forgot-password')) {
      setAuthMode('forgot-password');
    }
  }, [location]);

  const handleSwitchToLogin = () => setAuthMode('login');
  const handleSwitchToSignup = () => setAuthMode('signup');
  const handleSwitchToForgotPassword = () => setAuthMode('forgot-password');

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            SkillNest
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Connect. Serve. Grow.
          </p>
        </div>

        {/* Auth Forms */}
        {authMode === 'login' && (
          <LoginForm
            onSwitchToSignup={handleSwitchToSignup}
            onForgotPassword={handleSwitchToForgotPassword}
          />
        )}

        {authMode === 'signup' && (
          <SignupForm
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}

        {authMode === 'forgot-password' && (
          <ForgotPasswordForm
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
