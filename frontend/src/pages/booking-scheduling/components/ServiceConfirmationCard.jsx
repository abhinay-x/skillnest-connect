import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ServiceConfirmationCard = ({ service, worker }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(price);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-card-foreground mb-1">
            {service?.name}
          </h2>
          <p className="text-text-secondary text-sm">
            {service?.category}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-primary">
            {formatPrice(service?.baseRate)}/hr
          </p>
          <p className="text-xs text-text-secondary">Base Rate</p>
        </div>
      </div>
      <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
        <div className="relative">
          <Image
            src={worker?.profileImage}
            alt={worker?.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          {worker?.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
              <Icon name="Check" size={12} color="white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-card-foreground">{worker?.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={14} className="text-warning fill-current" />
              <span className="text-sm font-medium text-card-foreground">
                {worker?.rating}
              </span>
            </div>
            <span className="text-text-secondary text-sm">
              ({worker?.reviewCount} reviews)
            </span>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={12} className="text-text-secondary" />
              <span className="text-xs text-text-secondary">
                {worker?.distance} away
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} className="text-text-secondary" />
              <span className="text-xs text-text-secondary">
                {worker?.experience} exp
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center space-x-1 mb-1">
            <Icon name="Shield" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">Verified</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Award" size={14} className="text-accent" />
            <span className="text-xs text-accent font-medium">Pro</span>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-text-secondary">Specialization:</span>
          <p className="font-medium text-card-foreground">{worker?.specialization}</p>
        </div>
        <div>
          <span className="text-text-secondary">Response Time:</span>
          <p className="font-medium text-card-foreground">{worker?.responseTime}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceConfirmationCard;