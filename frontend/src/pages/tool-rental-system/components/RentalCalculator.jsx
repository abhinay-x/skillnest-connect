import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const RentalCalculator = ({ selectedTool, onRentalUpdate }) => {
  const [duration, setDuration] = useState(1);
  const [durationType, setDurationType] = useState('daily');
  const [includeOperator, setIncludeOperator] = useState(false);
  const [includeTraining, setIncludeTraining] = useState(false);
  const [includeDelivery, setIncludeDelivery] = useState(false);

  const durationOptions = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const calculateTotal = () => {
    if (!selectedTool) return 0;
    
    let basePrice = selectedTool?.pricing?.[durationType] * duration;
    let operatorCost = includeOperator ? selectedTool?.operatorCost * duration : 0;
    let trainingCost = includeTraining ? selectedTool?.trainingCost : 0;
    let deliveryCost = includeDelivery ? selectedTool?.deliveryCost : 0;
    
    // Apply bulk discount for longer durations
    let discount = 0;
    if (durationType === 'weekly' && duration >= 2) discount = 0.1;
    if (durationType === 'monthly' && duration >= 2) discount = 0.15;
    
    let subtotal = basePrice + operatorCost + trainingCost + deliveryCost;
    let discountAmount = subtotal * discount;
    
    return {
      basePrice,
      operatorCost,
      trainingCost,
      deliveryCost,
      discount: discountAmount,
      total: subtotal - discountAmount,
      securityDeposit: selectedTool?.securityDeposit
    };
  };

  const pricing = calculateTotal();

  useEffect(() => {
    if (onRentalUpdate) {
      onRentalUpdate({
        duration,
        durationType,
        includeOperator,
        includeTraining,
        includeDelivery,
        pricing
      });
    }
  }, [duration, durationType, includeOperator, includeTraining, includeDelivery, selectedTool]);

  if (!selectedTool) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-elevation-1">
        <div className="text-center text-text-secondary">
          <Icon name="Calculator" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select a tool to calculate rental cost</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-elevation-1 sticky top-4">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Rental Calculator</h3>
      {/* Duration Selection */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Rental Duration
          </label>
          <Select
            options={durationOptions}
            value={durationType}
            onChange={setDurationType}
            className="mb-3"
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDuration(Math.max(1, duration - 1))}
              className="w-8 h-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-smooth"
            >
              <Icon name="Minus" size={16} />
            </button>
            <span className="px-4 py-2 bg-muted rounded-md font-medium min-w-[60px] text-center">
              {duration}
            </span>
            <button
              onClick={() => setDuration(duration + 1)}
              className="w-8 h-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-smooth"
            >
              <Icon name="Plus" size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Add-on Services */}
      <div className="space-y-3 mb-6">
        <h4 className="font-medium text-text-primary">Optional Services</h4>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeOperator}
            onChange={(e) => setIncludeOperator(e?.target?.checked)}
            className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-text-primary">Include Operator</span>
            <p className="text-xs text-text-secondary">₹{selectedTool?.operatorCost}/{durationType?.slice(0, -2)}</p>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeTraining}
            onChange={(e) => setIncludeTraining(e?.target?.checked)}
            className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-text-primary">Training Session</span>
            <p className="text-xs text-text-secondary">₹{selectedTool?.trainingCost} one-time</p>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeDelivery}
            onChange={(e) => setIncludeDelivery(e?.target?.checked)}
            className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-text-primary">Pickup & Delivery</span>
            <p className="text-xs text-text-secondary">₹{selectedTool?.deliveryCost}</p>
          </div>
        </label>
      </div>
      {/* Price Breakdown */}
      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Base rental ({duration} {durationType?.slice(0, -2)})</span>
          <span className="text-text-primary">₹{pricing?.basePrice?.toLocaleString('en-IN')}</span>
        </div>
        
        {pricing?.operatorCost > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Operator service</span>
            <span className="text-text-primary">₹{pricing?.operatorCost?.toLocaleString('en-IN')}</span>
          </div>
        )}
        
        {pricing?.trainingCost > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Training session</span>
            <span className="text-text-primary">₹{pricing?.trainingCost?.toLocaleString('en-IN')}</span>
          </div>
        )}
        
        {pricing?.deliveryCost > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Pickup & delivery</span>
            <span className="text-text-primary">₹{pricing?.deliveryCost?.toLocaleString('en-IN')}</span>
          </div>
        )}
        
        {pricing?.discount > 0 && (
          <div className="flex justify-between text-sm text-success">
            <span>Bulk discount</span>
            <span>-₹{pricing?.discount?.toLocaleString('en-IN')}</span>
          </div>
        )}
        
        <div className="border-t border-border pt-2 flex justify-between font-semibold">
          <span className="text-text-primary">Total</span>
          <span className="text-primary">₹{pricing?.total?.toLocaleString('en-IN')}</span>
        </div>
        
        <div className="flex justify-between text-sm text-text-secondary">
          <span>Security deposit</span>
          <span>₹{pricing?.securityDeposit?.toLocaleString('en-IN')}</span>
        </div>
      </div>
      <Button variant="default" fullWidth className="mt-6">
        <Icon name="Calendar" size={16} className="mr-2" />
        Book Now
      </Button>
    </div>
  );
};

export default RentalCalculator;