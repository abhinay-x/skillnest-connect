import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext.jsx';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordForm = ({ onSwitchToLogin }) => {
  const { forgotPassword, loading } = useAuth();
  const { showToast } = useNotifications();
  
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    setError('');
    
    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setEmailSent(true);
        showToast('Password reset email sent successfully!', 'success');
      } else {
        setError(result.error);
        showToast(result.error, 'error');
      }
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
      showToast('Failed to send reset email. Please try again.', 'error');
    }
  };

  if (emailSent) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Check Your Email
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => setEmailSent(false)}
              className="w-full"
            >
              Try Different Email
            </Button>
            
            <Button
              type="button"
              onClick={onSwitchToLogin}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Forgot Password?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            error={error}
            icon={<Mail className="w-5 h-5" />}
            required
          />

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Send Reset Link
          </Button>
        </form>

        <div className="mt-6">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="flex items-center justify-center w-full text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
