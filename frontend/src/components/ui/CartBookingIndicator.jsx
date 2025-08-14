import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const CartBookingIndicator = ({ 
  cartItems = [], 
  bookings = [], 
  showPreview = true 
}) => {
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showBookingPreview, setShowBookingPreview] = useState(false);
  const navigate = useNavigate();

  const cartCount = cartItems?.length;
  const bookingCount = bookings?.length;
  const cartTotal = cartItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);

  const handleCartClick = () => {
    if (showPreview && cartCount > 0) {
      setShowCartPreview(!showCartPreview);
    } else {
      navigate('/e-commerce-marketplace');
    }
  };

  const handleBookingClick = () => {
    if (showPreview && bookingCount > 0) {
      setShowBookingPreview(!showBookingPreview);
    } else {
      navigate('/booking-scheduling');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Cart Indicator */}
      <div className="relative">
        <button
          onClick={handleCartClick}
          className="relative p-2 text-text-secondary hover:text-text-primary transition-smooth rounded-md hover:bg-muted"
          aria-label={`Shopping cart with ${cartCount} items`}
        >
          <Icon name="ShoppingCart" size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </button>

        {/* Cart Preview */}
        {showCartPreview && cartCount > 0 && (
          <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevation-3 z-200 animate-fade-in">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-popover-foreground">Shopping Cart</h3>
                <button
                  onClick={() => setShowCartPreview(false)}
                  className="text-text-secondary hover:text-text-primary transition-smooth"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {cartItems?.slice(0, 3)?.map((item, index) => (
                <div key={index} className="p-4 border-b border-border last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                      <Icon name="Package" size={20} className="text-text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-popover-foreground truncate">
                        {item?.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        Qty: {item?.quantity} × {formatPrice(item?.price)}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-popover-foreground">
                      {formatPrice(item?.price * item?.quantity)}
                    </div>
                  </div>
                </div>
              ))}
              
              {cartItems?.length > 3 && (
                <div className="p-4 text-center text-sm text-text-secondary">
                  +{cartItems?.length - 3} more items
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-popover-foreground">Total:</span>
                <span className="font-semibold text-popover-foreground">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <Button 
                variant="default" 
                fullWidth 
                onClick={() => navigate('/e-commerce-marketplace')}
              >
                View Cart
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Booking Indicator */}
      <div className="relative">
        <button
          onClick={handleBookingClick}
          className="relative p-2 text-text-secondary hover:text-text-primary transition-smooth rounded-md hover:bg-muted"
          aria-label={`Bookings with ${bookingCount} appointments`}
        >
          <Icon name="Calendar" size={20} />
          {bookingCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-success text-success-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {bookingCount > 99 ? '99+' : bookingCount}
            </span>
          )}
        </button>

        {/* Booking Preview */}
        {showBookingPreview && bookingCount > 0 && (
          <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevation-3 z-200 animate-fade-in">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-popover-foreground">Upcoming Bookings</h3>
                <button
                  onClick={() => setShowBookingPreview(false)}
                  className="text-text-secondary hover:text-text-primary transition-smooth"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {bookings?.slice(0, 3)?.map((booking, index) => (
                <div key={index} className="p-4 border-b border-border last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-success/10 rounded-md flex items-center justify-center">
                      <Icon name="Calendar" size={16} className="text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-popover-foreground truncate">
                        {booking?.serviceName}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {booking?.providerName}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {formatDate(booking?.dateTime)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking?.status === 'confirmed' ?'bg-success/10 text-success' 
                          : booking?.status === 'pending' ?'bg-warning/10 text-warning' :'bg-muted text-text-secondary'
                      }`}>
                        {booking?.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {bookings?.length > 3 && (
                <div className="p-4 text-center text-sm text-text-secondary">
                  +{bookings?.length - 3} more bookings
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-border">
              <Button 
                variant="default" 
                fullWidth 
                onClick={() => navigate('/booking-scheduling')}
              >
                View All Bookings
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartBookingIndicator;