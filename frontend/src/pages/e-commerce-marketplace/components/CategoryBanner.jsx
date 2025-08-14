import React from 'react';

import Image from '../../../components/AppImage';

const CategoryBanner = ({ categories, onCategorySelect, selectedCategory }) => {
  return (
    <div className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Shop by Category</h2>
          <button className="text-primary hover:text-primary/80 text-sm font-medium transition-smooth">
            View All
          </button>
        </div>
        
        <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => onCategorySelect(category?.id)}
              className={`flex-shrink-0 w-32 sm:w-40 p-3 rounded-lg border transition-smooth ${
                selectedCategory === category?.id
                  ? 'border-primary bg-primary/10' :'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-2 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={category?.image}
                  alt={category?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-sm font-medium text-text-primary text-center truncate">
                {category?.name}
              </h3>
              <p className="text-xs text-text-secondary text-center mt-1">
                {category?.itemCount} items
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBanner;