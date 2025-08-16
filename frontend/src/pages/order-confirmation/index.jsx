import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const OrderConfirmation = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const orderData = location.state;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Redirect if no order data
  useEffect(() => {
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const isMarketplace = orderData.orderType === 'marketplace';
  const isRental = orderData.orderType === 'rental';

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="CheckCircle" size={40} className="text-success-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            {isRental ? 'Rental Confirmed!' : 'Order Confirmed!'}
          </h1>
          <p className="text-lg text-text-secondary mb-2">
            Thank you for your {isRental ? 'rental booking' : 'order'}! We've received your request and will process it shortly.
          </p>
          <div className="inline-flex items-center space-x-2 bg-muted px-4 py-2 rounded-lg">
            <Icon name="Hash" size={16} className="text-text-secondary" />
            <span className="font-mono text-sm font-medium text-text-primary">
              {orderData.orderType?.toUpperCase()} ID: {orderData.orderId}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                <Icon name="Package" size={20} className="mr-2" />
                {isRental ? 'Rental Items' : 'Order Items'}
              </h2>
              
              <div className="space-y-4">
                {orderData.items?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                    <div className="w-16 h-16 bg-background rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-text-primary mb-1">{item.name}</h3>
                      <p className="text-sm text-text-secondary">
                        Quantity: {item.quantity}
                        {isRental && (
                          <span className="ml-4">
                            Rate: {formatPrice(item.pricePerDay || item.price)}/day
                          </span>
                        )}
                      </p>
                      {isRental && orderData.rentalPeriod && (
                        <p className="text-sm text-text-secondary">
                          Duration: {orderData.rentalPeriod.duration} day{orderData.rentalPeriod.duration > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-text-primary">
                        {isRental 
                          ? formatPrice((item.pricePerDay || item.price) * item.quantity * (orderData.rentalPeriod?.duration || 1))
                          : formatPrice(item.price * item.quantity)
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rental Period (for rentals) */}
            {isRental && orderData.rentalPeriod && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                  <Icon name="Calendar" size={20} className="mr-2" />
                  Rental Period
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-text-primary mb-2">Pickup</h3>
                    <p className="text-text-secondary">
                      {formatDate(orderData.rentalPeriod.startDate)} at {formatTime(orderData.rentalPeriod.pickupTime)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary mb-2">Return</h3>
                    <p className="text-text-secondary">
                      {formatDate(orderData.rentalPeriod.endDate)} at {formatTime(orderData.rentalPeriod.returnTime)}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-sm text-warning-foreground">
                    <Icon name="AlertTriangle" size={16} className="inline mr-2" />
                    Please ensure items are returned on time to avoid additional charges.
                  </p>
                </div>
              </div>
            )}

            {/* Delivery/Pickup Information */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                <Icon name="MapPin" size={20} className="mr-2" />
                {isRental ? 'Pickup/Delivery Information' : 'Delivery Information'}
              </h2>
              
              {isRental && orderData.pickupOption === 'pickup' ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-success">
                    <Icon name="MapPin" size={16} />
                    <span className="font-medium">Store Pickup</span>
                  </div>
                  <p className="text-text-secondary">
                    Please visit our store to collect your rental items during the scheduled pickup time.
                  </p>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-text-primary font-medium">Store Address:</p>
                    <p className="text-sm text-text-secondary">
                      SkillNest Store<br />
                      123 Main Street, Tech Park<br />
                      Bangalore, Karnataka 560001<br />
                      Phone: +91 98765 43210
                    </p>
                  </div>
                </div>
              ) : (
                orderData.deliveryAddress && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-primary">
                      <Icon name="Truck" size={16} />
                      <span className="font-medium">
                        {isRental ? 'Home Delivery & Pickup' : 'Home Delivery'}
                      </span>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-text-primary font-medium">{orderData.deliveryAddress.fullName}</p>
                      <p className="text-sm text-text-secondary">
                        {orderData.deliveryAddress.addressLine1}
                        {orderData.deliveryAddress.addressLine2 && <>, {orderData.deliveryAddress.addressLine2}</>}
                        <br />
                        {orderData.deliveryAddress.city}, {orderData.deliveryAddress.state} {orderData.deliveryAddress.pincode}
                        <br />
                        Phone: {orderData.deliveryAddress.phone}
                        <br />
                        Email: {orderData.deliveryAddress.email}
                      </p>
                    </div>
                    {isMarketplace && (
                      <p className="text-sm text-text-secondary">
                        <Icon name="Clock" size={14} className="inline mr-1" />
                        Estimated delivery: {orderData.estimatedDelivery}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Security Deposit (for rentals) */}
            {isRental && orderData.securityDeposit && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                  <Icon name="Shield" size={20} className="mr-2" />
                  Security Deposit
                </h2>
                
                <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-warning-foreground">Security Deposit Amount</span>
                    <span className="font-bold text-warning-foreground">{formatPrice(orderData.securityDeposit)}</span>
                  </div>
                  <p className="text-sm text-warning-foreground">
                    This amount will be held as security and refunded after successful return of rental items in good condition.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                {isRental ? 'Rental Summary' : 'Order Summary'}
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">
                    {isRental ? 'Rental Amount' : 'Subtotal'}
                  </span>
                  <span className="text-text-primary">{formatPrice(orderData.total)}</span>
                </div>
                
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-text-primary">Total Paid</span>
                    <span className="text-text-primary">{formatPrice(orderData.total)}</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-4">
                <h3 className="font-medium text-text-primary">What's Next?</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      1
                    </div>
                    <p className="text-text-secondary">
                      {isRental 
                        ? 'We\'ll contact you to confirm pickup/delivery details'
                        : 'We\'ll process your order and prepare it for shipment'
                      }
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      2
                    </div>
                    <p className="text-text-secondary">
                      {isRental 
                        ? 'Collect/receive your rental items on the scheduled date'
                        : 'Track your order status via email updates'
                      }
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      3
                    </div>
                    <p className="text-text-secondary">
                      {isRental 
                        ? 'Return items on time to get your security deposit back'
                        : 'Receive your order and enjoy your purchase!'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mt-8">
                <Button
                  variant="default"
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/booking-scheduling')}
                >
                  <Icon name="Calendar" size={16} className="mr-2" />
                  View My {isRental ? 'Rentals' : 'Orders'}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => navigate(isRental ? '/tool-rental' : '/marketplace')}
                >
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Continue {isRental ? 'Renting' : 'Shopping'}
                </Button>
              </div>

              {/* Support */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-text-secondary text-center mb-3">
                  Need help with your {isRental ? 'rental' : 'order'}?
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={() => navigate('/support')}
                >
                  <Icon name="MessageCircle" size={16} className="mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;
