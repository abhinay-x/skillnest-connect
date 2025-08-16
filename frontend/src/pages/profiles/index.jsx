import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const ProfilesPage = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categories for filtering
  const categories = [
    { id: 'all', label: 'All Profiles', icon: 'Users' },
    { id: 'plumbing', label: 'Plumbing', icon: 'Wrench' },
    { id: 'electrical', label: 'Electrical', icon: 'Zap' },
    { id: 'carpentry', label: 'Carpentry', icon: 'Hammer' },
    { id: 'painting', label: 'Painting', icon: 'Paintbrush' },
    { id: 'cleaning', label: 'Cleaning', icon: 'Sparkles' },
    { id: 'gardening', label: 'Gardening', icon: 'Leaf' },
    { id: 'appliance', label: 'Appliance Repair', icon: 'Settings' }
  ];

  // Mock profiles data (replace with real Firebase query)
  const mockProfiles = [
    {
      id: 'worker-001',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '+91 98765 43210',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      category: 'plumbing',
      specialization: 'Plumbing & Water Systems',
      experience: '8 years',
      rating: 4.8,
      totalJobs: 156,
      location: 'Bangalore, Karnataka',
      verified: true,
      description: 'Expert plumber with 8+ years of experience in residential and commercial plumbing systems.',
      skills: ['Pipe Installation', 'Leak Repair', 'Water Heater Service', 'Drain Cleaning']
    },
    {
      id: 'worker-002',
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 87654 32109',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      category: 'electrical',
      specialization: 'Electrical Systems & Wiring',
      experience: '6 years',
      rating: 4.9,
      totalJobs: 98,
      location: 'Mumbai, Maharashtra',
      verified: true,
      description: 'Certified electrician specializing in home automation and electrical installations.',
      skills: ['Wiring Installation', 'Circuit Repair', 'Smart Home Setup', 'Safety Inspections']
    },
    {
      id: 'worker-003',
      firstName: 'Amit',
      lastName: 'Patel',
      email: 'amit.patel@example.com',
      phone: '+91 76543 21098',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      category: 'carpentry',
      specialization: 'Custom Furniture & Carpentry',
      experience: '12 years',
      rating: 4.7,
      totalJobs: 203,
      location: 'Delhi, NCR',
      verified: true,
      description: 'Master carpenter creating custom furniture and home improvements for over a decade.',
      skills: ['Custom Furniture', 'Kitchen Cabinets', 'Door Installation', 'Wood Flooring']
    },
    {
      id: 'worker-004',
      firstName: 'Sneha',
      lastName: 'Reddy',
      email: 'sneha.reddy@example.com',
      phone: '+91 65432 10987',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      category: 'painting',
      specialization: 'Interior & Exterior Painting',
      experience: '5 years',
      rating: 4.6,
      totalJobs: 87,
      location: 'Hyderabad, Telangana',
      verified: true,
      description: 'Professional painter with expertise in both residential and commercial projects.',
      skills: ['Interior Painting', 'Exterior Painting', 'Wall Texturing', 'Color Consultation']
    },
    {
      id: 'worker-005',
      firstName: 'Vikram',
      lastName: 'Singh',
      email: 'vikram.singh@example.com',
      phone: '+91 54321 09876',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      category: 'cleaning',
      specialization: 'Deep Cleaning Services',
      experience: '4 years',
      rating: 4.5,
      totalJobs: 134,
      location: 'Pune, Maharashtra',
      verified: false,
      description: 'Professional cleaning service provider specializing in deep cleaning and maintenance.',
      skills: ['Deep Cleaning', 'Carpet Cleaning', 'Window Cleaning', 'Sanitization']
    }
  ];

  useEffect(() => {
    fetchProfiles();
  }, [selectedCategory]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, use mock data. Replace with real Firebase query:
      /*
      let profileQuery = query(
        collection(db, 'users'),
        where('userType', '==', 'worker'),
        where('isActive', '==', true),
        orderBy('rating', 'desc'),
        limit(50)
      );
      
      if (selectedCategory !== 'all') {
        profileQuery = query(
          collection(db, 'users'),
          where('userType', '==', 'worker'),
          where('category', '==', selectedCategory),
          where('isActive', '==', true),
          orderBy('rating', 'desc'),
          limit(50)
        );
      }
      
      const snapshot = await getDocs(profileQuery);
      const fetchedProfiles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      */
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredProfiles = mockProfiles;
      if (selectedCategory !== 'all') {
        filteredProfiles = mockProfiles.filter(profile => profile.category === selectedCategory);
      }
      
      setProfiles(filteredProfiles);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('Failed to load profiles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      profile.firstName.toLowerCase().includes(query) ||
      profile.lastName.toLowerCase().includes(query) ||
      profile.specialization.toLowerCase().includes(query) ||
      profile.location.toLowerCase().includes(query) ||
      profile.skills.some(skill => skill.toLowerCase().includes(query))
    );
  });

  const handleContactWorker = (workerId) => {
    // Navigate to booking page with worker pre-selected
    navigate('/booking', { state: { workerId } });
  };

  const handleViewProfile = (workerId) => {
    // Navigate to detailed worker profile
    navigate(`/worker/${workerId}/profile`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading profiles...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="AlertCircle" size={24} className="text-destructive" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Error Loading Profiles</h3>
              <p className="text-text-secondary mb-6">{error}</p>
              <Button onClick={fetchProfiles} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb />
        
        <div className="mt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Worker Profiles</h1>
              <p className="text-text-secondary mt-2">Find skilled professionals for your projects</p>
            </div>
            <div className="text-sm text-text-secondary">
              {filteredProfiles.length} profile{filteredProfiles.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, specialization, location, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  iconName="Search"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-text-secondary hover:bg-muted/80 hover:text-text-primary'
                  }`}
                >
                  <Icon name={category.icon} size={16} className="mr-2" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Profiles Grid */}
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={32} className="text-text-secondary" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">No profiles found</h3>
              <p className="text-text-secondary mb-6">
                {searchQuery 
                  ? `No profiles match "${searchQuery}"`
                  : `No ${selectedCategory === 'all' ? '' : selectedCategory} profiles available`
                }
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <div key={profile.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                  {/* Profile Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <Image 
                          src={profile.profileImage} 
                          alt={`${profile.firstName} ${profile.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {profile.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                          <Icon name="Check" size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {profile.firstName} {profile.lastName}
                      </h3>
                      <p className="text-sm text-text-secondary">{profile.specialization}</p>
                      <div className="flex items-center mt-1">
                        <Icon name="MapPin" size={12} className="text-text-secondary mr-1" />
                        <span className="text-xs text-text-secondary">{profile.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-text-primary">{profile.rating}</div>
                      <div className="text-xs text-text-secondary">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-text-primary">{profile.totalJobs}</div>
                      <div className="text-xs text-text-secondary">Jobs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-text-primary">{profile.experience}</div>
                      <div className="text-xs text-text-secondary">Experience</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                    {profile.description}
                  </p>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted text-xs text-text-secondary rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {profile.skills.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-xs text-text-secondary rounded">
                          +{profile.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleContactWorker(profile.id)}
                      iconName="Calendar"
                      iconPosition="left"
                    >
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProfile(profile.id)}
                      iconName="Eye"
                    >
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilesPage;
