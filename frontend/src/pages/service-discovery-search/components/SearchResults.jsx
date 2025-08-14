import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import WorkerCard from './WorkerCard';
import Button from '../../../components/ui/Button';

const SearchResults = ({ 
  searchQuery, 
  selectedCategory, 
  filters, 
  onWorkerSelect, 
  onInstantBook 
}) => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Mock workers data
  const mockWorkers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      specialization: 'Master Plumber',
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.8,
      reviewCount: 127,
      hourlyRate: 650,
      distance: 1.2,
      availability: 'available',
      isVerified: true,
      completedJobs: 245,
      experience: 8,
      responseTime: '5 min',
      skills: ['Pipe Repair', 'Leak Fixing', 'Bathroom Installation', 'Water Heater'],
      emergencyAvailable: true,
      nextAvailable: null
    },
    {
      id: 2,
      name: 'Priya Sharma',
      specialization: 'Professional Cleaner',
      profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 4.9,
      reviewCount: 89,
      hourlyRate: 350,
      distance: 0.8,
      availability: 'available',
      isVerified: true,
      completedJobs: 156,
      experience: 5,
      responseTime: '3 min',
      skills: ['Deep Cleaning', 'Sanitization', 'Kitchen Cleaning', 'Bathroom Cleaning'],
      emergencyAvailable: false,
      nextAvailable: null
    },
    {
      id: 3,
      name: 'Amit Singh',
      specialization: 'Certified Electrician',
      profileImage: 'https://randomuser.me/api/portraits/men/56.jpg',
      rating: 4.7,
      reviewCount: 203,
      hourlyRate: 750,
      distance: 2.1,
      availability: 'busy',
      isVerified: true,
      completedJobs: 312,
      experience: 12,
      responseTime: '8 min',
      skills: ['Wiring', 'Panel Installation', 'Lighting', 'Appliance Repair'],
      emergencyAvailable: true,
      nextAvailable: 'Today 6 PM'
    },
    {
      id: 4,
      name: 'Sunita Devi',
      specialization: 'Home Painter',
      profileImage: 'https://randomuser.me/api/portraits/women/28.jpg',
      rating: 4.6,
      reviewCount: 67,
      hourlyRate: 450,
      distance: 1.8,
      availability: 'available',
      isVerified: false,
      completedJobs: 89,
      experience: 4,
      responseTime: '12 min',
      skills: ['Interior Painting', 'Exterior Painting', 'Wall Preparation', 'Color Consultation'],
      emergencyAvailable: false,
      nextAvailable: null
    },
    {
      id: 5,
      name: 'Mohammed Ali',
      specialization: 'AC Technician',
      profileImage: 'https://randomuser.me/api/portraits/men/41.jpg',
      rating: 4.8,
      reviewCount: 145,
      hourlyRate: 600,
      distance: 3.2,
      availability: 'available',
      isVerified: true,
      completedJobs: 198,
      experience: 7,
      responseTime: '6 min',
      skills: ['AC Installation', 'AC Repair', 'Maintenance', 'Gas Refilling'],
      emergencyAvailable: true,
      nextAvailable: null
    },
    {
      id: 6,
      name: 'Kavita Patel',
      specialization: 'Furniture Assembly Expert',
      profileImage: 'https://randomuser.me/api/portraits/women/35.jpg',
      rating: 4.5,
      reviewCount: 78,
      hourlyRate: 400,
      distance: 1.5,
      availability: 'offline',
      isVerified: true,
      completedJobs: 134,
      experience: 6,
      responseTime: '15 min',
      skills: ['IKEA Assembly', 'Custom Furniture', 'Tool Assembly', 'Installation'],
      emergencyAvailable: false,
      nextAvailable: 'Tomorrow 9 AM'
    }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'distance', label: 'Nearest First' },
    { value: 'availability', label: 'Available First' }
  ];

  useEffect(() => {
    loadWorkers();
  }, [searchQuery, selectedCategory, filters, sortBy]);

  const loadWorkers = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let filteredWorkers = [...mockWorkers];
      
      // Apply filters
      if (filters?.verifiedOnly) {
        filteredWorkers = filteredWorkers?.filter(worker => worker?.isVerified);
      }
      
      if (filters?.rating !== 'all') {
        const minRating = parseFloat(filters?.rating);
        filteredWorkers = filteredWorkers?.filter(worker => worker?.rating >= minRating);
      }
      
      if (filters?.availability !== 'any') {
        if (filters?.availability === 'immediate') {
          filteredWorkers = filteredWorkers?.filter(worker => worker?.availability === 'available');
        }
      }
      
      if (filters?.emergencyService) {
        filteredWorkers = filteredWorkers?.filter(worker => worker?.emergencyAvailable);
      }
      
      // Apply price range filter
      filteredWorkers = filteredWorkers?.filter(worker => 
        worker?.hourlyRate >= filters?.priceRange?.min && 
        worker?.hourlyRate <= filters?.priceRange?.max
      );
      
      // Apply sorting
      switch (sortBy) {
        case 'rating':
          filteredWorkers?.sort((a, b) => b?.rating - a?.rating);
          break;
        case 'price-low':
          filteredWorkers?.sort((a, b) => a?.hourlyRate - b?.hourlyRate);
          break;
        case 'price-high':
          filteredWorkers?.sort((a, b) => b?.hourlyRate - a?.hourlyRate);
          break;
        case 'distance':
          filteredWorkers?.sort((a, b) => a?.distance - b?.distance);
          break;
        case 'availability':
          filteredWorkers?.sort((a, b) => {
            if (a?.availability === 'available' && b?.availability !== 'available') return -1;
            if (b?.availability === 'available' && a?.availability !== 'available') return 1;
            return 0;
          });
          break;
        default:
          // Keep original order for relevance
          break;
      }
      
      setWorkers(filteredWorkers);
      setLoading(false);
    }, 800);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
    // In real implementation, this would load more results
  };

  const getResultsText = () => {
    const count = workers?.length;
    if (count === 0) return 'No results found';
    if (count === 1) return '1 professional found';
    return `${count} professionals found`;
  };

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            {getResultsText()}
          </h2>
          {searchQuery && (
            <p className="text-sm text-text-secondary">
              Results for "{searchQuery}"
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-smooth ${
                viewMode === 'grid' ?'bg-surface text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name="Grid3X3" size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-smooth ${
                viewMode === 'list' ?'bg-surface text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name="List" size={16} />
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {sortOptions?.map((option) => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2 text-text-secondary">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Finding professionals...</span>
          </div>
        </div>
      )}
      {/* Results Grid */}
      {!loading && workers?.length > 0 && (
        <div className={`
          ${viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' :'space-y-4'
          }
        `}>
          {workers?.map((worker) => (
            <WorkerCard
              key={worker?.id}
              worker={worker}
              onViewProfile={onWorkerSelect}
              onInstantBook={onInstantBook}
            />
          ))}
        </div>
      )}
      {/* Empty State */}
      {!loading && workers?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Search" size={24} className="text-text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No professionals found
          </h3>
          <p className="text-text-secondary mb-4">
            Try adjusting your filters or search terms
          </p>
          <Button variant="outline" onClick={() => window.location?.reload()}>
            Reset Search
          </Button>
        </div>
      )}
      {/* Load More */}
      {!loading && workers?.length > 0 && hasMore && (
        <div className="text-center pt-6">
          <Button variant="outline" onClick={loadMore}>
            Load More Results
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;