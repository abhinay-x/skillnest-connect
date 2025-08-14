import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const RecurringBookingOptions = ({ 
  recurringOptions, 
  onRecurringOptionsChange 
}) => {
  const [isRecurring, setIsRecurring] = useState(recurringOptions?.enabled || false);

  const frequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly (Every 2 weeks)' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom Schedule' }
  ];

  const durationOptions = [
    { value: '1', label: '1 month' },
    { value: '3', label: '3 months' },
    { value: '6', label: '6 months' },
    { value: '12', label: '1 year' },
    { value: 'ongoing', label: 'Ongoing (until cancelled)' }
  ];

  const dayOptions = [
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' }
  ];

  const handleRecurringToggle = (enabled) => {
    setIsRecurring(enabled);
    onRecurringOptionsChange({
      ...recurringOptions,
      enabled,
      frequency: enabled ? (recurringOptions?.frequency || 'weekly') : '',
      duration: enabled ? (recurringOptions?.duration || '3') : '',
      selectedDays: enabled ? (recurringOptions?.selectedDays || []) : [],
      endDate: enabled ? recurringOptions?.endDate : null
    });
  };

  const handleOptionChange = (field, value) => {
    onRecurringOptionsChange({
      ...recurringOptions,
      [field]: value
    });
  };

  const calculateDiscount = () => {
    if (!isRecurring) return 0;
    
    const discountRates = {
      'weekly': 5,
      'biweekly': 8,
      'monthly': 12,
      'custom': 5
    };
    
    const durationMultiplier = {
      '1': 1,
      '3': 1.2,
      '6': 1.5,
      '12': 2,
      'ongoing': 2.5
    };
    
    const baseDiscount = discountRates?.[recurringOptions?.frequency] || 0;
    const multiplier = durationMultiplier?.[recurringOptions?.duration] || 1;
    
    return Math.min(Math.round(baseDiscount * multiplier), 25);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(price);
  };

  const discount = calculateDiscount();
  const estimatedSavings = isRecurring ? Math.round(500 * (discount / 100)) : 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Recurring Booking
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="Repeat" size={16} className="text-text-secondary" />
          <span className="text-sm text-text-secondary">Save with regular bookings</span>
        </div>
      </div>
      {/* Enable Recurring Toggle */}
      <div className="mb-6">
        <Checkbox
          label="Set up recurring booking"
          description="Schedule regular appointments and save money with bulk booking discounts"
          checked={isRecurring}
          onChange={(e) => handleRecurringToggle(e?.target?.checked)}
        />
      </div>
      {isRecurring && (
        <div className="space-y-6">
          {/* Frequency Selection */}
          <div>
            <Select
              label="Booking Frequency"
              description="How often do you need this service?"
              options={frequencyOptions}
              value={recurringOptions?.frequency || 'weekly'}
              onChange={(value) => handleOptionChange('frequency', value)}
              required
            />
          </div>

          {/* Duration Selection */}
          <div>
            <Select
              label="Booking Duration"
              description="How long do you want to continue this service?"
              options={durationOptions}
              value={recurringOptions?.duration || '3'}
              onChange={(value) => handleOptionChange('duration', value)}
              required
            />
          </div>

          {/* Day Selection for Weekly/Bi-weekly */}
          {(recurringOptions?.frequency === 'weekly' || recurringOptions?.frequency === 'biweekly') && (
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-3">
                Select Days
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {dayOptions?.map((day) => (
                  <label key={day?.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={recurringOptions?.selectedDays?.includes(day?.value) || false}
                      onChange={(e) => {
                        const selectedDays = recurringOptions?.selectedDays || [];
                        const newSelectedDays = e?.target?.checked
                          ? [...selectedDays, day?.value]
                          : selectedDays?.filter(d => d !== day?.value);
                        handleOptionChange('selectedDays', newSelectedDays);
                      }}
                      className="rounded border-border text-primary focus:ring-ring"
                    />
                    <span className="text-sm text-card-foreground">{day?.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Custom Schedule for Monthly */}
          {recurringOptions?.frequency === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Day of Month
              </label>
              <select
                value={recurringOptions?.dayOfMonth || '1'}
                onChange={(e) => handleOptionChange('dayOfMonth', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                {Array.from({ length: 28 }, (_, i) => i + 1)?.map(day => (
                  <option key={day} value={day?.toString()}>
                    {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of every month
                  </option>
                ))}
                <option value="last">Last day of month</option>
              </select>
            </div>
          )}

          {/* End Date (if not ongoing) */}
          {recurringOptions?.duration !== 'ongoing' && (
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={recurringOptions?.endDate || ''}
                onChange={(e) => handleOptionChange('endDate', e?.target?.value)}
                min={new Date()?.toISOString()?.split('T')?.[0]}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
              <p className="text-xs text-text-secondary mt-1">
                Leave empty to use the duration setting above
              </p>
            </div>
          )}

          {/* Discount Information */}
          {discount > 0 && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Percent" size={16} className="text-success" />
                <span className="font-semibold text-success">
                  {discount}% Recurring Booking Discount
                </span>
              </div>
              <p className="text-sm text-card-foreground mb-2">
                You'll save {formatPrice(estimatedSavings)} per booking with this recurring schedule!
              </p>
              <div className="text-xs text-text-secondary">
                <p>• Guaranteed booking slots</p>
                <p>• Priority customer support</p>
                <p>• Flexible rescheduling options</p>
                <p>• Cancel anytime with 24-hour notice</p>
              </div>
            </div>
          )}

          {/* Booking Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium text-card-foreground mb-3">
              Recurring Booking Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Frequency:</span>
                <span className="text-card-foreground font-medium">
                  {frequencyOptions?.find(f => f?.value === recurringOptions?.frequency)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Duration:</span>
                <span className="text-card-foreground font-medium">
                  {durationOptions?.find(d => d?.value === recurringOptions?.duration)?.label}
                </span>
              </div>
              {recurringOptions?.selectedDays?.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Days:</span>
                  <span className="text-card-foreground font-medium">
                    {recurringOptions?.selectedDays?.map(dayValue => 
                      dayOptions?.find(d => d?.value === dayValue)?.label
                    )?.join(', ')}
                  </span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount:</span>
                  <span className="font-medium">{discount}% off each booking</span>
                </div>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="text-xs text-text-secondary bg-muted/50 p-3 rounded-lg">
            <p className="font-medium mb-1">Recurring Booking Terms:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Bookings will be automatically scheduled based on your preferences</li>
              <li>You'll receive confirmation 48 hours before each appointment</li>
              <li>Reschedule or cancel individual bookings with 24-hour notice</li>
              <li>Discount applies to all bookings in the recurring schedule</li>
              <li>Cancel the entire recurring schedule anytime from your dashboard</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringBookingOptions;