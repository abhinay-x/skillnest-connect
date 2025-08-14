import apiClient from './apiClient';

// Payment API endpoints
const PAYMENT_ENDPOINTS = {
  CREATE_ORDER: '/payments/create-order',
  VERIFY_PAYMENT: '/payments/verify',
  GET_PAYMENT_HISTORY: '/payments/history',
  REFUND_PAYMENT: '/payments/refund',
  GET_PAYMENT_METHODS: '/payments/methods',
  SAVE_PAYMENT_METHOD: '/payments/methods/save',
  DELETE_PAYMENT_METHOD: '/payments/methods/delete'
};

// Razorpay integration
export const createRazorpayOrder = async (orderData) => {
  try {
    const response = await apiClient.post(PAYMENT_ENDPOINTS.CREATE_ORDER, {
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      bookingId: orderData.bookingId,
      customerId: orderData.customerId,
      notes: orderData.notes || {}
    });
    
    return { success: true, order: response.data.order };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create payment order'
    };
  }
};

// Process Razorpay payment
export const processRazorpayPayment = (orderData, onSuccess, onFailure) => {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error('Razorpay SDK not loaded'));
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: 'SkillNest',
      description: orderData.description || 'Service Payment',
      order_id: orderData.orderId,
      image: '/logo192.png',
      handler: async (response) => {
        try {
          // Verify payment on backend
          const verificationResult = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingId: orderData.bookingId
          });
          
          if (verificationResult.success) {
            if (onSuccess) onSuccess(verificationResult.payment);
            resolve(verificationResult.payment);
          } else {
            if (onFailure) onFailure(verificationResult.error);
            reject(new Error(verificationResult.error));
          }
        } catch (error) {
          if (onFailure) onFailure(error.message);
          reject(error);
        }
      },
      prefill: {
        name: orderData.customerName,
        email: orderData.customerEmail,
        contact: orderData.customerPhone
      },
      notes: orderData.notes || {},
      theme: {
        color: '#3b82f6'
      },
      modal: {
        ondismiss: () => {
          const error = 'Payment cancelled by user';
          if (onFailure) onFailure(error);
          reject(new Error(error));
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  });
};

// Verify payment
export const verifyPayment = async (paymentData) => {
  try {
    const response = await apiClient.post(PAYMENT_ENDPOINTS.VERIFY_PAYMENT, paymentData);
    return { success: true, payment: response.data.payment };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Payment verification failed'
    };
  }
};

// Get payment history
export const getPaymentHistory = async (userId, filters = {}) => {
  try {
    const response = await apiClient.get(PAYMENT_ENDPOINTS.GET_PAYMENT_HISTORY, {
      params: { userId, ...filters }
    });
    return { success: true, payments: response.data.payments };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch payment history'
    };
  }
};

// Refund payment
export const refundPayment = async (paymentId, refundData) => {
  try {
    const response = await apiClient.post(`${PAYMENT_ENDPOINTS.REFUND_PAYMENT}/${paymentId}`, refundData);
    return { success: true, refund: response.data.refund };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Refund failed'
    };
  }
};

// Get saved payment methods
export const getPaymentMethods = async (userId) => {
  try {
    const response = await apiClient.get(PAYMENT_ENDPOINTS.GET_PAYMENT_METHODS, {
      params: { userId }
    });
    return { success: true, methods: response.data.methods };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch payment methods'
    };
  }
};

// Save payment method
export const savePaymentMethod = async (methodData) => {
  try {
    const response = await apiClient.post(PAYMENT_ENDPOINTS.SAVE_PAYMENT_METHOD, methodData);
    return { success: true, method: response.data.method };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to save payment method'
    };
  }
};

// Delete payment method
export const deletePaymentMethod = async (methodId) => {
  try {
    await apiClient.delete(`${PAYMENT_ENDPOINTS.DELETE_PAYMENT_METHOD}/${methodId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete payment method'
    };
  }
};

// Calculate service charges
export const calculateCharges = (baseAmount, serviceCharges = {}) => {
  const {
    platformFeePercent = 2.5,
    gstPercent = 18,
    processingFeeFlat = 5
  } = serviceCharges;

  const platformFee = (baseAmount * platformFeePercent) / 100;
  const gst = ((baseAmount + platformFee) * gstPercent) / 100;
  const processingFee = processingFeeFlat;
  
  const totalAmount = baseAmount + platformFee + gst + processingFee;

  return {
    baseAmount,
    platformFee: Math.round(platformFee * 100) / 100,
    gst: Math.round(gst * 100) / 100,
    processingFee,
    totalAmount: Math.round(totalAmount * 100) / 100
  };
};

// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded'
};

// Payment method types
export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  NET_BANKING: 'netbanking',
  WALLET: 'wallet',
  EMI: 'emi',
  CASH: 'cash'
};
