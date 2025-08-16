import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const MarketplaceCheckout = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get cart items from location state or default
  const [cartItems] = useState(location.state?.cartItems || []);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Checkout form data
  const [checkoutData, setCheckoutData] = useState({
    // Delivery Information
    deliveryAddress: {
      fullName: userProfile?.displayName || userProfile?.profile?.firstName || '',
      phone: userProfile?.phoneNumber || '',
      email: userProfile?.email || '',
      addressLine1: userProfile?.profile?.address || '',
      addressLine2: '',
      city: userProfile?.profile?.city || '',
      state: userProfile?.profile?.state || '',
      pincode: userProfile?.profile?.pincode || '',
      landmark: ''
    },
    // Payment Information
    paymentMethod: 'cod', // cod, card, upi, wallet
    // Delivery Options
    deliveryOption: 'standard', // standard, express, scheduled
    scheduledDate: '',
    scheduledTime: '',
    // Additional Options
    giftWrap: false,
    specialInstructions: ''
  });

  const [errors, setErrors] = useState({});

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.18; // 18% GST
  };

  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal();
    if (subtotal > 1000) return 0; // Free delivery above ₹1000
    return checkoutData.deliveryOption === 'express' ? 150 : 50;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const delivery = calculateDeliveryFee();
    const giftWrap = checkoutData.giftWrap ? 50 : 0;
    return subtotal + tax + delivery + giftWrap;
  };

  const handleInputChange = (section, field, value) => {
    setCheckoutData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({ ...prev, [`${section}.${field}`]: '' }));
    }
  };

  const handleDirectInputChange = (field, value) => {
    setCheckoutData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate delivery address
    const required = ['fullName', 'phone', 'email', 'addressLine1', 'city', 'state', 'pincode'];
    required.forEach(field => {
      if (!checkoutData.deliveryAddress[field]?.trim()) {
        newErrors[`deliveryAddress.${field}`] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
      }
    });

    // Validate email format
    if (checkoutData.deliveryAddress.email && !/\S+@\S+\.\S+/.test(checkoutData.deliveryAddress.email)) {
      newErrors['deliveryAddress.email'] = 'Please enter a valid email';
    }

    // Validate phone format
    if (checkoutData.deliveryAddress.phone && !/^[6-9]\d{9}$/.test(checkoutData.deliveryAddress.phone)) {
      newErrors['deliveryAddress.phone'] = 'Please enter a valid 10-digit phone number';
    }

    // Validate scheduled delivery
    if (checkoutData.deliveryOption === 'scheduled') {
      if (!checkoutData.scheduledDate) {
        newErrors['scheduledDate'] = 'Please select a delivery date';
      }
      if (!checkoutData.scheduledTime) {
        newErrors['scheduledTime'] = 'Please select a delivery time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      // Mock order processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Navigate to order confirmation
      navigate('/order-confirmation', {
        state: {
          orderType: 'marketplace',
          orderId: `MP${Date.now()}`,
          items: cartItems,
          total: calculateTotal(),
          deliveryAddress: checkoutData.deliveryAddress,
          estimatedDelivery: checkoutData.deliveryOption === 'express' ? '1-2 days' : '3-5 days'
        }
      });
    } catch (error) {
      console.error('Order processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Redirect if no items
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/marketplace');
    }
  }, [cartItems, navigate]);

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const deliveryFee = calculateDeliveryFee();
  const giftWrapFee = checkoutData.giftWrap ? 50 : 0;
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb />
        
        <div className="mt-6">
          <h1 className="text-3xl font-bold text-text-primary mb-8">Marketplace Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Address */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                  <Icon name="MapPin" size={20} className="mr-2" />
                  Delivery Address
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={checkoutData.deliveryAddress.fullName}
                    onChange={(e) => handleInputChange('deliveryAddress', 'fullName', e.target.value)}
                    error={errors['deliveryAddress.fullName']}
                    required
                  />
                  <Input
                    label="Phone Number"
                    value={checkoutData.deliveryAddress.phone}
                    onChange={(e) => handleInputChange('deliveryAddress', 'phone', e.target.value)}
                    error={errors['deliveryAddress.phone']}
                    required
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Email Address"
                      type="email"
                      value={checkoutData.deliveryAddress.email}
                      onChange={(e) => handleInputChange('deliveryAddress', 'email', e.target.value)}
                      error={errors['deliveryAddress.email']}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Address Line 1"
                      value={checkoutData.deliveryAddress.addressLine1}
                      onChange={(e) => handleInputChange('deliveryAddress', 'addressLine1', e.target.value)}
                      error={errors['deliveryAddress.addressLine1']}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Address Line 2 (Optional)"
                      value={checkoutData.deliveryAddress.addressLine2}
                      onChange={(e) => handleInputChange('deliveryAddress', 'addressLine2', e.target.value)}
                    />
                  </div>
                  <Input
                    label="City"
                    value={checkoutData.deliveryAddress.city}
                    onChange={(e) => handleInputChange('deliveryAddress', 'city', e.target.value)}
                    error={errors['deliveryAddress.city']}
                    required
                  />
                  <Input
                    label="State"
                    value={checkoutData.deliveryAddress.state}
                    onChange={(e) => handleInputChange('deliveryAddress', 'state', e.target.value)}
                    error={errors['deliveryAddress.state']}
                    required
                  />
                  <Input
                    label="Pincode"
                    value={checkoutData.deliveryAddress.pincode}
                    onChange={(e) => handleInputChange('deliveryAddress', 'pincode', e.target.value)}
                    error={errors['deliveryAddress.pincode']}
                    required
                  />
                  <Input
                    label="Landmark (Optional)"
                    value={checkoutData.deliveryAddress.landmark}
                    onChange={(e) => handleInputChange('deliveryAddress', 'landmark', e.target.value)}
                  />
                </div>
              </div>

              {/* Delivery Options */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                  <Icon name="Truck" size={20} className="mr-2" />
                  Delivery Options
                </h2>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="standard"
                      checked={checkoutData.deliveryOption === 'standard'}
                      onChange={(e) => handleDirectInputChange('deliveryOption', e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">Standard Delivery (3-5 days)</div>
                      <div className="text-sm text-text-secondary">₹50 delivery fee (Free above ₹1000)</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="express"
                      checked={checkoutData.deliveryOption === 'express'}
                      onChange={(e) => handleDirectInputChange('deliveryOption', e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">Express Delivery (1-2 days)</div>
                      <div className="text-sm text-text-secondary">₹150 delivery fee</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="scheduled"
                      checked={checkoutData.deliveryOption === 'scheduled'}
                      onChange={(e) => handleDirectInputChange('deliveryOption', e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">Scheduled Delivery</div>
                      <div className="text-sm text-text-secondary">Choose your preferred date and time</div>
                    </div>
                  </label>
                  
                  {checkoutData.deliveryOption === 'scheduled' && (
                    <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Input
                        label="Preferred Date"
                        type="date"
                        value={checkoutData.scheduledDate}
                        onChange={(e) => handleDirectInputChange('scheduledDate', e.target.value)}
                        error={errors.scheduledDate}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Preferred Time
                        </label>
                        <select
                          value={checkoutData.scheduledTime}
                          onChange={(e) => handleDirectInputChange('scheduledTime', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Select time slot</option>
                          <option value="9-12">9:00 AM - 12:00 PM</option>
                          <option value="12-15">12:00 PM - 3:00 PM</option>
                          <option value="15-18">3:00 PM - 6:00 PM</option>
                          <option value="18-21">6:00 PM - 9:00 PM</option>
                        </select>
                        {errors.scheduledTime && (
                          <p className="mt-1 text-sm text-destructive">{errors.scheduledTime}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                  <Icon name="CreditCard" size={20} className="mr-2" />
                  Payment Method
                </h2>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={checkoutData.paymentMethod === 'cod'}
                      onChange={(e) => handleDirectInputChange('paymentMethod', e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex items-center space-x-2">
                      <Icon name="Banknote" size={20} />
                      <span className="font-medium text-text-primary">Cash on Delivery</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={checkoutData.paymentMethod === 'card'}
                      onChange={(e) => handleDirectInputChange('paymentMethod', e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex items-center space-x-2">
                      <Icon name="CreditCard" size={20} />
                      <span className="font-medium text-text-primary">Credit/Debit Card</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={checkoutData.paymentMethod === 'upi'}
                      onChange={(e) => handleDirectInputChange('paymentMethod', e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex items-center space-x-2">
                      <Icon name="Smartphone" size={20} />
                      <span className="font-medium text-text-primary">UPI Payment</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Additional Options */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-6">Additional Options</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkoutData.giftWrap}
                      onChange={(e) => handleDirectInputChange('giftWrap', e.target.checked)}
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">Gift Wrap (+₹50)</div>
                      <div className="text-sm text-text-secondary">Beautiful gift wrapping for your order</div>
                    </div>
                  </label>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      value={checkoutData.specialInstructions}
                      onChange={(e) => handleDirectInputChange('specialInstructions', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Any special delivery instructions..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-text-primary mb-6">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-sm text-text-secondary">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="text-text-primary">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">GST (18%)</span>
                    <span className="text-text-primary">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Delivery Fee</span>
                    <span className={deliveryFee === 0 ? "text-success" : "text-text-primary"}>
                      {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  {checkoutData.giftWrap && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Gift Wrap</span>
                      <span className="text-text-primary">{formatPrice(giftWrapFee)}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-text-primary">Total</span>
                      <span className="text-text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Place Order Button */}
                <Button
                  variant="default"
                  size="lg"
                  fullWidth
                  onClick={handlePlaceOrder}
                  loading={isProcessing}
                  disabled={isProcessing}
                  className="mb-4"
                >
                  {isProcessing ? 'Processing Order...' : `Place Order - ${formatPrice(total)}`}
                </Button>
                
                {/* Security Info */}
                <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
                  <Icon name="Shield" size={16} className="text-success" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketplaceCheckout;
