import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import BookingProgressIndicator from './components/BookingProgressIndicator';
import ServiceConfirmationCard from './components/ServiceConfirmationCard';
import CalendarWidget from './components/CalendarWidget';
import DynamicPricingCalculator from './components/DynamicPricingCalculator';
import ServiceDetailsForm from './components/ServiceDetailsForm';
import AddressSelector from './components/AddressSelector';
import RecurringBookingOptions from './components/RecurringBookingOptions';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import BookingSummary from './components/BookingSummary';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const BookingScheduling = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmergencyBooking, setIsEmergencyBooking] = useState(false);

  // Booking state
  const [bookingData, setBookingData] = useState({
    service: null,
    worker: null,
    selectedDate: null,
    selectedTime: null,
    serviceDetails: {},
    selectedAddress: null,
    recurringOptions: { enabled: false },
    selectedPaymentMethod: null,
    pricing: {}
  });

  // Mock service and worker data
  const mockService = {
    id: 'plumbing-001',
    name: 'Plumbing Repair & Installation',
    category: 'Plumbing',
    baseRate: 500,
    description: 'Professional plumbing services including repairs, installations, and maintenance'
  };

  const mockWorker = {
    id: 'worker-123',
    name: 'Rajesh Kumar',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    reviewCount: 156,
    distance: '2.3 km',
    experience: '8 years',
    specialization: 'Residential Plumbing',
    responseTime: 'Within 30 mins',
    isVerified: true,
    experienceLevel: 'expert'
  };

  // Mock worker availability
  const mockAvailability = {
    '2025-01-15': {
      '09:00': 'available',
      '10:00': 'available',
      '11:00': 'busy',
      '14:00': 'available',
      '15:00': 'available',
      '16:00': 'blocked'
    },
    '2025-01-16': {
      '08:00': 'available',
      '09:00': 'available',
      '10:00': 'available',
      '11:00': 'available',
      '14:00': 'busy',
      '15:00': 'available'
    }
  };

  useEffect(() => {
    // Initialize with mock data or data from navigation state
    const stateData = location?.state;
    setBookingData(prev => ({
      ...prev,
      service: stateData?.service || mockService,
      worker: stateData?.worker || mockWorker
    }));
  }, [location?.state]);

  const handleDateSelect = (date) => {
    setBookingData(prev => ({
      ...prev,
      selectedDate: date,
      selectedTime: null // Reset time when date changes
    }));
  };

  const handleTimeSelect = (time) => {
    setBookingData(prev => ({
      ...prev,
      selectedTime: time
    }));
  };

  const handleServiceDetailsChange = (details) => {
    setBookingData(prev => ({
      ...prev,
      serviceDetails: details
    }));
  };

  const handlePhotosUpload = (photos) => {
    setBookingData(prev => ({
      ...prev,
      serviceDetails: {
        ...prev?.serviceDetails,
        photos
      }
    }));
  };

  const handleAddressSelect = (address) => {
    setBookingData(prev => ({
      ...prev,
      selectedAddress: address
    }));
  };

  const handleRecurringOptionsChange = (options) => {
    setBookingData(prev => ({
      ...prev,
      recurringOptions: options
    }));
  };

  const handlePaymentMethodSelect = (method) => {
    setBookingData(prev => ({
      ...prev,
      selectedPaymentMethod: method
    }));
  };

  const handleEmergencyToggle = () => {
    setIsEmergencyBooking(!isEmergencyBooking);
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    
    try {
      // Mock booking confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page or show success message
      navigate('/booking-scheduling', { 
        state: { 
          bookingConfirmed: true, 
          bookingId: 'BK' + Date.now(),
          bookingData 
        } 
      });
    } catch (error) {
      console.error('Booking confirmation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return bookingData?.selectedDate && bookingData?.selectedTime;
      case 2:
        return bookingData?.serviceDetails?.description && 
               bookingData?.serviceDetails?.estimatedDuration;
      case 3:
        return bookingData?.selectedAddress;
      case 4:
        return bookingData?.selectedPaymentMethod;
      default:
        return true;
    }
  };

  // Show success message if booking was confirmed
  if (location?.state?.bookingConfirmed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Check" size={40} color="white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-text-secondary mb-6">
              Your booking has been successfully confirmed. You'll receive a confirmation email shortly.
            </p>
            <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-auto mb-8">
              <h3 className="font-semibold text-card-foreground mb-4">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Booking ID:</span>
                  <span className="font-medium text-card-foreground">
                    {location?.state?.bookingId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Service:</span>
                  <span className="font-medium text-card-foreground">
                    {location?.state?.bookingData?.service?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Professional:</span>
                  <span className="font-medium text-card-foreground">
                    {location?.state?.bookingData?.worker?.name}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-x-4">
              <Button
                variant="default"
                onClick={() => navigate('/service-discovery-search')}
              >
                Book Another Service
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-foreground">
              Book Your Service
            </h1>
            
            {/* Emergency Booking Toggle */}
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEmergencyBooking}
                  onChange={handleEmergencyToggle}
                  className="rounded border-border text-destructive focus:ring-destructive"
                />
                <span className="text-sm font-medium text-foreground">
                  Emergency Booking
                </span>
              </label>
              {isEmergencyBooking && (
                <div className="flex items-center space-x-1 text-destructive">
                  <Icon name="AlertTriangle" size={16} />
                  <span className="text-sm font-medium">Urgent</span>
                </div>
              )}
            </div>
          </div>
          
          <BookingProgressIndicator currentStep={currentStep} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Confirmation */}
            {bookingData?.service && bookingData?.worker && (
              <ServiceConfirmationCard 
                service={bookingData?.service} 
                worker={bookingData?.worker} 
              />
            )}

            {/* Step Content */}
            {currentStep === 1 && (
              <CalendarWidget
                selectedDate={bookingData?.selectedDate}
                onDateSelect={handleDateSelect}
                selectedTime={bookingData?.selectedTime}
                onTimeSelect={handleTimeSelect}
                workerAvailability={mockAvailability}
                isEmergencyBooking={isEmergencyBooking}
              />
            )}

            {currentStep === 2 && (
              <ServiceDetailsForm
                serviceDetails={bookingData?.serviceDetails}
                onServiceDetailsChange={handleServiceDetailsChange}
                onPhotosUpload={handlePhotosUpload}
              />
            )}

            {currentStep === 3 && (
              <AddressSelector
                selectedAddress={bookingData?.selectedAddress}
                onAddressSelect={handleAddressSelect}
              />
            )}

            {currentStep === 4 && (
              <>
                <RecurringBookingOptions
                  recurringOptions={bookingData?.recurringOptions}
                  onRecurringOptionsChange={handleRecurringOptionsChange}
                />
                <PaymentMethodSelector
                  selectedPaymentMethod={bookingData?.selectedPaymentMethod}
                  onPaymentMethodSelect={handlePaymentMethodSelect}
                  totalAmount={bookingData?.pricing?.total || 0}
                />
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStep === 1}
                iconName="ChevronLeft"
                iconPosition="left"
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  variant="default"
                  onClick={handleNextStep}
                  disabled={!canProceedToNextStep()}
                  iconName="ChevronRight"
                  iconPosition="right"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => setCurrentStep(5)}
                  disabled={!canProceedToNextStep()}
                  iconName="FileText"
                  iconPosition="left"
                >
                  Review Booking
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Calculator */}
            {bookingData?.selectedDate && bookingData?.selectedTime && (
              <DynamicPricingCalculator
                baseRate={bookingData?.service?.baseRate || 500}
                selectedDate={bookingData?.selectedDate}
                selectedTime={bookingData?.selectedTime}
                duration={parseFloat(bookingData?.serviceDetails?.estimatedDuration) || 1}
                location={bookingData?.selectedAddress?.city?.toLowerCase()?.replace(' ', '-') || ''}
                isEmergencyBooking={isEmergencyBooking}
                workerExperienceLevel={bookingData?.worker?.experienceLevel || 'intermediate'}
              />
            )}

            {/* Booking Summary */}
            {currentStep === 5 && (
              <BookingSummary
                bookingData={bookingData}
                onConfirmBooking={handleConfirmBooking}
                isLoading={isLoading}
              />
            )}

            {/* Help & Support */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
              <h3 className="font-semibold text-card-foreground mb-4">
                Need Help?
              </h3>
              <div className="space-y-3">
                <button className="flex items-center space-x-3 w-full text-left p-3 rounded-lg hover:bg-muted transition-smooth">
                  <Icon name="MessageCircle" size={20} className="text-primary" />
                  <div>
                    <p className="font-medium text-card-foreground">Live Chat</p>
                    <p className="text-sm text-text-secondary">Get instant help</p>
                  </div>
                </button>
                
                <button className="flex items-center space-x-3 w-full text-left p-3 rounded-lg hover:bg-muted transition-smooth">
                  <Icon name="Phone" size={20} className="text-primary" />
                  <div>
                    <p className="font-medium text-card-foreground">Call Support</p>
                    <p className="text-sm text-text-secondary">1800-123-4567</p>
                  </div>
                </button>
                
                <button className="flex items-center space-x-3 w-full text-left p-3 rounded-lg hover:bg-muted transition-smooth">
                  <Icon name="HelpCircle" size={20} className="text-primary" />
                  <div>
                    <p className="font-medium text-card-foreground">FAQ</p>
                    <p className="text-sm text-text-secondary">Common questions</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingScheduling;