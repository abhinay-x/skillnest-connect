import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const CustomerProfile = () => {
  const { currentUser, userProfile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    dateOfBirth: '',
    profilePicture: ''
  });
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalBookings: 0,
    totalRentals: 0,
    totalSpent: 0
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || currentUser?.email || '',
        phone: userProfile.phone || '',
        address: {
          street: userProfile.address?.street || '',
          city: userProfile.address?.city || '',
          state: userProfile.address?.state || '',
          pincode: userProfile.address?.pincode || ''
        },
        dateOfBirth: userProfile.dateOfBirth || '',
        profilePicture: userProfile.photoURL || ''
      });
    }
  }, [userProfile, currentUser]);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!currentUser) return;
      
      try {
        const statsDoc = await getDoc(doc(db, 'userStats', currentUser.uid));
        if (statsDoc.exists()) {
          const stats = statsDoc.data();
          setUserStats({
            totalOrders: stats.totalOrders || 0,
            totalBookings: stats.totalBookings || 0,
            totalRentals: stats.totalRentals || 0,
            totalSpent: stats.totalSpent || 0
          });
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };
    
    fetchUserStats();
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    if (field === 'address') {
      setProfileData(prev => ({
        ...prev,
        address: value
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        address: profileData.address,
        updatedAt: new Date()
      });
      
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setProfileData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || currentUser?.email || '',
        phone: userProfile.phone || '',
        address: {
          street: userProfile.address?.street || '',
          city: userProfile.address?.city || '',
          state: userProfile.address?.state || '',
          pincode: userProfile.address?.pincode || ''
        },
        dateOfBirth: userProfile.dateOfBirth || '',
        profilePicture: userProfile.photoURL || ''
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb />
        
        <div className="mt-6">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-8 text-primary-foreground">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-primary-foreground/20 rounded-full flex items-center justify-center overflow-hidden">
                    {profileData.profilePicture ? (
                      <Image
                        src={profileData.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon name="User" size={40} className="text-primary-foreground/80" />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-foreground text-primary rounded-full flex items-center justify-center shadow-lg">
                      <Icon name="Camera" size={16} />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">
                    {profileData.firstName || profileData.lastName 
                      ? `${profileData.firstName} ${profileData.lastName}`.trim()
                      : userProfile?.displayName || 'Customer Profile'
                    }
                  </h1>
                  <p className="text-primary-foreground/80 mb-4">{profileData.email}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="Shield" size={16} />
                      <span className="text-sm">Customer Account</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Calendar" size={16} />
                      <span className="text-sm">
                        Member since {new Date(currentUser?.metadata?.creationTime).getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {!isEditing ? (
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(true)}
                      iconName="Edit"
                      iconPosition="left"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        onClick={handleSave}
                        loading={isLoading}
                        disabled={isLoading}
                        iconName="Save"
                        iconPosition="left"
                      >
                        Save Changes
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Personal Information */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                      <Icon name="User" size={20} className="mr-2" />
                      Personal Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        required
                      />
                      <Input
                        label="Last Name"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={!isEditing}
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        value={profileData.email}
                        disabled={true}
                        className="md:col-span-2"
                      />
                      <Input
                        label="Phone Number"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                      />
                      <Input
                        label="Date of Birth"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                      <Icon name="MapPin" size={20} className="mr-2" />
                      Address Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Address"
                        value={profileData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!isEditing}
                        className="md:col-span-2"
                      />
                      <Input
                        label="City"
                        value={profileData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={!isEditing}
                      />
                      <Input
                        label="State"
                        value={profileData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        disabled={!isEditing}
                      />
                      <Input
                        label="Pincode"
                        value={profileData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        disabled={!isEditing}
                        className="md:col-span-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Stats & Quick Actions */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Account Stats */}
                  <div className="bg-muted rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Account Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon name="ShoppingBag" size={16} className="text-primary" />
                          <span className="text-sm text-text-secondary">Total Orders</span>
                        </div>
                        <span className="font-medium text-text-primary">0</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon name="Calendar" size={16} className="text-success" />
                          <span className="text-sm text-text-secondary">Bookings</span>
                        </div>
                        <span className="font-medium text-text-primary">0</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon name="Wrench" size={16} className="text-warning" />
                          <span className="text-sm text-text-secondary">Rentals</span>
                        </div>
                        <span className="font-medium text-text-primary">0</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-muted rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        iconName="ShoppingBag"
                        iconPosition="left"
                        onClick={() => window.location.href = '/marketplace'}
                      >
                        Browse Marketplace
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        iconName="Calendar"
                        iconPosition="left"
                        onClick={() => window.location.href = '/booking-scheduling'}
                      >
                        My Bookings
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        iconName="Wrench"
                        iconPosition="left"
                        onClick={() => window.location.href = '/tool-rental'}
                      >
                        Rent Tools
                      </Button>
                    </div>
                  </div>

                  {/* Account Security */}
                  <div className="bg-muted rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Account Security</h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        iconName="Key"
                        iconPosition="left"
                      >
                        Change Password
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        iconName="Shield"
                        iconPosition="left"
                      >
                        Privacy Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerProfile;
