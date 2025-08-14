import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const AIRecommendations = ({ onWorkerSelect, userPreferences = {} }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock AI recommendations based on user behavior
  const mockRecommendations = [
    {
      id: 'rec-1',
      type: 'trending',
      title: 'Trending in Your Area',
      subtitle: 'Popular services near you',
      workers: [
        {
          id: 101,
          name: 'Vikash Gupta',
          specialization: 'Emergency Plumber',
          profileImage: 'https://randomuser.me/api/portraits/men/67.jpg',
          rating: 4.9,
          hourlyRate: 700,
          distance: 0.9,
          matchScore: 95,
          reasonTag: 'High demand in your area'
        },
        {
          id: 102,
          name: 'Neha Agarwal',
          specialization: 'Professional Cleaner',
          profileImage: 'https://randomuser.me/api/portraits/women/52.jpg',
          rating: 4.8,
          hourlyRate: 380,
          distance: 1.1,
          matchScore: 92,
          reasonTag: 'Excellent reviews nearby'
        }
      ]
    },
    {
      id: 'rec-2',
      type: 'personalized',
      title: 'Perfect Match for You',
      subtitle: 'Based on your previous bookings',
      workers: [
        {
          id: 103,
          name: 'Ravi Mehta',
          specialization: 'AC Specialist',
          profileImage: 'https://randomuser.me/api/portraits/men/73.jpg',
          rating: 4.7,
          hourlyRate: 650,
          distance: 2.3,
          matchScore: 88,
          reasonTag: 'Similar to your last booking'
        },
        {
          id: 104,
          name: 'Anjali Rao',
          specialization: 'Interior Painter',
          profileImage: 'https://randomuser.me/api/portraits/women/29.jpg',
          rating: 4.6,
          hourlyRate: 480,
          distance: 1.7,
          matchScore: 85,
          reasonTag: 'Matches your style preferences'
        }
      ]
    },
    {
      id: 'rec-3',
      type: 'budget',
      title: 'Great Value Options',
      subtitle: 'Quality service within your budget',
      workers: [
        {
          id: 105,
          name: 'Suresh Yadav',
          specialization: 'Handyman',
          profileImage: 'https://randomuser.me/api/portraits/men/48.jpg',
          rating: 4.5,
          hourlyRate: 320,
          distance: 1.4,
          matchScore: 82,
          reasonTag: 'Best value in your range'
        },
        {
          id: 106,
          name: 'Pooja Kumari',
          specialization: 'Garden Maintenance',
          profileImage: 'https://randomuser.me/api/portraits/women/61.jpg',
          rating: 4.4,
          hourlyRate: 280,
          distance: 2.1,
          matchScore: 79,
          reasonTag: 'Affordable & reliable'
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate AI processing
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1200);
  }, []);

  const nextRecommendation = () => {
    setCurrentIndex((prev) => (prev + 1) % recommendations?.length);
  };

  const prevRecommendation = () => {
    setCurrentIndex((prev) => (prev - 1 + recommendations?.length) % recommendations?.length);
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'trending': return 'TrendingUp';
      case 'personalized': return 'Target';
      case 'budget': return 'DollarSign';
      default: return 'Sparkles';
    }
  };

  const getRecommendationColor = (type) => {
    switch (type) {
      case 'trending': return 'text-success';
      case 'personalized': return 'text-primary';
      case 'budget': return 'text-warning';
      default: return 'text-accent';
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-muted rounded-lg animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
            <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2]?.map((i) => (
            <div key={i} className="bg-muted rounded-lg p-4 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-muted-foreground/20 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations?.length === 0) {
    return null;
  }

  const currentRec = recommendations?.[currentIndex];

  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon 
              name={getRecommendationIcon(currentRec?.type)} 
              size={18} 
              className={getRecommendationColor(currentRec?.type)} 
            />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary flex items-center space-x-2">
              <Icon name="Sparkles" size={16} className="text-accent" />
              <span>{currentRec?.title}</span>
            </h3>
            <p className="text-sm text-text-secondary">{currentRec?.subtitle}</p>
          </div>
        </div>

        {/* Navigation */}
        {recommendations?.length > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={prevRecommendation}
              className="p-1 text-text-secondary hover:text-text-primary transition-smooth"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            <div className="flex space-x-1">
              {recommendations?.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-smooth ${
                    index === currentIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextRecommendation}
              className="p-1 text-text-secondary hover:text-text-primary transition-smooth"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        )}
      </div>
      {/* Recommended Workers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentRec?.workers?.map((worker) => (
          <div
            key={worker?.id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-smooth cursor-pointer group"
            onClick={() => onWorkerSelect(worker)}
          >
            <div className="flex items-center space-x-3 mb-3">
              <Image
                src={worker?.profileImage}
                alt={worker?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-card-foreground truncate group-hover:text-primary transition-smooth">
                  {worker?.name}
                </h4>
                <p className="text-sm text-text-secondary truncate">
                  {worker?.specialization}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={12} className="text-warning fill-current" />
                  <span className="text-sm font-medium">{worker?.rating}</span>
                </div>
                <p className="text-sm text-primary font-medium">
                  ₹{worker?.hourlyRate}/hr
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-text-secondary">
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={12} />
                  <span>{worker?.distance}km away</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Target" size={12} />
                  <span>{worker?.matchScore}% match</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 bg-accent/10 text-accent px-2 py-1 rounded-full">
                <Icon name="Zap" size={10} />
                <span className="text-xs font-medium">{worker?.reasonTag}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* CTA */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            AI-powered recommendations based on your preferences
          </p>
          <Button variant="outline" size="sm">
            <Icon name="RefreshCw" size={14} className="mr-1" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;