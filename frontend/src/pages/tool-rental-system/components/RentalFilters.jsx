import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const RentalFilters = ({ onFiltersChange, activeFilters = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: activeFilters?.priceRange || '',
    condition: activeFilters?.condition || [],
    availability: activeFilters?.availability || '',
    location: activeFilters?.location || '',
    features: activeFilters?.features || [],
    rating: activeFilters?.rating || '',
    ...activeFilters
  });

  const priceRangeOptions = [
    { value: '', label: 'Any Price' },
    { value: '0-500', label: '₹0 - ₹500/day' },
    { value: '500-1000', label: '₹500 - ₹1,000/day' },
    { value: '1000-2000', label: '₹1,000 - ₹2,000/day' },
    { value: '2000+', label: '₹2,000+/day' }
  ];

  const availabilityOptions = [
    { value: '', label: 'Any Time' },
    { value: 'immediate', label: 'Available Now' },
    { value: 'today', label: 'Available Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'within-5km', label: 'Within 5 km' },
    { value: 'within-10km', label: 'Within 10 km' },
    { value: 'within-25km', label: 'Within 25 km' },
    { value: 'any-distance', label: 'Any Distance' }
  ];

  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '4+', label: '4+ Stars' },
    { value: '4.5+', label: '4.5+ Stars' },
    { value: '5', label: '5 Stars Only' }
  ];

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' }
  ];

  const featureOptions = [
    { value: 'operator-included', label: 'Operator Available' },
    { value: 'training-included', label: 'Training Included' },
    { value: 'delivery-available', label: 'Delivery Available' },
    { value: 'pickup-available', label: 'Pickup Available' },
    { value: 'insurance-covered', label: 'Insurance Covered' },
    { value: 'maintenance-included', label: 'Maintenance Included' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCheckboxChange = (key, value, checked) => {
    const currentValues = filters?.[key] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues?.filter(v => v !== value);
    
    handleFilterChange(key, newValues);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      priceRange: '',
      condition: [],
      availability: '',
      location: '',
      features: [],
      rating: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.priceRange) count++;
    if (filters?.condition?.length > 0) count++;
    if (filters?.availability) count++;
    if (filters?.location) count++;
    if (filters?.features?.length > 0) count++;
    if (filters?.rating) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-card rounded-lg shadow-elevation-1">
      {/* Filter Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} className="text-text-secondary" />
            <h3 className="font-semibold text-text-primary">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden"
            >
              <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 space-y-6">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Price Range
            </label>
            <Select
              options={priceRangeOptions}
              value={filters?.priceRange}
              onChange={(value) => handleFilterChange('priceRange', value)}
              placeholder="Select price range"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Availability
            </label>
            <Select
              options={availabilityOptions}
              value={filters?.availability}
              onChange={(value) => handleFilterChange('availability', value)}
              placeholder="Select availability"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Distance
            </label>
            <Select
              options={locationOptions}
              value={filters?.location}
              onChange={(value) => handleFilterChange('location', value)}
              placeholder="Select distance"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Minimum Rating
            </label>
            <Select
              options={ratingOptions}
              value={filters?.rating}
              onChange={(value) => handleFilterChange('rating', value)}
              placeholder="Select rating"
            />
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Condition
            </label>
            <div className="space-y-2">
              {conditionOptions?.map((option) => (
                <Checkbox
                  key={option?.value}
                  label={option?.label}
                  checked={filters?.condition?.includes(option?.value)}
                  onChange={(e) => handleCheckboxChange('condition', option?.value, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Features & Services
            </label>
            <div className="space-y-2">
              {featureOptions?.map((option) => (
                <Checkbox
                  key={option?.value}
                  label={option?.label}
                  checked={filters?.features?.includes(option?.value)}
                  onChange={(e) => handleCheckboxChange('features', option?.value, e?.target?.checked)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Apply Filters Button - Mobile */}
        <div className="p-4 border-t border-border lg:hidden">
          <Button variant="default" fullWidth onClick={() => setIsExpanded(false)}>
            Apply Filters ({activeFilterCount})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RentalFilters;