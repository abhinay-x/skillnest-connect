import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrendingServices = ({ onServiceClick }) => {
  const trendingServices = [
    {
      id: 1,
      name: 'Emergency Plumbing',
      category: 'Plumbing',
      averagePrice: '₹500-800/hr',
      availableWorkers: 12,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/8486944/pexels-photo-8486944.jpeg?auto=compress&cs=tinysrgb&w=400',
      urgency: 'high',
      description: 'Quick fixes for leaks, blockages, and pipe repairs'
    },
    {
      id: 2,
      name: 'House Deep Cleaning',
      category: 'Cleaning',
      averagePrice: '₹300-500/hr',
      availableWorkers: 8,
      rating: 4.7,
      image: 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400',
      urgency: 'medium',
      description: 'Complete home sanitization and deep cleaning'
    },
    {
      id: 3,
      name: 'AC Installation & Repair',
      category: 'AC Services',
      averagePrice: '₹400-700/hr',
      availableWorkers: 15,
      rating: 4.6,
      image: 'https://images.pexels.com/photos/8092/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
      urgency: 'high',
      description: 'Professional AC installation, repair and maintenance'
    },
    {
      id: 4,
      name: 'Electrical Wiring',
      category: 'Electrical',
      averagePrice: '₹600-900/hr',
      availableWorkers: 6,
      rating: 4.9,
      image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400',
      urgency: 'high',
      description: 'Safe electrical installations and repairs'
    },
    {
      id: 5,
      name: 'Furniture Assembly',
      category: 'Assembly',
      averagePrice: '₹250-400/hr',
      availableWorkers: 10,
      rating: 4.5,
      image: 'https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=400',
      urgency: 'low',
      description: 'Expert furniture assembly and installation'
    },
    {
      id: 6,
      name: 'Garden Maintenance',
      category: 'Gardening',
      averagePrice: '₹200-350/hr',
      availableWorkers: 7,
      rating: 4.4,
      image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400',
      urgency: 'low',
      description: 'Lawn care, pruning, and garden beautification'
    }
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      default: return 'text-success';
    }
  };

  const getUrgencyBg = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-error/10';
      case 'medium': return 'bg-warning/10';
      default: return 'bg-success/10';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Trending Services</h2>
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-smooth">
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendingServices?.map((service) => (
          <div
            key={service?.id}
            onClick={() => onServiceClick(service)}
            className="bg-card border border-border rounded-xl p-4 hover:shadow-elevation-2 transition-smooth cursor-pointer group"
          >
            {/* Service Image */}
            <div className="relative mb-3 overflow-hidden rounded-lg">
              <Image
                src={service?.image}
                alt={service?.name}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getUrgencyBg(service?.urgency)} ${getUrgencyColor(service?.urgency)}`}>
                {service?.urgency === 'high' ? 'Urgent' : service?.urgency === 'medium' ? 'Popular' : 'Available'}
              </div>
            </div>

            {/* Service Info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-smooth">
                  {service?.name}
                </h3>
                <div className="flex items-center space-x-1 text-xs text-text-secondary">
                  <Icon name="Star" size={12} className="text-warning fill-current" />
                  <span>{service?.rating}</span>
                </div>
              </div>

              <p className="text-sm text-text-secondary line-clamp-2">
                {service?.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-primary">
                    {service?.averagePrice}
                  </p>
                  <div className="flex items-center space-x-1 text-xs text-text-secondary">
                    <Icon name="Users" size={12} />
                    <span>{service?.availableWorkers} available</span>
                  </div>
                </div>

                <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-smooth">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingServices;