import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarWidget = ({ 
  selectedDate, 
  onDateSelect, 
  selectedTime, 
  onTimeSelect,
  workerAvailability = {},
  isEmergencyBooking = false 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timeSlotDuration, setTimeSlotDuration] = useState(60); // 30, 60, 120 minutes
  
  const today = new Date();
  const maxDate = new Date();
  maxDate?.setDate(today?.getDate() + 30);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 20; // 8 PM
    
    for (let hour = startHour; hour < endHour; hour += timeSlotDuration / 60) {
      const time = new Date();
      time?.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
      slots?.push(time);
    }
    return slots;
  };

  const getSlotStatus = (date, time) => {
    const dateKey = date?.toISOString()?.split('T')?.[0];
    const timeKey = time?.toTimeString()?.slice(0, 5);
    
    if (workerAvailability?.[dateKey] && workerAvailability?.[dateKey]?.[timeKey]) {
      return workerAvailability?.[dateKey]?.[timeKey];
    }
    
    // Default availability logic
    const now = new Date();
    const slotDateTime = new Date(date);
    slotDateTime?.setHours(time?.getHours(), time?.getMinutes());
    
    if (slotDateTime < now) return 'past';
    if (Math.random() > 0.7) return 'busy';
    if (Math.random() > 0.9) return 'blocked';
    return 'available';
  };

  const getSlotClasses = (status) => {
    switch (status) {
      case 'available':
        return 'bg-success/10 text-success border-success/20 hover:bg-success/20';
      case 'busy':
        return 'bg-destructive/10 text-destructive border-destructive/20 cursor-not-allowed';
      case 'blocked':
        return 'bg-muted text-muted-foreground border-border cursor-not-allowed';
      case 'past':
        return 'bg-muted/50 text-muted-foreground border-border cursor-not-allowed opacity-50';
      default:
        return 'bg-card text-card-foreground border-border hover:bg-muted';
    }
  };

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateSelectable = (date) => {
    if (!date) return false;
    return date >= today && date <= maxDate;
  };

  const isDateSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date?.toDateString() === selectedDate?.toDateString();
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth?.setMonth(currentMonth?.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const formatTime = (time) => {
    return time?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Select Date & Time
        </h3>
        
        {/* Time Slot Duration Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">Duration:</span>
          <select
            value={timeSlotDuration}
            onChange={(e) => setTimeSlotDuration(Number(e?.target?.value))}
            className="text-sm border border-border rounded px-2 py-1 bg-input text-foreground"
          >
            <option value={30}>30 min</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
          </select>
        </div>
      </div>
      {/* Emergency Booking Toggle */}
      {isEmergencyBooking && (
        <div className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">
              Emergency Booking - Available slots within 2 hours
            </span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(-1)}
              disabled={currentMonth?.getMonth() === today?.getMonth() && 
                       currentMonth?.getFullYear() === today?.getFullYear()}
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            
            <h4 className="font-semibold text-card-foreground">
              {monthNames?.[currentMonth?.getMonth()]} {currentMonth?.getFullYear()}
            </h4>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(1)}
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek?.map(day => (
              <div key={day} className="text-center text-xs font-medium text-text-secondary p-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth)?.map((date, index) => (
              <button
                key={index}
                onClick={() => date && isDateSelectable(date) && onDateSelect(date)}
                disabled={!date || !isDateSelectable(date)}
                className={`
                  aspect-square p-2 text-sm rounded-md transition-smooth
                  ${!date ? 'invisible' : ''}
                  ${!isDateSelectable(date) ? 
                    'text-muted-foreground cursor-not-allowed' : 
                    'hover:bg-muted cursor-pointer'}
                  ${isDateSelected(date) ? 
                    'bg-primary text-primary-foreground' : 
                    'text-card-foreground'}
                `}
              >
                {date?.getDate()}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <h4 className="font-semibold text-card-foreground mb-4">
            Available Times
            {selectedDate && (
              <span className="text-sm font-normal text-text-secondary ml-2">
                for {selectedDate?.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            )}
          </h4>

          {selectedDate ? (
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {timeSlots?.map((time, index) => {
                const status = getSlotStatus(selectedDate, time);
                const isSelected = selectedTime && 
                  selectedTime?.getHours() === time?.getHours() && 
                  selectedTime?.getMinutes() === time?.getMinutes();

                return (
                  <button
                    key={index}
                    onClick={() => status === 'available' && onTimeSelect(time)}
                    disabled={status !== 'available'}
                    className={`
                      p-2 text-xs rounded-md border transition-smooth
                      ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 
                        getSlotClasses(status)}
                    `}
                  >
                    {formatTime(time)}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-text-secondary">
              <div className="text-center">
                <Icon name="Calendar" size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a date to view available times</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-6 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-success/20 border border-success/20 rounded"></div>
            <span className="text-text-secondary">Available</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-destructive/20 border border-destructive/20 rounded"></div>
            <span className="text-text-secondary">Busy</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-muted border border-border rounded"></div>
            <span className="text-text-secondary">Blocked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;