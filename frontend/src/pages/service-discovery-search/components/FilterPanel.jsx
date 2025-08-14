import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ isOpen, onClose, filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const locationOptions = [
    { value: '1', label: 'Within 1 km' },
    { value: '5', label: 'Within 5 km' },
    { value: '10', label: 'Within 10 km' },
    { value: '25', label: 'Within 25 km' },
    { value: 'all', label: 'All locations' }
  ];

  const experienceOptions = [
    { value: 'any', label: 'Any experience' },
    { value: 'beginner', label: 'Beginner (0-2 years)' },
    { value: 'intermediate', label: 'Intermediate (2-5 years)' },
    { value: 'experienced', label: 'Experienced (5-10 years)' },
    { value: 'expert', label: 'Expert (10+ years)' }
  ];

  const availabilityOptions = [
    { value: 'immediate', label: 'Available now' },
    { value: 'today', label: 'Available today' },
    { value: 'tomorrow', label: 'Available tomorrow' },
    { value: 'this-week', label: 'This week' },
    { value: 'flexible', label: 'Flexible timing' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
  };

  const handlePriceRangeChange = (type, value) => {
    const updatedFilters = {
      ...localFilters,
      priceRange: {
        ...localFilters?.priceRange,
        [type]: parseInt(value)
      }
    };
    setLocalFilters(updatedFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      location: 'all',
      priceRange: { min: 200, max: 2000 },
      rating: 'all',
      availability: 'any',
      experience: 'any',
      serviceType: 'all',
      emergencyService: false,
      verifiedOnly: false,
      instantBooking: false
    };
    setLocalFilters(resetFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters?.location !== 'all') count++;
    if (localFilters?.priceRange?.min > 200 || localFilters?.priceRange?.max < 2000) count++;
    if (localFilters?.rating !== 'all') count++;
    if (localFilters?.availability !== 'any') count++;
    if (localFilters?.experience !== 'any') count++;
    if (localFilters?.emergencyService) count++;
    if (localFilters?.verifiedOnly) count++;
    if (localFilters?.instantBooking) count++;
    return count;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Filter Panel */}
      <div className={`
        fixed lg:relative inset-x-0 bottom-0 lg:inset-auto
        bg-surface border-t lg:border border-border rounded-t-2xl lg:rounded-xl
        z-50 lg:z-auto max-h-[80vh] lg:max-h-none overflow-y-auto
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
        lg:w-80 lg:sticky lg:top-4
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border lg:border-none">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-text-primary">Filters</h3>
            {getActiveFilterCount() > 0 && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-text-secondary hover:text-text-primary transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-6">
          {/* Location Radius */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-text-primary">Location Radius</label>
            <Select
              options={locationOptions}
              value={localFilters?.location}
              onChange={(value) => handleFilterChange('location', value)}
              placeholder="Select radius"
            />
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-text-primary">
              Price Range (₹{localFilters?.priceRange?.min} - ₹{localFilters?.priceRange?.max}/hr)
            </label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-text-secondary">Minimum (₹/hr)</label>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="50"
                  value={localFilters?.priceRange?.min}
                  onChange={(e) => handlePriceRangeChange('min', e?.target?.value)}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div>
                <label className="text-xs text-text-secondary">Maximum (₹/hr)</label>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="50"
                  value={localFilters?.priceRange?.max}
                  onChange={(e) => handlePriceRangeChange('max', e?.target?.value)}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-text-primary">Minimum Rating</label>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'Any rating' },
                { value: '4', label: '4+ stars' },
                { value: '4.5', label: '4.5+ stars' }
              ]?.map((option) => (
                <label key={option?.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={option?.value}
                    checked={localFilters?.rating === option?.value}
                    onChange={(e) => handleFilterChange('rating', e?.target?.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="text-sm text-text-primary">{option?.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-text-primary">Availability</label>
            <Select
              options={availabilityOptions}
              value={localFilters?.availability}
              onChange={(value) => handleFilterChange('availability', value)}
              placeholder="Select availability"
            />
          </div>

          {/* Experience Level */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-text-primary">Experience Level</label>
            <Select
              options={experienceOptions}
              value={localFilters?.experience}
              onChange={(value) => handleFilterChange('experience', value)}
              placeholder="Select experience"
            />
          </div>

          {/* Service Type Toggles */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-text-primary">Service Preferences</label>
            <div className="space-y-3">
              <Checkbox
                label="Emergency services only"
                checked={localFilters?.emergencyService}
                onChange={(e) => handleFilterChange('emergencyService', e?.target?.checked)}
              />
              <Checkbox
                label="Verified professionals only"
                checked={localFilters?.verifiedOnly}
                onChange={(e) => handleFilterChange('verifiedOnly', e?.target?.checked)}
              />
              <Checkbox
                label="Instant booking available"
                checked={localFilters?.instantBooking}
                onChange={(e) => handleFilterChange('instantBooking', e?.target?.checked)}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              variant="default"
              onClick={handleApplyFilters}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;