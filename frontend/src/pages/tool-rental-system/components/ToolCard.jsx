import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ToolCard = ({ tool, onSelect, isSelected }) => {
  const formatPrice = (price) => {
    return `₹${price?.toLocaleString('en-IN')}`;
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-primary';
      case 'fair': return 'text-warning';
      default: return 'text-text-secondary';
    }
  };

  const getAvailabilityStatus = (available) => {
    return available ? 'Available' : 'Rented';
  };

  const getAvailabilityColor = (available) => {
    return available ? 'text-success' : 'text-error';
  };

  return (
    <div className={`bg-card rounded-lg shadow-elevation-1 overflow-hidden transition-smooth hover:shadow-elevation-2 cursor-pointer ${
      isSelected ? 'ring-2 ring-primary' : ''
    }`} onClick={() => onSelect(tool)}>
      {/* Tool Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={tool?.image}
          alt={tool?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            tool?.available 
              ? 'bg-success/10 text-success' :'bg-error/10 text-error'
          }`}>
            {getAvailabilityStatus(tool?.available)}
          </span>
        </div>
        {tool?.featured && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium">
              Featured
            </span>
          </div>
        )}
      </div>
      {/* Tool Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-text-primary text-lg leading-tight">{tool?.name}</h3>
          <div className="flex items-center space-x-1 ml-2">
            <Icon name="Star" size={16} className="text-warning fill-current" />
            <span className="text-sm font-medium text-text-primary">{tool?.rating}</span>
          </div>
        </div>

        <p className="text-text-secondary text-sm mb-3 line-clamp-2">{tool?.description}</p>

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="flex items-center space-x-1">
            <Icon name="Zap" size={12} className="text-text-secondary" />
            <span className="text-text-secondary">{tool?.specifications?.power}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Package" size={12} className="text-text-secondary" />
            <span className="text-text-secondary">{tool?.specifications?.weight}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={12} className={getConditionColor(tool?.condition)} />
            <span className={getConditionColor(tool?.condition)}>{tool?.condition}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="MapPin" size={12} className="text-text-secondary" />
            <span className="text-text-secondary">{tool?.location}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t border-border pt-3">
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div>
              <span className="text-text-secondary">Hourly:</span>
              <span className="font-medium text-text-primary ml-1">{formatPrice(tool?.pricing?.hourly)}</span>
            </div>
            <div>
              <span className="text-text-secondary">Daily:</span>
              <span className="font-medium text-text-primary ml-1">{formatPrice(tool?.pricing?.daily)}</span>
            </div>
            <div>
              <span className="text-text-secondary">Weekly:</span>
              <span className="font-medium text-text-primary ml-1">{formatPrice(tool?.pricing?.weekly)}</span>
            </div>
            <div>
              <span className="text-text-secondary">Monthly:</span>
              <span className="font-medium text-text-primary ml-1">{formatPrice(tool?.pricing?.monthly)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              variant={tool?.available ? "default" : "outline"}
              size="sm"
              fullWidth
              disabled={!tool?.available}
            >
              {tool?.available ? 'Select Tool' : 'Not Available'}
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="Eye" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;