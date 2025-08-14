import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Input from './Input';
import Select from './Select';

const SearchHeader = ({ 
  onSearch = () => {}, 
  initialQuery = '', 
  initialLocation = '',
  showLocationFilter = true,
  placeholder = "Search for services, professionals, or tools..."
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const currentLocation = useLocation();

  // Mock location options
  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'new-york', label: 'New York, NY' },
    { value: 'los-angeles', label: 'Los Angeles, CA' },
    { value: 'chicago', label: 'Chicago, IL' },
    { value: 'houston', label: 'Houston, TX' },
    { value: 'phoenix', label: 'Phoenix, AZ' },
    { value: 'philadelphia', label: 'Philadelphia, PA' },
    { value: 'san-antonio', label: 'San Antonio, TX' },
    { value: 'san-diego', label: 'San Diego, CA' },
    { value: 'dallas', label: 'Dallas, TX' },
    { value: 'san-jose', label: 'San Jose, CA' }
  ];

  // Mock search suggestions
  const mockSuggestions = [
    'Plumbing repair',
    'Electrical installation',
    'House cleaning',
    'Landscaping',
    'HVAC maintenance',
    'Painting services',
    'Carpentry work',
    'Appliance repair',
    'Roofing services',
    'Tile installation'
  ];

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    
    // Generate suggestions based on input
    if (value?.length > 0) {
      const filtered = mockSuggestions?.filter(suggestion =>
        suggestion?.toLowerCase()?.includes(value?.toLowerCase())
      );
      setSuggestions(filtered?.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (query = searchQuery) => {
    if (query?.trim()) {
      // Navigate to search page if not already there
      if (currentLocation?.pathname !== '/service-discovery-search') {
        navigate('/service-discovery-search', { 
          state: { query: query?.trim(), location } 
        });
      } else {
        // Call the search callback if already on search page
        onSearch({ query: query?.trim(), location });
      }
      setShowSuggestions(false);
      setIsExpanded(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLocationChange = (selectedLocation) => {
    setLocation(selectedLocation);
    if (searchQuery?.trim()) {
      handleSearch();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show search header only on relevant pages
  const shouldShowSearchHeader = [
    '/service-discovery-search',
    '/e-commerce-marketplace',
    '/tool-rental-system'
  ]?.includes(currentLocation?.pathname);

  if (!shouldShowSearchHeader) {
    return null;
  }

  return (
    <div className="bg-surface border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-3 lg:space-y-0">
          {/* Search Input */}
          <div className="flex-1 relative" ref={searchRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Search" size={20} className="text-text-secondary" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsExpanded(true)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              />
              
              {/* Voice Search Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-text-primary transition-smooth"
              >
                <Icon name="Mic" size={20} />
              </button>
            </div>

            {/* Search Suggestions */}
            {showSuggestions && suggestions?.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-elevation-2 z-200 animate-fade-in">
                {suggestions?.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left text-popover-foreground hover:bg-muted transition-smooth flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <Icon name="Search" size={16} className="text-text-secondary" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location Filter */}
          {showLocationFilter && (
            <div className="lg:w-64">
              <Select
                options={locationOptions}
                value={location}
                onChange={handleLocationChange}
                placeholder="Select location"
                searchable
                className="w-full"
              />
            </div>
          )}

          {/* Search Button */}
          <button
            onClick={() => handleSearch()}
            disabled={!searchQuery?.trim()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth flex items-center justify-center space-x-2 lg:w-auto w-full"
          >
            <Icon name="Search" size={20} />
            <span>Search</span>
          </button>
        </div>

        {/* Quick Filters - Mobile Expanded View */}
        {isExpanded && (
          <div className="mt-4 lg:hidden animate-slide-in">
            <div className="flex flex-wrap gap-2">
              {mockSuggestions?.slice(0, 6)?.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm hover:bg-accent hover:text-accent-foreground transition-smooth"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHeader;