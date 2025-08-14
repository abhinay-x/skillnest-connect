import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const WorkerCard = ({ worker, onViewProfile, onInstantBook }) => {
  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance?.toFixed(1)}km away`;
  };

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'available': return 'text-success';
      case 'busy': return 'text-warning';
      case 'offline': return 'text-text-secondary';
      default: return 'text-text-secondary';
    }
  };

  const getAvailabilityBg = (status) => {
    switch (status) {
      case 'available': return 'bg-success';
      case 'busy': return 'bg-warning';
      case 'offline': return 'bg-text-secondary';
      default: return 'bg-text-secondary';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={12} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="StarHalf" size={12} className="text-warning fill-current" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={12} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-elevation-2 transition-smooth">
      {/* Header */}
      <div className="flex items-start space-x-3 mb-3">
        {/* Profile Image */}
        <div className="relative">
          <Image
            src={worker?.profileImage}
            alt={worker?.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          {/* Availability Indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getAvailabilityBg(worker?.availability)} rounded-full border-2 border-card`} />
        </div>

        {/* Worker Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-card-foreground truncate">
                {worker?.name}
              </h3>
              <p className="text-sm text-text-secondary">
                {worker?.specialization}
              </p>
            </div>
            
            {/* Verification Badge */}
            {worker?.isVerified && (
              <div className="flex-shrink-0 flex items-center space-x-1 bg-success/10 text-success px-2 py-1 rounded-full">
                <Icon name="CheckCircle" size={12} />
                <span className="text-xs font-medium">Verified</span>
              </div>
            )}
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center space-x-1">
              {renderStars(worker?.rating)}
            </div>
            <span className="text-sm font-medium text-text-primary">
              {worker?.rating}
            </span>
            <span className="text-sm text-text-secondary">
              ({worker?.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>
      {/* Skills */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-1">
          {worker?.skills?.slice(0, 3)?.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
          {worker?.skills?.length > 3 && (
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
              +{worker?.skills?.length - 3} more
            </span>
          )}
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div>
          <p className="text-lg font-semibold text-text-primary">
            {worker?.completedJobs}
          </p>
          <p className="text-xs text-text-secondary">Jobs Done</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-text-primary">
            {worker?.experience}y
          </p>
          <p className="text-xs text-text-secondary">Experience</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-text-primary">
            {worker?.responseTime}
          </p>
          <p className="text-xs text-text-secondary">Response</p>
        </div>
      </div>
      {/* Pricing and Distance */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-lg font-semibold text-primary">
            ₹{worker?.hourlyRate}/hr
          </p>
          <p className="text-xs text-text-secondary">
            {formatDistance(worker?.distance)}
          </p>
        </div>
        
        <div className="text-right">
          <p className={`text-sm font-medium ${getAvailabilityColor(worker?.availability)}`}>
            {worker?.availability === 'available' ? 'Available Now' : 
             worker?.availability === 'busy' ? 'Busy' : 'Offline'}
          </p>
          {worker?.nextAvailable && (
            <p className="text-xs text-text-secondary">
              Next: {worker?.nextAvailable}
            </p>
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={() => onViewProfile(worker)}
          className="flex-1"
        >
          View Profile
        </Button>
        <Button
          variant="default"
          onClick={() => onInstantBook(worker)}
          disabled={worker?.availability !== 'available'}
          className="flex-1"
        >
          {worker?.availability === 'available' ? 'Book Now' : 'Schedule'}
        </Button>
      </div>
      {/* Emergency Badge */}
      {worker?.emergencyAvailable && (
        <div className="mt-2 flex items-center justify-center space-x-1 bg-error/10 text-error px-2 py-1 rounded-lg">
          <Icon name="Zap" size={12} />
          <span className="text-xs font-medium">Emergency Available</span>
        </div>
      )}
    </div>
  );
};

export default WorkerCard;