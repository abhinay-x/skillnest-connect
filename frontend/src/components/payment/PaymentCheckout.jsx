import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createRazorpayOrder, processRazorpayPayment, calculateCharges } from '../../services/api/paymentService';
import { CreditCard, Wallet, Shield, Check } from 'lucide-react';

const PaymentCheckout = ({ booking, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [charges, setCharges] = useState(null);

  useEffect(() => {
    if (booking?.amount) {
      const calculatedCharges = calculateCharges(booking.amount);
      setCharges(calculatedCharges);
      createPaymentOrder(calculatedCharges.totalAmount);
    }
  }, [booking]);

  const createPaymentOrder = async (amount) => {
    try {
      const result = await createRazorpayOrder({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        bookingId: booking.id,
        customerId: user?.uid,
        notes: {
          service: booking.serviceName,
          provider: booking.providerName
        }
      });

      if (result.success) {
        setOrderData(result.order);
      }
    } catch (error) {
      console.error('Error creating payment order:', error);
    }
  };

  const handlePayment = async () => {
    if (!orderData) return;

    setLoading(true);
    try {
      await processRazorpayPayment({
        amount: charges.totalAmount * 100,
        currency: 'INR',
        orderId: orderData.id,
        bookingId: booking.id,
        customerName: user?.name,
        customerEmail: user?.email,
        customerPhone: user?.phone,
        description: `Payment for ${booking.serviceName}`
      }, onSuccess, (error) => {
        console.error('Payment failed:', error);
        setLoading(false);
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI', icon: Wallet },
    { id: 'netbanking', name: 'Net Banking', icon: Shield }
  ];

  if (!booking || !charges) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Payment Details
          </h2>

          {/* Service Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              {booking.serviceName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Provider: {booking.providerName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Date: {new Date(booking.date).toLocaleDateString()}
            </p>
            {booking.time && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Time: {booking.time}
              </p>
            )}
          </div>

          {/* Charges Breakdown */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Service Amount</span>
              <span className="font-medium">₹{charges.baseAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Platform Fee (2.5%)</span>
              <span className="font-medium">₹{charges.platformFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">GST (18%)</span>
              <span className="font-medium">₹{charges.gst}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Processing Fee</span>
              <span className="font-medium">₹{charges.processingFee}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span className="text-gray-900 dark:text-white">Total Amount</span>
              <span className="text-lg">₹{charges.totalAmount}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Select Payment Method
            </h3>
            <div className="space-y-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <label
                    key={method.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedMethod === method.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="sr-only"
                    />
                    <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {method.name}
                    </span>
                    {selectedMethod === method.id && (
                      <Check className="w-4 h-4 text-blue-500 ml-auto" />
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
            <Shield className="w-4 h-4 mr-1" />
            <span>Your payment is secure and encrypted</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePayment}
              disabled={loading || !orderData}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : `Pay ₹${charges.totalAmount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
