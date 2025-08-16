import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const RentalCheckout = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get rental items from location state or default
  const [rentalItems] = useState(location.state?.rentalItems || []);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get rental options from navigation state
  const rentalOptions = location.state?.rentalOptions || {};
  const pricingData = location.state?.pricing || {};
  
  // Checkout form data
  const [checkoutData, setCheckoutData] = useState({
    // Rental Information
    rentalPeriod: {
      startDate: '',
      endDate: '',
      duration: rentalOptions.duration || 1, // in days
      pickupTime: '10:00',
      returnTime: '18:00'
    },
    // Pickup/Return Information
    pickupOption: 'pickup', // pickup, delivery
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
    paymentMethod: 'advance', // advance, full, cod
    // Security Deposit
    securityDeposit: 'cash', // cash, card, upi
    // Additional Options
    insurance: rentalOptions.includeInsurance || false,
    specialInstructions: ''
  });

  // Initialize rental options from navigation state
  useEffect(() => {
    if (rentalOptions.duration) {
      setCheckoutData(prev => ({
        ...prev,
        rentalPeriod: {
          ...prev.rentalPeriod,
          duration: rentalOptions.duration
        }
      }));
    }
  }, [rentalOptions]);

  const [errors, setErrors] = useState({});

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateRentalSubtotal = () => {
    return rentalItems.reduce((sum, item) => {
      const dailyRate = item.pricePerDay || item.price;
      return sum + (dailyRate * item.quantity * checkoutData.rentalPeriod.duration);
    }, 0);
  };

  const calculateSecurityDeposit = () => {
    return rentalItems.reduce((sum, item) => {
      const depositAmount = item.securityDeposit || (item.price * 0.2); // 20% of item price as default
      return sum + (depositAmount * item.quantity);
    }, 0);
  };

  const calculateDeliveryFee = () => {
    if (checkoutData.pickupOption === 'pickup') return 0;
    return 100; // Flat delivery fee for rentals
  };

  const calculateInsuranceFee = () => {
    if (!checkoutData.insurance) return 0;
    const subtotal = calculateRentalSubtotal();
    return subtotal * 0.05; // 5% of rental amount
  };

  const calculateTax = (amount) => {
    return amount * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    const subtotal = calculateRentalSubtotal();
    const delivery = calculateDeliveryFee();
    const insurance = calculateInsuranceFee();
    const tax = calculateTax(subtotal + delivery + insurance);
    return subtotal + delivery + insurance + tax;
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

  const calculateDuration = () => {
    if (checkoutData.rentalPeriod.startDate && checkoutData.rentalPeriod.endDate) {
      const start = new Date(checkoutData.rentalPeriod.startDate);
      const end = new Date(checkoutData.rentalPeriod.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end day
      
      setCheckoutData(prev => ({
        ...prev,
        rentalPeriod: {
          ...prev.rentalPeriod,
          duration: diffDays
        }
      }));
    }
  };

  useEffect(() => {
    calculateDuration();
  }, [checkoutData.rentalPeriod.startDate, checkoutData.rentalPeriod.endDate]);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate rental period
    if (!checkoutData.rentalPeriod.startDate) {
      newErrors['rentalPeriod.startDate'] = 'Start date is required';
    }
    if (!checkoutData.rentalPeriod.endDate) {
      newErrors['rentalPeriod.endDate'] = 'End date is required';
    }
    
    // Validate dates
    if (checkoutData.rentalPeriod.startDate && checkoutData.rentalPeriod.endDate) {
      const start = new Date(checkoutData.rentalPeriod.startDate);
      const end = new Date(checkoutData.rentalPeriod.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (start < today) {
        newErrors['rentalPeriod.startDate'] = 'Start date cannot be in the past';
      }
      if (end < start) {
        newErrors['rentalPeriod.endDate'] = 'End date must be after start date';
      }
    }

    // Validate delivery address if delivery is selected
    if (checkoutData.pickupOption === 'delivery') {
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
          orderType: 'rental',
          orderId: `RT${Date.now()}`,
          items: rentalItems,
          rentalPeriod: checkoutData.rentalPeriod,
          total: calculateTotal(),
          securityDeposit: calculateSecurityDeposit(),
          pickupOption: checkoutData.pickupOption,
          deliveryAddress: checkoutData.pickupOption === 'delivery' ? checkoutData.deliveryAddress : null
        }
      });
    } catch (error) {
      console.error('Rental booking failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Redirect if no items
  useEffect(() => {
    if (rentalItems.length === 0) {
      navigate('/tool-rental');
    }
  }, [rentalItems, navigate]);

  const subtotal = calculateRentalSubtotal();
  const securityDeposit = calculateSecurityDeposit();
  const deliveryFee = calculateDeliveryFee();
  const insuranceFee = calculateInsuranceFee();
  const tax = calculateTax(subtotal + deliveryFee + insuranceFee);
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb />
        
        <div className="mt-6">
          <h1 className="text-3xl font-bold text-text-primary mb-8">Rental Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Rental Period */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                  <Icon name="Calendar" size={20} className="mr-2" />
                  Rental Period
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={checkoutData.rentalPeriod.startDate}
                    onChange={(e) => handleInputChange('rentalPeriod', 'startDate', e.target.value)}
                    error={errors['rentalPeriod.startDate']}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={checkoutData.rentalPeriod.endDate}
                    onChange={(e) => handleInputChange('rentalPeriod', 'endDate', e.target.value)}
                    error={errors['rentalPeriod.endDate']}
                    min={checkoutData.rentalPeriod.startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                  <Input
                    label="Pickup Time"
                    type="time"
                    value={checkoutData.rentalPeriod.pickupTime}
                    onChange={(e) => handleInputChange('rentalPeriod', 'pickupTime', e.target.value)}
                  />
                  <Input
                    label="Return Time"
                    type="time"
                    value={checkoutData.rentalPeriod.returnTime}
                    onChange={(e) => handleInputChange('rentalPeriod', 'returnTime', e.target.value)}
                  />
                </div>
                
                {checkoutData.rentalPeriod.duration > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-text-secondary">
                      <strong>Rental Duration:</strong> {checkoutData.rentalPeriod.duration} day{checkoutData.rentalPeriod.duration > 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>

              {/* Pickup/Delivery Options */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                  <Icon name="MapPin" size={20} className="mr-2" />
                  Pickup/Delivery Options
                </h2>
                
                <div className="space-y-4 mb-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="pickupOption"
                      value="pickup"
                      checked={checkoutData.pickupOption === 'pickup'}
                      onChange={(e) => handleDirectInputChange('pickupOption', e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">Store Pickup (Free)</div>
                      <div className="text-sm text-text-secondary">Pick up from our store location</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="pickupOption"
                      value="delivery"
                      checked={checkoutData.pickupOption === 'delivery'}
                      onChange={(e) => handleDirectInputChange('pickupOption', e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">Home Delivery (₹100)</div>
                      <div className="text-sm text-text-secondary">We'll deliver and pick up from your location</div>
                    </div>
                  </label>
                </div>

                {checkoutData.pickupOption === 'delivery' && (
                  <div className="border-t border-border pt-6">
                    <h3 className="text-lg font-medium text-text-primary mb-4">Delivery Address</h3>
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
                )}
              </div>

              {/* Payment & Security Deposit */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                  <Icon name="CreditCard" size={20} className="mr-2" />
                  Payment & Security Deposit
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-text-primary mb-4">Payment Method</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="advance"
                          checked={checkoutData.paymentMethod === 'advance'}
                          onChange={(e) => handleDirectInputChange('paymentMethod', e.target.value)}
                          className="text-primary"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-text-primary">50% Advance Payment</div>
                          <div className="text-sm text-text-secondary">Pay 50% now, rest on pickup/delivery</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="full"
                          checked={checkoutData.paymentMethod === 'full'}
                          onChange={(e) => handleDirectInputChange('paymentMethod', e.target.value)}
                          className="text-primary"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-text-primary">Full Payment</div>
                          <div className="text-sm text-text-secondary">Pay the complete amount now</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-text-primary mb-4">Security Deposit Method</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="securityDeposit"
                          value="cash"
                          checked={checkoutData.securityDeposit === 'cash'}
                          onChange={(e) => handleDirectInputChange('securityDeposit', e.target.value)}
                          className="text-primary"
                        />
                        <div className="flex items-center space-x-2">
                          <Icon name="Banknote" size={20} />
                          <span className="font-medium text-text-primary">Cash Deposit</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="securityDeposit"
                          value="card"
                          checked={checkoutData.securityDeposit === 'card'}
                          onChange={(e) => handleDirectInputChange('securityDeposit', e.target.value)}
                          className="text-primary"
                        />
                        <div className="flex items-center space-x-2">
                          <Icon name="CreditCard" size={20} />
                          <span className="font-medium text-text-primary">Card Hold</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="securityDeposit"
                          value="upi"
                          checked={checkoutData.securityDeposit === 'upi'}
                          onChange={(e) => handleDirectInputChange('securityDeposit', e.target.value)}
                          className="text-primary"
                        />
                        <div className="flex items-center space-x-2">
                          <Icon name="Smartphone" size={20} />
                          <span className="font-medium text-text-primary">UPI Hold</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Options */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-6">Additional Options</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkoutData.insurance}
                      onChange={(e) => handleDirectInputChange('insurance', e.target.checked)}
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">Rental Insurance (+5% of rental amount)</div>
                      <div className="text-sm text-text-secondary">Protect against accidental damage or theft</div>
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
                      placeholder="Any special instructions for pickup/delivery..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-text-primary mb-6">Rental Summary</h2>
                
                {/* Items */}
                <div className="space-y-4 mb-6">
                  {rentalItems.map((item) => (
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
                          Qty: {item.quantity} × {formatPrice(item.pricePerDay || item.price)}/day × {checkoutData.rentalPeriod.duration} days
                        </p>
                      </div>
                      <div className="text-sm font-medium text-text-primary">
                        {formatPrice((item.pricePerDay || item.price) * item.quantity * checkoutData.rentalPeriod.duration)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Rental Subtotal</span>
                    <span className="text-text-primary">{formatPrice(subtotal)}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Delivery Fee</span>
                      <span className="text-text-primary">{formatPrice(deliveryFee)}</span>
                    </div>
                  )}
                  {checkoutData.insurance && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Insurance (5%)</span>
                      <span className="text-text-primary">{formatPrice(insuranceFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">GST (18%)</span>
                    <span className="text-text-primary">{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-text-primary">Total</span>
                      <span className="text-text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border pt-3">
                    <span className="text-warning font-medium">Security Deposit</span>
                    <span className="text-warning font-medium">{formatPrice(securityDeposit)}</span>
                  </div>
                </div>
                
                {/* Confirm Rental Button */}
                <Button
                  variant="default"
                  size="lg"
                  fullWidth
                  onClick={handlePlaceOrder}
                  loading={isProcessing}
                  disabled={isProcessing}
                  className="mb-4"
                >
                  {isProcessing ? 'Processing Rental...' : `Confirm Rental - ${formatPrice(total)}`}
                </Button>
                
                {/* Security Info */}
                <div className="space-y-2 text-sm text-text-secondary">
                  <div className="flex items-center justify-center space-x-2">
                    <Icon name="Shield" size={16} className="text-success" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs">Security deposit will be refunded after return</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RentalCheckout;
