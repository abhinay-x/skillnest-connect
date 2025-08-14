import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const WorkerHero = ({ worker, onBookNow, onRequestQuote, onMessage }) => {
  const formatRating = (rating) => {
    return rating ? rating?.toFixed(1) : '0.0';
  };

  const getVerificationBadges = () => {
    const badges = [];
    if (worker?.verifications?.aadhaar) badges?.push({ name: 'Aadhaar', icon: 'Shield', color: 'text-success' });
    if (worker?.verifications?.pan) badges?.push({ name: 'PAN', icon: 'FileText', color: 'text-success' });
    if (worker?.verifications?.background) badges?.push({ name: 'Background', icon: 'CheckCircle', color: 'text-success' });
    if (worker?.verifications?.phone) badges?.push({ name: 'Phone', icon: 'Phone', color: 'text-success' });
    return badges;
  };

  return (
    <div className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-6 lg:space-y-0">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-primary/20">
                <Image
                  src={worker?.profileImage}
                  alt={`${worker?.name} profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              {worker?.isOnline && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-success rounded-full border-2 border-surface flex items-center justify-center">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          {/* Worker Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1 min-w-0">
                {/* Name and Title */}
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-text-primary truncate">
                    {worker?.name}
                  </h1>
                  {worker?.isPremium && (
                    <div className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
                      Premium
                    </div>
                  )}
                </div>

                <p className="text-lg text-text-secondary mb-3">{worker?.specialization}</p>

                {/* Rating and Reviews */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5]?.map((star) => (
                        <Icon
                          key={star}
                          name="Star"
                          size={16}
                          className={`${
                            star <= Math.floor(worker?.rating)
                              ? 'text-accent fill-current'
                              : star - 0.5 <= worker?.rating
                              ? 'text-accent fill-current opacity-50' :'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-text-primary ml-1">
                      {formatRating(worker?.rating)}
                    </span>
                  </div>
                  <span className="text-sm text-text-secondary">
                    ({worker?.reviewCount} reviews)
                  </span>
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={14} className="text-text-secondary" />
                    <span className="text-sm text-text-secondary">{worker?.location}</span>
                  </div>
                </div>

                {/* Trust Score */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center space-x-2 bg-success/10 px-3 py-1 rounded-full">
                    <Icon name="Shield" size={16} className="text-success" />
                    <span className="text-sm font-medium text-success">
                      Trust Score: {worker?.trustScore}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={14} className="text-text-secondary" />
                    <span className="text-sm text-text-secondary">
                      Responds in {worker?.responseTime}
                    </span>
                  </div>
                </div>

                {/* Verification Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {getVerificationBadges()?.map((badge, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-1 bg-muted px-2 py-1 rounded-md"
                    >
                      <Icon name={badge?.icon} size={12} className={badge?.color} />
                      <span className="text-xs text-text-secondary">{badge?.name} Verified</span>
                    </div>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 lg:hidden">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-text-primary">
                      {worker?.completedJobs}
                    </div>
                    <div className="text-xs text-text-secondary">Jobs Done</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-text-primary">
                      {worker?.experience}y
                    </div>
                    <div className="text-xs text-text-secondary">Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-text-primary">
                      {worker?.completionRate}%
                    </div>
                    <div className="text-xs text-text-secondary">Success Rate</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-0 lg:space-y-2 flex-shrink-0">
                <Button
                  variant="default"
                  onClick={onBookNow}
                  iconName="Calendar"
                  iconPosition="left"
                  className="w-full sm:w-auto lg:w-32"
                >
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  onClick={onRequestQuote}
                  iconName="FileText"
                  iconPosition="left"
                  className="w-full sm:w-auto lg:w-32"
                >
                  Get Quote
                </Button>
                <Button
                  variant="secondary"
                  onClick={onMessage}
                  iconName="MessageCircle"
                  iconPosition="left"
                  className="w-full sm:w-auto lg:w-32"
                >
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerHero;