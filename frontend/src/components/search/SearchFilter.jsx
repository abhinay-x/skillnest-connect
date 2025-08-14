import React, { useState, useEffect, useMemo } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { Search, Filter, X, Star, MapPin, Clock, DollarSign } from 'lucide-react';

const SearchFilter = ({ onResultsChange, entityType = 'services' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch data based on entity type
  const { data: items, loading } = useFirestore(entityType, {
    where: filters.where || [],
    orderBy: filters.orderBy || ['createdAt', 'desc']
  });

  // Common filters based on entity type
  const getFilterOptions = () => {
    switch (entityType) {
      case 'services':
        return {
          categories: ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'Gardening'],
          priceRange: [0, 5000],
          ratingRange: [1, 5],
          sortOptions: [
            { value: 'relevance', label: 'Relevance' },
            { value: 'price-low', label: 'Price: Low to High' },
            { value: 'price-high', label: 'Price: High to Low' },
            { value: 'rating', label: 'Highest Rated' },
            { value: 'newest', label: 'Newest First' }
          ]
        };
      case 'workers':
        return {
          categories: ['Plumber', 'Electrician', 'Cleaner', 'Carpenter', 'Painter', 'Gardener'],
          ratingRange: [1, 5],
          sortOptions: [
            { value: 'relevance', label: 'Relevance' },
            { value: 'rating', label: 'Highest Rated' },
            { value: 'experience', label: 'Most Experienced' },
            { value: 'newest', label: 'Newest First' }
          ]
        };
      case 'bookings':
        return {
          statuses: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
          sortOptions: [
            { value: 'newest', label: 'Newest First' },
            { value: 'oldest', label: 'Oldest First' },
            { value: 'date', label: 'Upcoming First' },
            { value: 'price', label: 'Price' }
          ]
        };
      default:
        return {
          sortOptions: [
            { value: 'newest', label: 'Newest First' },
            { value: 'oldest', label: 'Oldest First' }
          ]
        };
    }
  };

  const filterOptions = getFilterOptions();

  // Filter and sort items
  const filteredItems = useMemo(() => {
    if (!items) return [];

    let filtered = [...items];

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (categories.length > 0) {
      filtered = filtered.filter(item =>
        categories.includes(item.category)
      );
    }

    // Price filter
    if (entityType === 'services') {
      filtered = filtered.filter(item =>
        item.price >= priceRange[0] && item.price <= priceRange[1]
      );
    }

    // Rating filter
    if (rating > 0) {
      filtered = filtered.filter(item =>
        (item.rating || 0) >= rating
      );
    }

    // Location filter
    if (location) {
      filtered = filtered.filter(item =>
        item.location?.toLowerCase().includes(location.toLowerCase()) ||
        item.address?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'experience':
        filtered.sort((a, b) => (b.experience || 0) - (a.experience || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [items, searchQuery, categories, priceRange, rating, location, sortBy, entityType]);

  useEffect(() => {
    onResultsChange?.(filteredItems);
  }, [filteredItems, onResultsChange]);

  const clearFilters = () => {
    setCategories([]);
    setPriceRange([0, filterOptions.priceRange?.[1] || 1000]);
    setRating(0);
    setLocation('');
    setSortBy('relevance');
  };

  const activeFiltersCount = 
    categories.length + 
    (rating > 0 ? 1 : 0) + 
    (location ? 1 : 0) +
    (sortBy !== 'relevance' ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${entityType}...`}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {activeFiltersCount}
            </span>
          )}
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {filterOptions.sortOptions?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
          {/* Categories */}
          {filterOptions.categories && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Categories</h4>
              <div className="space-y-2">
                {filterOptions.categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={categories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCategories(prev => [...prev, category]);
                        } else {
                          setCategories(prev => prev.filter(c => c !== category));
                        }
                      }}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          {filterOptions.priceRange && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Price Range</h4>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                  min="0"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                  max={filterOptions.priceRange[1]}
                />
              </div>
            </div>
          )}

          {/* Rating */}
          {filterOptions.ratingRange && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Minimum Rating</h4>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Location</h4>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {filteredItems.length} {entityType} found
      </div>
    </div>
  );
};

export default SearchFilter;
