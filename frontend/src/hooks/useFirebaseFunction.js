import { useState, useCallback } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

export const useFirebaseFunction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callFunction = useCallback(async (functionName, data = {}) => {
    setLoading(true);
    setError(null);

    try {
      const callable = httpsCallable(functions, functionName);
      const result = await callable(data);
      return result.data;
    } catch (err) {
      console.error(`Error calling ${functionName}:`, err);
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { callFunction, loading, error };
};

// Specific hooks for different data types
export const useBookings = () => {
  const { callFunction, loading, error } = useFirebaseFunction();

  const getUserBookings = useCallback(async (userType = 'customer', status = null, limit = 20) => {
    return await callFunction('getUserBookings', { userType, status, limit });
  }, [callFunction]);

  const createBooking = useCallback(async (bookingData) => {
    return await callFunction('createBooking', bookingData);
  }, [callFunction]);

  const updateBookingStatus = useCallback(async (bookingId, status, notes = '') => {
    return await callFunction('updateBookingStatus', { bookingId, status, notes });
  }, [callFunction]);

  const getBookingDetails = useCallback(async (bookingId) => {
    return await callFunction('getBookingDetails', { bookingId });
  }, [callFunction]);

  return {
    getUserBookings,
    createBooking,
    updateBookingStatus,
    getBookingDetails,
    loading,
    error
  };
};

export const useOrders = () => {
  const { callFunction, loading, error } = useFirebaseFunction();

  const getUserOrders = useCallback(async (status = null, limit = 20) => {
    return await callFunction('getUserOrders', { status, limit });
  }, [callFunction]);

  const createMarketplaceOrder = useCallback(async (orderData) => {
    return await callFunction('createMarketplaceOrder', orderData);
  }, [callFunction]);

  const updateOrderStatus = useCallback(async (orderId, status, trackingInfo = null) => {
    return await callFunction('updateOrderStatus', { orderId, status, trackingInfo });
  }, [callFunction]);

  return {
    getUserOrders,
    createMarketplaceOrder,
    updateOrderStatus,
    loading,
    error
  };
};

export const useRentals = () => {
  const { callFunction, loading, error } = useFirebaseFunction();

  const getUserRentals = useCallback(async (status = null, limit = 20) => {
    return await callFunction('getUserRentals', { status, limit });
  }, [callFunction]);

  const createRentalBooking = useCallback(async (rentalData) => {
    return await callFunction('createRentalBooking', rentalData);
  }, [callFunction]);

  const updateRentalStatus = useCallback(async (rentalId, status, notes = '') => {
    return await callFunction('updateRentalStatus', { rentalId, status, notes });
  }, [callFunction]);

  return {
    getUserRentals,
    createRentalBooking,
    updateRentalStatus,
    loading,
    error
  };
};
