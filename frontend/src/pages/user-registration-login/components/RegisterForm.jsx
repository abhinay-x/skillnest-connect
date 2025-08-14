import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import RoleSelectionCard from './RoleSelectionCard';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const RegisterForm = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
    agreeToTerms: false,
    enableTwoFactor: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roleOptions = [
    {
      role: 'customer',
      title: 'Customer',
      description: 'Find and book skilled professionals for your home and business needs',
      icon: 'User'
    },
    {
      role: 'worker',
      title: 'Service Provider',
      description: 'Offer your skills and services to customers in your area',
      icon: 'Wrench'
    }
  ];

  const locationOptions = [
    { value: '', label: 'Select your location' },
    { value: 'mumbai', label: 'Mumbai, Maharashtra' },
    { value: 'delhi', label: 'Delhi, NCR' },
    { value: 'bangalore', label: 'Bangalore, Karnataka' },
    { value: 'hyderabad', label: 'Hyderabad, Telangana' },
    { value: 'chennai', label: 'Chennai, Tamil Nadu' },
    { value: 'kolkata', label: 'Kolkata, West Bengal' },
    { value: 'pune', label: 'Pune, Maharashtra' },
    { value: 'ahmedabad', label: 'Ahmedabad, Gujarat' },
    { value: 'jaipur', label: 'Jaipur, Rajasthan' },
    { value: 'lucknow', label: 'Lucknow, Uttar Pradesh' }
  ];

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData?.role) {
      newErrors.role = 'Please select your role';
    }
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData?.name?.trim()?.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/?.test(formData?.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData?.location) {
      newErrors.location = 'Please select your location';
    }

    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (step === 2 && validateStep2()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e?.target?.checked : e?.target?.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
    if (errors?.role) {
      setErrors(prev => ({ ...prev, role: '' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-text-secondary'
          }`}>
            {step > 1 ? <Icon name="Check" size={16} /> : '1'}
          </div>
          <span className="ml-2 text-sm text-text-secondary">Role</span>
        </div>
        
        <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
        
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-text-secondary'
          }`}>
            2
          </div>
          <span className="ml-2 text-sm text-text-secondary">Details</span>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Choose Your Role
              </h3>
              <div className="space-y-4">
                {roleOptions?.map((option) => (
                  <RoleSelectionCard
                    key={option?.role}
                    {...option}
                    isSelected={formData?.role === option?.role}
                    onSelect={handleRoleSelect}
                  />
                ))}
              </div>
              {errors?.role && (
                <p className="text-error text-sm mt-2">{errors?.role}</p>
              )}
            </div>

            <Button
              type="button"
              variant="default"
              fullWidth
              onClick={handleNext}
              className="h-12"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-smooth"
              >
                <Icon name="ArrowLeft" size={20} />
                <span>Back</span>
              </button>
              <h3 className="text-lg font-semibold text-text-primary">
                Account Details
              </h3>
              <div className="w-16" />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={formData?.name}
                onChange={handleChange('name')}
                error={errors?.name}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                value={formData?.email}
                onChange={handleChange('email')}
                error={errors?.email}
                required
              />

              <div>
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={formData?.phone}
                  onChange={handleChange('phone')}
                  error={errors?.phone}
                  required
                />
                <p className="text-xs text-text-secondary mt-1">
                  Format: 9876543210 (without +91)
                </p>
              </div>

              <div>
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData?.password}
                    onChange={handleChange('password')}
                    error={errors?.password}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-text-secondary hover:text-text-primary transition-smooth"
                  >
                    <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
                  </button>
                </div>
                <PasswordStrengthIndicator password={formData?.password} />
              </div>

              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData?.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  error={errors?.confirmPassword}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-text-secondary hover:text-text-primary transition-smooth"
                >
                  <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
                </button>
              </div>

              <Select
                label="Location"
                options={locationOptions}
                value={formData?.location}
                onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                error={errors?.location}
                required
                searchable
              />

              <div className="space-y-4">
                <Checkbox
                  label="Enable Two-Factor Authentication (Recommended)"
                  description="Add an extra layer of security to your account"
                  checked={formData?.enableTwoFactor}
                  onChange={handleChange('enableTwoFactor')}
                />

                <Checkbox
                  label="I agree to the Terms of Service and Privacy Policy"
                  checked={formData?.agreeToTerms}
                  onChange={handleChange('agreeToTerms')}
                  error={errors?.agreeToTerms}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="default"
              fullWidth
              loading={isLoading}
              className="h-12"
            >
              Create Account
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;