import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CategorySelector = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-elevation-1">
      <h2 className="text-xl font-semibold text-text-primary mb-4">Tool Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => onCategorySelect(category)}
            className={`p-4 rounded-lg border-2 transition-smooth text-center ${
              selectedCategory?.id === category?.id
                ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50 hover:bg-muted'
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden bg-muted">
              <Image
                src={category?.image}
                alt={category?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-medium text-sm mb-1">{category?.name}</h3>
            <div className="flex items-center justify-center space-x-1 text-xs text-text-secondary">
              <Icon name="Package" size={12} />
              <span>{category?.availableCount} available</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;