import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import SearchHeader from '../../components/ui/SearchHeader';
import Breadcrumb from '../../components/ui/Breadcrumb';
import VoiceSearchInput from './components/VoiceSearchInput';
import CategoryChips from './components/CategoryChips';
import TrendingServices from './components/TrendingServices';
import FilterPanel from './components/FilterPanel';
import SearchResults from './components/SearchResults';
import AIRecommendations from './components/AIRecommendations';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ServiceDiscoverySearch = () => {
  const { currentUser, userProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showTrending, setShowTrending] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('New Delhi, India');
  
  // Filter state
  const [filters, setFilters] = useState({
    location: 'all',
    priceRange: { min: 200, max: 2000 },
    rating: 'all',
    availability: 'any',
    experience: 'any',
    serviceType: 'all',
    emergencyService: false,
    verifiedOnly: false,
    instantBooking: false
  });


  // Initialize from navigation state
  useEffect(() => {
    if (location?.state?.query) {
      setSearchQuery(location?.state?.query);
      setShowTrending(false);
    }
    if (location?.state?.location) {
      setCurrentLocation(location?.state?.location);
    }
  }, [location?.state]);

  // Handle search
  const handleSearch = (query = searchQuery) => {
    if (query?.trim()) {
      setSearchQuery(query?.trim());
      setShowTrending(false);
      setShowRecommendations(false);
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId !== 'all') {
      setShowTrending(false);
      setShowRecommendations(false);
    } else if (!searchQuery?.trim()) {
      setShowTrending(true);
      setShowRecommendations(true);
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle service click from trending
  const handleServiceClick = (service) => {
    setSearchQuery(service?.name);
    setSelectedCategory(service?.category?.toLowerCase());
    setShowTrending(false);
    setShowRecommendations(false);
  };

  // Handle worker selection
  const handleWorkerSelect = (worker) => {
    navigate('/worker-profile-portfolio', { 
      state: { workerId: worker?.id, worker } 
    });
  };

  // Handle instant booking
  const handleInstantBook = (worker) => {
    navigate('/booking-scheduling', { 
      state: { 
        workerId: worker?.id, 
        worker,
        service: { 
          id: `service-${worker?.id}`,
          name: searchQuery || worker?.specialization,
          category: selectedCategory,
          baseRate: worker?.hourlyRate || 500
        },
        bookingType: 'instant' 
      } 
    });
  };

  // Handle location detection
  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          // In real app, reverse geocode the coordinates
          setCurrentLocation('Current Location');
        },
        (error) => {
          console.error('Location detection failed:', error);
        }
      );
    }
  };

  // Check if showing search results
  const showingResults = searchQuery?.trim() || selectedCategory !== 'all';

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader 
        onSearch={handleSearch}
        initialQuery={searchQuery}
        initialLocation={currentLocation}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full">
          <Breadcrumb />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Hero Search Section */}
            <div className="w-full bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary mb-2">
                  Find Skilled Professionals Near You
                </h1>
                <p className="text-sm sm:text-base text-text-secondary">
                  Connect with verified experts for all your home service needs
                </p>
              </div>

              {/* Voice Search Input */}
              <div className="w-full max-w-2xl mx-auto mb-6">
                <VoiceSearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                  placeholder="Search for plumbers, electricians, cleaners..."
                />
              </div>

              {/* Location Indicator */}
              <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary flex-wrap">
                <Icon name="MapPin" size={16} className="flex-shrink-0" />
                <span className="text-center">Searching in: {currentLocation}</span>
                <button
                  onClick={handleLocationDetect}
                  className="text-primary hover:text-primary/80 transition-smooth flex-shrink-0"
                >
                  <Icon name="Navigation" size={16} />
                </button>
              </div>
            </div>

            {/* Category Chips */}
            <div className="w-full space-y-4">
              <h2 className="text-lg font-semibold text-text-primary">Browse by Category</h2>
              <div className="w-full">
                <CategoryChips
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleCategorySelect}
                />
              </div>
            </div>

            {/* AI Recommendations */}
            {showRecommendations && (
              <div className="w-full space-y-4">
                <AIRecommendations
                  onWorkerSelect={handleWorkerSelect}
                  userPreferences={{}}
                />
              </div>
            )}

            {/* Trending Services */}
            {showTrending && (
              <div className="w-full space-y-4">
                <TrendingServices onServiceClick={handleServiceClick} />
              </div>
            )}

            {/* Search Results */}
            {showingResults && (
              <div className="w-full space-y-4">
                <SearchResults
                  searchQuery={searchQuery}
                  selectedCategory={selectedCategory}
                  filters={filters}
                  onWorkerSelect={handleWorkerSelect}
                  onInstantBook={handleInstantBook}
                />
              </div>
            )}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
            <div className="sticky top-4 space-y-6">
              {/* Quick Actions */}
              <div className="w-full bg-card border border-border rounded-xl p-4">
                <h3 className="font-semibold text-card-foreground mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Zap"
                    iconPosition="left"
                    onClick={() => setFilters(prev => ({ ...prev, emergencyService: true }))}
                  >
                    Emergency Services
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Clock"
                    iconPosition="left"
                    onClick={() => setFilters(prev => ({ ...prev, instantBooking: true }))}
                  >
                    Instant Booking
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Shield"
                    iconPosition="left"
                    onClick={() => setFilters(prev => ({ ...prev, verifiedOnly: true }))}
                  >
                    Verified Only
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <FilterPanel
                isOpen={true}
                onClose={() => {}}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden fixed bottom-6 right-6 z-30">
          <Button
            variant="default"
            size="lg"
            iconName="Filter"
            iconPosition="left"
            onClick={() => setShowFilters(true)}
            className="shadow-elevation-3"
          >
            Filters
          </Button>
        </div>

        {/* Mobile Filter Panel */}
        <div className="lg:hidden">
          <FilterPanel
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </main>
    </div>
  );
};

export default ServiceDiscoverySearch;