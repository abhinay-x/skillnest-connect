import React from 'react';
import Icon from '../../../components/AppIcon';

const OverviewTab = ({ worker }) => {
  const getAvailabilityStatus = () => {
    if (worker?.isOnline) {
      return { text: 'Available Now', color: 'text-success', bgColor: 'bg-success/10' };
    } else if (worker?.nextAvailable) {
      return { text: `Available ${worker?.nextAvailable}`, color: 'text-warning', bgColor: 'bg-warning/10' };
    } else {
      return { text: 'Busy', color: 'text-error', bgColor: 'bg-error/10' };
    }
  };

  const availability = getAvailabilityStatus();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">About</h2>
            <p className="text-text-secondary leading-relaxed">{worker?.bio}</p>
          </div>

          {/* Service Areas */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Service Areas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {worker?.serviceAreas?.map((area, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Icon name="MapPin" size={16} className="text-primary" />
                  <span className="text-text-secondary">{area}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {worker?.languages?.map((language, index) => (
                <span
                  key={index}
                  className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Jobs Completed</span>
                <span className="font-semibold text-card-foreground">{worker?.completedJobs}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Experience</span>
                <span className="font-semibold text-card-foreground">{worker?.experience} years</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Success Rate</span>
                <span className="font-semibold text-success">{worker?.completionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Response Time</span>
                <span className="font-semibold text-card-foreground">{worker?.responseTime}</span>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Availability</h3>
            <div className={`flex items-center space-x-2 ${availability?.bgColor} px-3 py-2 rounded-md mb-4`}>
              <div className={`w-2 h-2 rounded-full ${availability?.color?.replace('text-', 'bg-')}`}></div>
              <span className={`text-sm font-medium ${availability?.color}`}>
                {availability?.text}
              </span>
            </div>
            <div className="space-y-2">
              {worker?.workingHours?.map((schedule, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-text-secondary">{schedule?.day}</span>
                  <span className="text-card-foreground">{schedule?.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Icon name="Phone" size={16} className="text-text-secondary" />
                <span className="text-text-secondary">+91 {worker?.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="Mail" size={16} className="text-text-secondary" />
                <span className="text-text-secondary">{worker?.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="MapPin" size={16} className="text-text-secondary" />
                <span className="text-text-secondary">{worker?.address}</span>
              </div>
            </div>
          </div>

          {/* Emergency Services */}
          {worker?.emergencyServices && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="AlertTriangle" size={16} className="text-error" />
                <h3 className="text-lg font-semibold text-error">Emergency Services</h3>
              </div>
              <p className="text-sm text-text-secondary">
                Available for emergency calls 24/7 with additional charges
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;