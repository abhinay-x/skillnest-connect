import React, { useRef, useState } from 'react';
import Icon from '../../../components/AppIcon';

const CategoryChips = ({ selectedCategory, onCategorySelect }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const categories = [
    { id: 'all', name: 'All Services', icon: 'Grid3X3', color: 'bg-primary' },
    { id: 'carpentry', name: 'Carpentry', icon: 'Hammer', color: 'bg-amber-500' },
    { id: 'plumbing', name: 'Plumbing', icon: 'Wrench', color: 'bg-blue-500' },
    { id: 'electrical', name: 'Electrical', icon: 'Zap', color: 'bg-yellow-500' },
    { id: 'painting', name: 'Painting', icon: 'Paintbrush', color: 'bg-purple-500' },
    { id: 'cleaning', name: 'Cleaning', icon: 'Sparkles', color: 'bg-green-500' },
    { id: 'gardening', name: 'Gardening', icon: 'TreePine', color: 'bg-emerald-500' },
    { id: 'appliance', name: 'Appliance Repair', icon: 'Settings', color: 'bg-gray-500' },
    { id: 'ac-services', name: 'AC Services', icon: 'Wind', color: 'bg-cyan-500' },
    { id: 'security', name: 'Security', icon: 'Shield', color: 'bg-red-500' },
    { id: 'moving', name: 'Moving', icon: 'Truck', color: 'bg-orange-500' },
    { id: 'glass-work', name: 'Glass Work', icon: 'Square', color: 'bg-indigo-500' },
    { id: 'construction', name: 'Construction', icon: 'HardHat', color: 'bg-stone-500' },
    { id: 'event-services', name: 'Event Services', icon: 'Calendar', color: 'bg-pink-500' },
    { id: 'home-repairs', name: 'Home Repairs', icon: 'Home', color: 'bg-teal-500' },
    { id: 'assembly', name: 'Assembly', icon: 'Package', color: 'bg-violet-500' }
  ];

  const scroll = (direction) => {
    const container = scrollRef?.current;
    if (container) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? container?.scrollLeft - scrollAmount 
        : container?.scrollLeft + scrollAmount;
      
      container?.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    const container = scrollRef?.current;
    if (container) {
      setCanScrollLeft(container?.scrollLeft > 0);
      setCanScrollRight(
        container?.scrollLeft < container?.scrollWidth - container?.clientWidth
      );
    }
  };

  const handleCategoryClick = (categoryId) => {
    onCategorySelect(categoryId);
  };

  return (
    <div className="relative">
      {/* Left Scroll Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-surface border border-border rounded-full shadow-elevation-2 flex items-center justify-center text-text-secondary hover:text-text-primary transition-smooth"
        >
          <Icon name="ChevronLeft" size={16} />
        </button>
      )}
      {/* Right Scroll Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-surface border border-border rounded-full shadow-elevation-2 flex items-center justify-center text-text-secondary hover:text-text-primary transition-smooth"
        >
          <Icon name="ChevronRight" size={16} />
        </button>
      )}
      {/* Category Chips Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2 px-8 md:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => handleCategoryClick(category?.id)}
            className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 rounded-xl border transition-smooth ${
              selectedCategory === category?.id
                ? 'bg-primary text-primary-foreground border-primary shadow-elevation-2'
                : 'bg-surface text-text-primary border-border hover:border-primary/50 hover:bg-primary/5'
            }`}
          >
            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
              selectedCategory === category?.id ? 'bg-primary-foreground/20' : category?.color
            }`}>
              <Icon 
                name={category?.icon} 
                size={14} 
                color={selectedCategory === category?.id ? 'currentColor' : 'white'} 
              />
            </div>
            <span className="text-sm font-medium whitespace-nowrap">
              {category?.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryChips;