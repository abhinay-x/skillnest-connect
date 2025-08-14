import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AvailabilityCalendar = ({ worker, onTimeSlotSelect, onBookNow }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getWeekDates = (startDate) => {
    const dates = [];
    const start = new Date(startDate);
    start?.setDate(start?.getDate() - start?.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date?.setDate(start?.getDate() + i);
      dates?.push(date);
    }
    return dates;
  };

  const getAvailableSlots = (date) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    const daySchedule = worker?.availability?.find(day => day?.date === dateStr);
    return daySchedule ? daySchedule?.slots : [];
  };

  const isSlotAvailable = (slot) => {
    return slot?.status === 'available';
  };

  const getSlotStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-success/10 text-success border-success/20 hover:bg-success/20';
      case 'booked':
        return 'bg-error/10 text-error border-error/20 cursor-not-allowed';
      case 'busy':
        return 'bg-warning/10 text-warning border-warning/20 cursor-not-allowed';
      default:
        return 'bg-muted text-muted-foreground border-border cursor-not-allowed';
    }
  };

  const weekDates = getWeekDates(selectedDate);
  const today = new Date();
  today?.setHours(0, 0, 0, 0);

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate?.setDate(selectedDate?.getDate() + (direction * 7));
    setSelectedDate(newDate);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotClick = (date, slot) => {
    if (isSlotAvailable(slot)) {
      const selectedSlot = { date, slot };
      setSelectedTimeSlot(selectedSlot);
      onTimeSlotSelect && onTimeSlotSelect(selectedSlot);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Availability Calendar</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 hover:bg-muted rounded-md transition-smooth"
          >
            <Icon name="ChevronLeft" size={16} className="text-text-secondary" />
          </button>
          <span className="text-sm font-medium text-card-foreground px-3">
            {selectedDate?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => navigateWeek(1)}
            className="p-2 hover:bg-muted rounded-md transition-smooth"
          >
            <Icon name="ChevronRight" size={16} className="text-text-secondary" />
          </button>
        </div>
      </div>
      {/* Week View */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekDates?.map((date, index) => {
          const isToday = date?.toDateString() === today?.toDateString();
          const isPast = date < today;
          const availableSlots = getAvailableSlots(date);
          const hasAvailableSlots = availableSlots?.some(slot => isSlotAvailable(slot));

          return (
            <div
              key={index}
              className={`text-center p-3 rounded-lg border transition-smooth ${
                isPast
                  ? 'bg-muted/50 text-muted-foreground border-border cursor-not-allowed'
                  : hasAvailableSlots
                  ? 'bg-success/5 border-success/20 hover:bg-success/10 cursor-pointer' :'bg-muted border-border'
              } ${isToday ? 'ring-2 ring-primary' : ''}`}
              onClick={() => !isPast && setSelectedDate(date)}
            >
              <div className="text-xs text-text-secondary mb-1">
                {date?.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`text-lg font-semibold ${isToday ? 'text-primary' : 'text-card-foreground'}`}>
                {date?.getDate()}
              </div>
              <div className="text-xs mt-1">
                {isPast ? (
                  <span className="text-muted-foreground">Past</span>
                ) : hasAvailableSlots ? (
                  <span className="text-success">{availableSlots?.filter(slot => isSlotAvailable(slot))?.length} slots</span>
                ) : (
                  <span className="text-error">Busy</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Time Slots */}
      <div className="space-y-4">
        <h4 className="font-medium text-card-foreground">
          Available Time Slots - {formatDate(selectedDate)}
        </h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {getAvailableSlots(selectedDate)?.map((slot, index) => (
            <button
              key={index}
              onClick={() => handleTimeSlotClick(selectedDate, slot)}
              disabled={!isSlotAvailable(slot)}
              className={`p-3 rounded-lg border text-sm font-medium transition-smooth ${
                getSlotStatusColor(slot?.status)
              } ${
                selectedTimeSlot?.slot?.startTime === slot?.startTime &&
                selectedTimeSlot?.date?.toDateString() === selectedDate?.toDateString()
                  ? 'ring-2 ring-primary' :''
              }`}
            >
              <div>{formatTime(slot?.startTime)}</div>
              <div className="text-xs opacity-75">
                {slot?.duration}
              </div>
            </button>
          ))}
        </div>

        {getAvailableSlots(selectedDate)?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-text-secondary">No available slots for this date</p>
            <p className="text-sm text-text-secondary">Try selecting a different date</p>
          </div>
        )}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success/20 border border-success/40 rounded"></div>
          <span className="text-xs text-text-secondary">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-error/20 border border-error/40 rounded"></div>
          <span className="text-xs text-text-secondary">Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-warning/20 border border-warning/40 rounded"></div>
          <span className="text-xs text-text-secondary">Busy</span>
        </div>
      </div>
      {/* Book Selected Slot */}
      {selectedTimeSlot && (
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-card-foreground">Selected Time Slot</p>
              <p className="text-sm text-text-secondary">
                {formatDate(selectedTimeSlot?.date)} at {formatTime(selectedTimeSlot?.slot?.startTime)}
              </p>
            </div>
            <Button
              variant="default"
              onClick={() => onBookNow(selectedTimeSlot)}
              iconName="Calendar"
              iconPosition="left"
            >
              Book Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;