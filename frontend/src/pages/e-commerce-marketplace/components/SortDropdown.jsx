import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SortDropdown = ({ sortBy, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: 'relevance', label: 'Relevance', icon: 'Target' },
    { value: 'price-low-high', label: 'Price: Low to High', icon: 'TrendingUp' },
    { value: 'price-high-low', label: 'Price: High to Low', icon: 'TrendingDown' },
    { value: 'rating', label: 'Customer Rating', icon: 'Star' },
    { value: 'newest', label: 'Newest Arrivals', icon: 'Clock' },
    { value: 'popularity', label: 'Most Popular', icon: 'Heart' },
    { value: 'discount', label: 'Highest Discount', icon: 'Percent' }
  ];

  const currentSort = sortOptions?.find(option => option?.value === sortBy) || sortOptions?.[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortSelect = (value) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-lg hover:border-primary/50 transition-smooth"
      >
        <Icon name={currentSort?.icon} size={16} className="text-text-secondary" />
        <span className="text-sm font-medium text-text-primary">
          Sort: {currentSort?.label}
        </span>
        <Icon
          name={isOpen ? "ChevronUp" : "ChevronDown"}
          size={16}
          className="text-text-secondary"
        />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-elevation-2 z-100 animate-fade-in">
          <div className="py-1">
            {sortOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => handleSortSelect(option?.value)}
                className={`flex items-center w-full px-4 py-2 text-sm transition-smooth ${
                  sortBy === option?.value
                    ? 'bg-primary/10 text-primary' :'text-popover-foreground hover:bg-muted'
                }`}
              >
                <Icon name={option?.icon} size={16} className="mr-3" />
                <span>{option?.label}</span>
                {sortBy === option?.value && (
                  <Icon name="Check" size={16} className="ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;