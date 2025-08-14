import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFilterChange, 
  onClearFilters,
  isMobile = false 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    rating: true,
    availability: true,
    location: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const handlePriceChange = (type, value) => {
    onFilterChange('price', {
      ...filters?.price,
      [type]: value
    });
  };

  const handleBrandChange = (brand, checked) => {
    const updatedBrands = checked
      ? [...(filters?.brands || []), brand]
      : (filters?.brands || [])?.filter(b => b !== brand);
    onFilterChange('brands', updatedBrands);
  };

  const handleRatingChange = (rating) => {
    onFilterChange('rating', rating);
  };

  const handleAvailabilityChange = (type, checked) => {
    onFilterChange('availability', {
      ...filters?.availability,
      [type]: checked
    });
  };

  const brands = [
    { name: "Bosch", count: 45 },
    { name: "DeWalt", count: 38 },
    { name: "Makita", count: 32 },
    { name: "Stanley", count: 28 },
    { name: "Black & Decker", count: 25 },
    { name: "Hitachi", count: 22 },
    { name: "Milwaukee", count: 18 },
    { name: "Ryobi", count: 15 }
  ];

  const FilterSection = ({ title, children, sectionKey }) => (
    <div className="border-b border-border pb-4 mb-4 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <h3 className="font-medium text-text-primary">{title}</h3>
        <Icon
          name={expandedSections?.[sectionKey] ? "ChevronUp" : "ChevronDown"}
          size={16}
          className="text-text-secondary"
        />
      </button>
      {expandedSections?.[sectionKey] && children}
    </div>
  );

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded transition-smooth"
            >
              <Icon name="X" size={20} className="text-text-secondary" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Price Range */}
        <FilterSection title="Price Range" sectionKey="price">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Min"
                value={filters?.price?.min || ''}
                onChange={(e) => handlePriceChange('min', e?.target?.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters?.price?.max || ''}
                onChange={(e) => handlePriceChange('max', e?.target?.value)}
              />
            </div>
            <div className="space-y-2">
              {[
                { label: "Under ₹500", min: 0, max: 500 },
                { label: "₹500 - ₹1,000", min: 500, max: 1000 },
                { label: "₹1,000 - ₹5,000", min: 1000, max: 5000 },
                { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
                { label: "Above ₹10,000", min: 10000, max: null }
              ]?.map((range, index) => (
                <Checkbox
                  key={index}
                  label={range?.label}
                  checked={filters?.price?.min === range?.min && filters?.price?.max === range?.max}
                  onChange={(e) => {
                    if (e?.target?.checked) {
                      onFilterChange('price', { min: range?.min, max: range?.max });
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Brands */}
        <FilterSection title="Brands" sectionKey="brand">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands?.map((brand) => (
              <Checkbox
                key={brand?.name}
                label={`${brand?.name} (${brand?.count})`}
                checked={(filters?.brands || [])?.includes(brand?.name)}
                onChange={(e) => handleBrandChange(brand?.name, e?.target?.checked)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Customer Rating" sectionKey="rating">
          <div className="space-y-2">
            {[4.5, 4.0, 3.5, 3.0]?.map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`flex items-center space-x-2 w-full p-2 rounded hover:bg-muted transition-smooth ${
                  filters?.rating === rating ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                <div className="flex items-center">
                  {[...Array(5)]?.map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={14}
                      className={`${
                        i < Math.floor(rating)
                          ? 'text-warning fill-current'
                          : i < rating
                          ? 'text-warning fill-current opacity-50' :'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm">& Up</span>
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability" sectionKey="availability">
          <div className="space-y-2">
            <Checkbox
              label="In Stock"
              checked={filters?.availability?.inStock || false}
              onChange={(e) => handleAvailabilityChange('inStock', e?.target?.checked)}
            />
            <Checkbox
              label="Same Day Delivery"
              checked={filters?.availability?.sameDayDelivery || false}
              onChange={(e) => handleAvailabilityChange('sameDayDelivery', e?.target?.checked)}
            />
            <Checkbox
              label="Free Delivery"
              checked={filters?.availability?.freeDelivery || false}
              onChange={(e) => handleAvailabilityChange('freeDelivery', e?.target?.checked)}
            />
            <Checkbox
              label="Rental Available"
              checked={filters?.availability?.rentalAvailable || false}
              onChange={(e) => handleAvailabilityChange('rentalAvailable', e?.target?.checked)}
            />
          </div>
        </FilterSection>

        {/* Location */}
        <FilterSection title="Location & Delivery" sectionKey="location">
          <div className="space-y-2">
            <Checkbox
              label="Available for Pickup"
              checked={filters?.location?.pickup || false}
              onChange={(e) => onFilterChange('location', { ...filters?.location, pickup: e?.target?.checked })}
            />
            <Checkbox
              label="Local Store Stock"
              checked={filters?.location?.localStock || false}
              onChange={(e) => onFilterChange('location', { ...filters?.location, localStock: e?.target?.checked })}
            />
          </div>
        </FilterSection>
      </div>

      {/* Apply Button (Mobile) */}
      {isMobile && (
        <div className="p-4 border-t border-border">
          <Button variant="default" fullWidth onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-200 lg:hidden">
            <div className="fixed inset-y-0 left-0 w-80 bg-surface shadow-elevation-3 animate-slide-in">
              {sidebarContent}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="w-80 bg-surface border-r border-border hidden lg:block">
      {sidebarContent}
    </div>
  );
};

export default FilterSidebar;