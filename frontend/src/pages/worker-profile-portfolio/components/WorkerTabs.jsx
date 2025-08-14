import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const WorkerTabs = ({ activeTab, onTabChange, worker }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'experience', label: 'Experience', icon: 'Briefcase' },
    { id: 'skills', label: 'Skills', icon: 'Award' },
    { id: 'portfolio', label: 'Portfolio', icon: 'Image' },
    { id: 'reviews', label: 'Reviews', icon: 'Star' },
    { id: 'pricing', label: 'Pricing', icon: 'DollarSign' }
  ];

  return (
    <div className="bg-surface border-b border-border sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-0 overflow-x-auto scrollbar-hide">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => onTabChange(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-4 text-sm font-medium border-b-2 transition-smooth whitespace-nowrap ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-muted-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
              {tab?.id === 'reviews' && (
                <span className="bg-muted text-text-secondary text-xs px-2 py-0.5 rounded-full ml-1">
                  {worker?.reviewCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerTabs;