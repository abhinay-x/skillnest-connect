import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';


const AvailabilityCalendar = ({ selectedTool, onDateSelect, selectedDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

  const isDateAvailable = (date) => {
    if (!date || !selectedTool) return false;
    
    const today = new Date();
    today?.setHours(0, 0, 0, 0);
    
    if (date < today) return false;
    
    // Mock unavailable dates (maintenance, already booked)
    const unavailableDates = selectedTool?.unavailableDates || [];
    const dateString = date?.toISOString()?.split('T')?.[0];
    
    return !unavailableDates?.includes(dateString);
  };

  const isDateSelected = (date) => {
    if (!date) return false;
    const dateString = date?.toISOString()?.split('T')?.[0];
    return selectedDates?.includes(dateString);
  };

  const isDateMaintenance = (date) => {
    if (!date || !selectedTool) return false;
    const maintenanceDates = selectedTool?.maintenanceDates || [];
    const dateString = date?.toISOString()?.split('T')?.[0];
    return maintenanceDates?.includes(dateString);
  };

  const handleDateClick = (date) => {
    if (!isDateAvailable(date)) return;
    
    const dateString = date?.toISOString()?.split('T')?.[0];
    onDateSelect(dateString);
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth?.setMonth(currentMonth?.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const days = getDaysInMonth(currentMonth);

  if (!selectedTool) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-elevation-1">
        <div className="text-center text-text-secondary">
          <Icon name="Calendar" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select a tool to view availability</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Availability Calendar</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(-1)}
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <span className="font-medium text-text-primary min-w-[140px] text-center">
            {months?.[currentMonth?.getMonth()]} {currentMonth?.getFullYear()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(1)}
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {daysOfWeek?.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-text-secondary">
            {day}
          </div>
        ))}
        
        {days?.map((date, index) => (
          <div key={index} className="aspect-square">
            {date && (
              <button
                onClick={() => handleDateClick(date)}
                disabled={!isDateAvailable(date)}
                className={`w-full h-full rounded-md text-sm font-medium transition-smooth ${
                  isDateSelected(date)
                    ? 'bg-primary text-primary-foreground'
                    : isDateMaintenance(date)
                    ? 'bg-warning/10 text-warning cursor-not-allowed'
                    : !isDateAvailable(date)
                    ? 'bg-muted text-text-secondary cursor-not-allowed' :'hover:bg-muted text-text-primary'
                }`}
              >
                {date?.getDate()}
              </button>
            )}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span className="text-text-secondary">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-muted rounded"></div>
          <span className="text-text-secondary">Unavailable</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-warning/20 rounded"></div>
          <span className="text-text-secondary">Maintenance</span>
        </div>
      </div>
      {/* Tool Info */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden">
            <Image
              src={selectedTool?.image}
              alt={selectedTool?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-medium text-text-primary">{selectedTool?.name}</h4>
            <p className="text-sm text-text-secondary">{selectedTool?.location}</p>
          </div>
        </div>
        
        <div className="text-sm text-text-secondary">
          <p className="mb-1">Security deposit: ₹{selectedTool?.securityDeposit?.toLocaleString('en-IN')}</p>
          <p>Pickup available from 9:00 AM - 6:00 PM</p>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;