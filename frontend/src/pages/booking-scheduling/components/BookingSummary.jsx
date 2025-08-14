import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingSummary = ({ 
  bookingData, 
  onConfirmBooking, 
  isLoading = false 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(price);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return new Date(time)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-success';
      case 'pending': return 'text-warning';
      case 'processing': return 'text-primary';
      default: return 'text-text-secondary';
    }
  };

  if (!bookingData) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
        <div className="text-center py-8">
          <Icon name="Calendar" size={48} className="mx-auto mb-4 text-text-secondary opacity-50" />
          <p className="text-text-secondary">Complete the booking form to see summary</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Booking Summary
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="FileText" size={16} className="text-text-secondary" />
          <span className="text-sm text-text-secondary">Review & Confirm</span>
        </div>
      </div>
      <div className="space-y-6">
        {/* Service Information */}
        <div className="pb-4 border-b border-border">
          <h4 className="font-medium text-card-foreground mb-3">Service Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">Service:</span>
              <span className="font-medium text-card-foreground">
                {bookingData?.service?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Category:</span>
              <span className="text-card-foreground">
                {bookingData?.service?.category}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Duration:</span>
              <span className="text-card-foreground">
                {bookingData?.serviceDetails?.estimatedDuration} hours
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Priority:</span>
              <span className={`capitalize ${
                bookingData?.serviceDetails?.priority === 'urgent' ? 'text-destructive' :
                bookingData?.serviceDetails?.priority === 'high'? 'text-warning' : 'text-card-foreground'
              }`}>
                {bookingData?.serviceDetails?.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="pb-4 border-b border-border">
          <h4 className="font-medium text-card-foreground mb-3">Professional</h4>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Icon name="User" size={20} color="white" />
            </div>
            <div>
              <p className="font-medium text-card-foreground">
                {bookingData?.worker?.name}
              </p>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={12} className="text-warning fill-current" />
                  <span className="text-sm text-card-foreground">
                    {bookingData?.worker?.rating}
                  </span>
                </div>
                <span className="text-text-secondary text-sm">
                  ({bookingData?.worker?.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Experience:</span>
              <span className="text-card-foreground">
                {bookingData?.worker?.experience}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Distance:</span>
              <span className="text-card-foreground">
                {bookingData?.worker?.distance}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule Information */}
        <div className="pb-4 border-b border-border">
          <h4 className="font-medium text-card-foreground mb-3">Schedule</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">Date:</span>
              <span className="font-medium text-card-foreground">
                {bookingData?.selectedDate && formatDate(bookingData?.selectedDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Time:</span>
              <span className="font-medium text-card-foreground">
                {bookingData?.selectedTime && formatTime(bookingData?.selectedTime)}
              </span>
            </div>
            {bookingData?.recurringOptions?.enabled && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Recurring:</span>
                <span className="text-card-foreground">
                  {bookingData?.recurringOptions?.frequency} for {bookingData?.recurringOptions?.duration}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Address Information */}
        <div className="pb-4 border-b border-border">
          <h4 className="font-medium text-card-foreground mb-3">Service Location</h4>
          <div className="flex items-start space-x-3">
            <Icon name="MapPin" size={16} className="text-text-secondary mt-1" />
            <div>
              <p className="font-medium text-card-foreground">
                {bookingData?.selectedAddress?.name}
              </p>
              <p className="text-sm text-text-secondary">
                {bookingData?.selectedAddress?.addressLine1}, {bookingData?.selectedAddress?.addressLine2}
              </p>
              <p className="text-sm text-text-secondary">
                {bookingData?.selectedAddress?.city}, {bookingData?.selectedAddress?.state} {bookingData?.selectedAddress?.pincode}
              </p>
              {bookingData?.selectedAddress?.landmark && (
                <p className="text-xs text-text-secondary mt-1">
                  Landmark: {bookingData?.selectedAddress?.landmark}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="pb-4 border-b border-border">
          <h4 className="font-medium text-card-foreground mb-3">Payment Method</h4>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <Icon name="CreditCard" size={16} className="text-text-secondary" />
            </div>
            <div>
              <p className="font-medium text-card-foreground">
                {bookingData?.selectedPaymentMethod?.name}
              </p>
              <p className="text-sm text-text-secondary">
                {bookingData?.selectedPaymentMethod?.details}
              </p>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="pb-4 border-b border-border">
          <h4 className="font-medium text-card-foreground mb-3">Cost Breakdown</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">Base Rate:</span>
              <span className="text-card-foreground">
                {formatPrice(bookingData?.pricing?.baseRate || 0)}
              </span>
            </div>
            {bookingData?.pricing?.surgeMultiplier > 1 && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Surge Pricing:</span>
                <span className="text-warning">
                  +{formatPrice((bookingData?.pricing?.baseRate * bookingData?.pricing?.surgeMultiplier) - bookingData?.pricing?.baseRate)}
                </span>
              </div>
            )}
            {bookingData?.pricing?.locationAdjustment > 0 && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Location Premium:</span>
                <span className="text-card-foreground">
                  +{formatPrice(bookingData?.pricing?.locationAdjustment)}
                </span>
              </div>
            )}
            {bookingData?.pricing?.experiencePremium > 0 && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Experience Premium:</span>
                <span className="text-accent">
                  +{formatPrice(bookingData?.pricing?.experiencePremium)}
                </span>
              </div>
            )}
            {bookingData?.pricing?.emergencyFee > 0 && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Emergency Fee:</span>
                <span className="text-destructive">
                  +{formatPrice(bookingData?.pricing?.emergencyFee)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-text-secondary">Platform Fee:</span>
              <span className="text-card-foreground">
                +{formatPrice(bookingData?.pricing?.platformFee || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">GST (18%):</span>
              <span className="text-card-foreground">
                +{formatPrice(bookingData?.pricing?.gst || 0)}
              </span>
            </div>
            {bookingData?.recurringOptions?.enabled && bookingData?.pricing?.discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Recurring Discount:</span>
                <span>-{formatPrice(bookingData?.pricing?.discount)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Total Amount */}
        <div className="pb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-card-foreground">
              Total Amount:
            </span>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(bookingData?.pricing?.total || 0)}
            </span>
          </div>
          {bookingData?.selectedPaymentMethod?.type === 'cash' && (
            <p className="text-sm text-text-secondary mt-1 text-right">
              Pay on service completion
            </p>
          )}
        </div>

        {/* Confirm Booking Button */}
        <Button
          variant="default"
          fullWidth
          size="lg"
          onClick={onConfirmBooking}
          loading={isLoading}
          disabled={!bookingData?.selectedDate || !bookingData?.selectedTime || !bookingData?.selectedAddress || !bookingData?.selectedPaymentMethod}
          iconName="Check"
          iconPosition="left"
        >
          {isLoading ? 'Confirming Booking...' : 'Confirm Booking'}
        </Button>

        {/* Terms and Conditions */}
        <div className="text-xs text-text-secondary bg-muted/50 p-3 rounded-lg">
          <p className="font-medium mb-1">By confirming this booking, you agree to:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>SkillNest Terms of Service and Privacy Policy</li>
            <li>The professional's service terms and conditions</li>
            <li>Cancellation policy: Free cancellation up to 2 hours before service</li>
            <li>Payment terms based on selected payment method</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;