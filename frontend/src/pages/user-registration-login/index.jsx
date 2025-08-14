import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SocialAuthButtons from './components/SocialAuthButtons';
import LanguageSelector from './components/LanguageSelector';

const UserRegistrationLogin = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpData, setOtpData] = useState({ phone: '', otp: '' });
  const navigate = useNavigate();

  // Mock credentials for demonstration
  const mockCredentials = {
    customer: { email: 'customer@skillnest.com', password: 'Customer123!', phone: '9876543210' },
    worker: { email: 'worker@skillnest.com', password: 'Worker123!', phone: '9876543211' },
    admin: { email: 'admin@skillnest.com', password: 'Admin123!', phone: '9876543212' }
  };

  const handleLogin = async (formData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check mock credentials
      const isValidCredential = Object.values(mockCredentials)?.some(cred => 
        (cred?.email === formData?.emailOrPhone || cred?.phone === formData?.emailOrPhone) && 
        cred?.password === formData?.password
      );
      
      if (isValidCredential) {
        // Determine user role based on credentials
        let userRole = 'customer';
        if (formData?.emailOrPhone === mockCredentials?.worker?.email || formData?.emailOrPhone === mockCredentials?.worker?.phone) {
          userRole = 'worker';
        } else if (formData?.emailOrPhone === mockCredentials?.admin?.email || formData?.emailOrPhone === mockCredentials?.admin?.phone) {
          userRole = 'admin';
        }
        
        // Store user session
        localStorage.setItem('skillnest_user', JSON.stringify({
          role: userRole,
          email: formData?.emailOrPhone,
          isAuthenticated: true,
          loginTime: new Date()?.toISOString()
        }));
        
        // Redirect based on role
        if (userRole === 'worker') {
          navigate('/worker-profile-portfolio');
        } else {
          navigate('/service-discovery-search');
        }
      } else {
        alert('Invalid credentials. Please use:\nCustomer: customer@skillnest.com / Customer123!\nWorker: worker@skillnest.com / Worker123!');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store user session
      localStorage.setItem('skillnest_user', JSON.stringify({
        role: formData?.role,
        name: formData?.name,
        email: formData?.email,
        phone: formData?.phone,
        location: formData?.location,
        isAuthenticated: true,
        registrationTime: new Date()?.toISOString(),
        twoFactorEnabled: formData?.enableTwoFactor
      }));
      
      // Redirect to role-specific onboarding
      if (formData?.role === 'worker') {
        navigate('/worker-profile-portfolio', { state: { isNewUser: true } });
      } else {
        navigate('/service-discovery-search', { state: { isNewUser: true } });
      }
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful Google authentication
      localStorage.setItem('skillnest_user', JSON.stringify({
        role: 'customer',
        name: 'Google User',
        email: 'user@gmail.com',
        isAuthenticated: true,
        authMethod: 'google',
        loginTime: new Date()?.toISOString()
      }));
      
      navigate('/service-discovery-search');
    } catch (error) {
      alert('Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneOTP = () => {
    setShowOTPModal(true);
  };

  const handleOTPSubmit = async () => {
    if (!otpData?.phone || !otpData?.otp) {
      alert('Please enter both phone number and OTP');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (otpData?.otp === '123456') {
        localStorage.setItem('skillnest_user', JSON.stringify({
          role: 'customer',
          phone: otpData?.phone,
          isAuthenticated: true,
          authMethod: 'phone',
          loginTime: new Date()?.toISOString()
        }));
        
        setShowOTPModal(false);
        navigate('/service-discovery-search');
      } else {
        alert('Invalid OTP. Please use: 123456');
      }
    } catch (error) {
      alert('OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset link would be sent to your registered email/phone.');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-smooth"
            >
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-text-primary">SkillNest</span>
            </button>

            {/* Language Selector */}
            <LanguageSelector />
          </div>
        </div>
      </header>
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md space-y-8">
            {/* Welcome Message */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                {activeTab === 'login' ? 'Welcome Back!' : 'Join SkillNest'}
              </h1>
              <p className="text-text-secondary">
                {activeTab === 'login' ?'Sign in to access your account and continue your journey' :'Create your account and start connecting with skilled professionals'
                }
              </p>
            </div>

            {/* Auth Tabs */}
            <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Social Auth Buttons */}
            <SocialAuthButtons
              onGoogleAuth={handleGoogleAuth}
              onPhoneOTP={handlePhoneOTP}
              isLoading={isLoading}
            />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-text-secondary">or</span>
              </div>
            </div>

            {/* Forms */}
            {activeTab === 'login' ? (
              <LoginForm
                onSubmit={handleLogin}
                isLoading={isLoading}
                onForgotPassword={handleForgotPassword}
              />
            ) : (
              <RegisterForm
                onSubmit={handleRegister}
                isLoading={isLoading}
              />
            )}

            {/* Footer Links */}
            <div className="text-center text-sm text-text-secondary">
              <p>
                By continuing, you agree to our{' '}
                <button className="text-primary hover:text-primary/80 transition-smooth">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button className="text-primary hover:text-primary/80 transition-smooth">
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Hero Image (Desktop Only) */}
        <div className="hidden lg:flex lg:flex-1 bg-muted">
          <div className="flex-1 flex flex-col justify-center items-center p-12">
            <div className="max-w-lg text-center space-y-6">
              <div className="w-full h-64 overflow-hidden rounded-lg">
                <Image
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&h=300&fit=crop"
                  alt="Professional service workers"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-text-primary">
                  Connect with Skilled Professionals
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Join thousands of customers and service providers who trust SkillNest 
                  for quality home services, tool rentals, and professional connections.
                </p>
                
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon name="Users" size={24} className="text-primary" />
                    </div>
                    <p className="text-xs text-text-secondary">10,000+ Professionals</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon name="Star" size={24} className="text-success" />
                    </div>
                    <p className="text-xs text-text-secondary">4.8 Average Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon name="Shield" size={24} className="text-accent" />
                    </div>
                    <p className="text-xs text-text-secondary">Verified & Trusted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* OTP Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Phone Verification</h3>
              <button
                onClick={() => setShowOTPModal(false)}
                className="text-text-secondary hover:text-text-primary transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Phone Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-text-secondary text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={otpData?.phone}
                    onChange={(e) => setOtpData(prev => ({ ...prev, phone: e?.target?.value }))}
                    className="flex-1 px-3 py-2 border border-border rounded-r-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  OTP Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP (use: 123456)"
                  value={otpData?.otp}
                  onChange={(e) => setOtpData(prev => ({ ...prev, otp: e?.target?.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  maxLength={6}
                />
                <p className="text-xs text-text-secondary mt-1">
                  Demo OTP: 123456
                </p>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowOTPModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-md text-text-secondary hover:bg-muted transition-smooth"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOTPSubmit}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-smooth"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRegistrationLogin;