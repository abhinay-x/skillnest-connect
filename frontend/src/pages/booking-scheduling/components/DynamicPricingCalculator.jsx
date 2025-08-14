import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const DynamicPricingCalculator = ({ 
  baseRate = 500, 
  selectedDate, 
  selectedTime, 
  duration = 1, 
  location = '', 
  isEmergencyBooking = false,
  workerExperienceLevel = 'intermediate'
}) => {
  const [pricingBreakdown, setPricingBreakdown] = useState({
    baseRate: 0,
    surgeMultiplier: 1,
    locationAdjustment: 0,
    experiencePremium: 0,
    emergencyFee: 0,
    platformFee: 0,
    gst: 0,
    total: 0
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(price);
  };

  const calculatePricing = () => {
    let breakdown = {
      baseRate: baseRate * duration,
      surgeMultiplier: 1,
      locationAdjustment: 0,
      experiencePremium: 0,
      emergencyFee: 0,
      platformFee: 0,
      gst: 0,
      total: 0
    };

    // Surge pricing based on time and date
    if (selectedDate && selectedTime) {
      const hour = selectedTime?.getHours();
      const dayOfWeek = selectedDate?.getDay();
      
      // Peak hours (8-10 AM, 6-8 PM)
      if ((hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 20)) {
        breakdown.surgeMultiplier = 1.2;
      }
      
      // Weekend premium
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        breakdown.surgeMultiplier = Math.max(breakdown?.surgeMultiplier, 1.15);
      }
    }

    // Location adjustment (mock data)
    const locationPremiums = {
      'south-delhi': 100,
      'gurgaon': 150,
      'noida': 75,
      'mumbai-central': 200,
      'bangalore-koramangala': 125
    };
    breakdown.locationAdjustment = locationPremiums?.[location] || 0;

    // Experience premium
    const experiencePremiums = {
      'beginner': 0,
      'intermediate': 50,
      'expert': 150,
      'master': 300
    };
    breakdown.experiencePremium = experiencePremiums?.[workerExperienceLevel] || 0;

    // Emergency booking fee
    if (isEmergencyBooking) {
      breakdown.emergencyFee = Math.round(breakdown?.baseRate * 0.3);
    }

    // Calculate subtotal
    const subtotal = (breakdown?.baseRate * breakdown?.surgeMultiplier) + 
                    breakdown?.locationAdjustment + 
                    breakdown?.experiencePremium + 
                    breakdown?.emergencyFee;

    // Platform fee (5% of subtotal)
    breakdown.platformFee = Math.round(subtotal * 0.05);

    // GST (18% on platform fee only)
    breakdown.gst = Math.round(breakdown?.platformFee * 0.18);

    // Total
    breakdown.total = subtotal + breakdown?.platformFee + breakdown?.gst;

    setPricingBreakdown(breakdown);
  };

  useEffect(() => {
    calculatePricing();
  }, [baseRate, selectedDate, selectedTime, duration, location, isEmergencyBooking, workerExperienceLevel]);

  const getSurgeIndicator = () => {
    if (pricingBreakdown?.surgeMultiplier > 1.15) {
      return { color: 'text-destructive', label: 'High Demand', icon: 'TrendingUp' };
    } else if (pricingBreakdown?.surgeMultiplier > 1.05) {
      return { color: 'text-warning', label: 'Moderate Demand', icon: 'TrendingUp' };
    }
    return { color: 'text-success', label: 'Normal Pricing', icon: 'Minus' };
  };

  const surgeInfo = getSurgeIndicator();

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          Pricing Calculator
        </h3>
        <div className={`flex items-center space-x-1 ${surgeInfo?.color}`}>
          <Icon name={surgeInfo?.icon} size={16} />
          <span className="text-sm font-medium">{surgeInfo?.label}</span>
        </div>
      </div>
      <div className="space-y-3">
        {/* Base Rate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-text-secondary" />
            <span className="text-sm text-card-foreground">
              Base Rate ({duration}h)
            </span>
          </div>
          <span className="font-medium text-card-foreground">
            {formatPrice(pricingBreakdown?.baseRate)}
          </span>
        </div>

        {/* Surge Multiplier */}
        {pricingBreakdown?.surgeMultiplier > 1 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} className="text-warning" />
              <span className="text-sm text-card-foreground">
                Surge Pricing ({Math.round((pricingBreakdown?.surgeMultiplier - 1) * 100)}%)
              </span>
            </div>
            <span className="font-medium text-warning">
              +{formatPrice((pricingBreakdown?.baseRate * pricingBreakdown?.surgeMultiplier) - pricingBreakdown?.baseRate)}
            </span>
          </div>
        )}

        {/* Location Adjustment */}
        {pricingBreakdown?.locationAdjustment > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="MapPin" size={16} className="text-text-secondary" />
              <span className="text-sm text-card-foreground">
                Location Premium
              </span>
            </div>
            <span className="font-medium text-card-foreground">
              +{formatPrice(pricingBreakdown?.locationAdjustment)}
            </span>
          </div>
        )}

        {/* Experience Premium */}
        {pricingBreakdown?.experiencePremium > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Award" size={16} className="text-accent" />
              <span className="text-sm text-card-foreground">
                Experience Premium
              </span>
            </div>
            <span className="font-medium text-accent">
              +{formatPrice(pricingBreakdown?.experiencePremium)}
            </span>
          </div>
        )}

        {/* Emergency Fee */}
        {pricingBreakdown?.emergencyFee > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-destructive" />
              <span className="text-sm text-card-foreground">
                Emergency Booking Fee
              </span>
            </div>
            <span className="font-medium text-destructive">
              +{formatPrice(pricingBreakdown?.emergencyFee)}
            </span>
          </div>
        )}

        <div className="border-t border-border pt-3">
          {/* Platform Fee */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-text-secondary" />
              <span className="text-sm text-card-foreground">
                Platform Fee
              </span>
            </div>
            <span className="font-medium text-card-foreground">
              +{formatPrice(pricingBreakdown?.platformFee)}
            </span>
          </div>

          {/* GST */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <Icon name="Receipt" size={16} className="text-text-secondary" />
              <span className="text-sm text-card-foreground">
                GST (18%)
              </span>
            </div>
            <span className="font-medium text-card-foreground">
              +{formatPrice(pricingBreakdown?.gst)}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-border pt-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-card-foreground">
              Total Amount
            </span>
            <span className="text-xl font-bold text-primary">
              {formatPrice(pricingBreakdown?.total)}
            </span>
          </div>
        </div>
      </div>
      {/* Savings Indicator */}
      {!isEmergencyBooking && pricingBreakdown?.surgeMultiplier === 1 && (
        <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Percent" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">
              You're saving ₹{Math.round(baseRate * 0.2)} with off-peak booking!
            </span>
          </div>
        </div>
      )}
      {/* Price Breakdown Toggle */}
      <div className="mt-4 text-center">
        <button className="text-sm text-primary hover:text-primary/80 transition-smooth flex items-center space-x-1 mx-auto">
          <Icon name="Info" size={14} />
          <span>View detailed breakdown</span>
        </button>
      </div>
    </div>
  );
};

export default DynamicPricingCalculator;