import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User, MapPin, Briefcase } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    address: userProfile?.address || '',
    city: userProfile?.city || '',
    state: userProfile?.state || '',
    pincode: userProfile?.pincode || '',
    // Worker specific fields
    skills: userProfile?.skills || [],
    experience: userProfile?.experience || '',
    description: userProfile?.description || '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSkillsChange = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    
    if (userProfile?.userType === 'worker') {
      if (formData.skills.length === 0) {
        newErrors.skills = 'Please select at least one skill';
      }
      
      if (!formData.experience) {
        newErrors.experience = 'Experience is required';
      }
      
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted - handleSubmit called');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    
    console.log('Form validation passed, starting profile update');
    setLoading(true);
    
    try {
      const updateData = {
        displayName: `${formData.firstName} ${formData.lastName}`.trim(),
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          ...(userProfile?.userType === 'worker' && {
            skills: formData.skills,
            experience: formData.experience,
            description: formData.description,
          })
        }
      };
      
      console.log('Calling updateProfile with data:', updateData);
      const result = await updateProfile(updateData);
      console.log('updateProfile result:', result);
      
      if (result.success) {
        console.log('Profile update successful, navigating...');
        // Navigate to appropriate dashboard based on user type
        if (userProfile?.userType === 'worker') {
          navigate('/worker/dashboard');
        } else if (userProfile?.userType === 'customer') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else {
        // Handle error
        console.error('Onboarding update failed:', result.error);
        alert('Profile update failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('An error occurred: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const skillOptions = [
    'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning',
    'Gardening', 'AC Repair', 'Appliance Repair', 'Pest Control',
    'Home Security', 'Interior Design', 'Moving & Packing'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            SkillNest
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Complete your profile to get started
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Setup</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Please complete your profile information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                icon={<User className="w-5 h-5" />}
                required
              />
              
              <Input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                required
              />
            </div>
            
            <Input
              type="text"
              name="address"
              placeholder="Full address"
              value={formData.address}
              onChange={handleInputChange}
              error={errors.address}
              icon={<MapPin className="w-5 h-5" />}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                error={errors.city}
                required
              />
              
              <Input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                error={errors.state}
                required
              />
            </div>
            
            <Input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              error={errors.pincode}
              maxLength={6}
              required
            />

            {userProfile?.userType === 'worker' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills & Services
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {skillOptions.map(skill => (
                      <label key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.skills.includes(skill)}
                          onChange={() => handleSkillsChange(skill)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{skill}</span>
                      </label>
                    ))}
                  </div>
                  {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tell us about yourself
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your skills and experience..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading} disabled={loading}>
              Complete Profile
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
