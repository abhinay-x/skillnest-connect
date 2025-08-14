import { useState, useEffect, useCallback } from 'react';
import {
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  getDocuments,
  subscribeToDocument,
  subscribeToCollection,
  COLLECTIONS
} from '../services/firebase/firestore';

// Hook for single document operations
export const useDocument = (collectionName, docId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!docId) {
      setData(null);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToDocument(collectionName, docId, (doc) => {
      setData(doc);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [collectionName, docId]);

  const updateDoc = useCallback(async (updateData) => {
    if (!docId) return { success: false, error: 'No document ID provided' };
    
    setLoading(true);
    const result = await updateDocument(collectionName, docId, updateData);
    setLoading(false);
    
    if (result.error) {
      setError(result.error);
    }
    
    return result;
  }, [collectionName, docId]);

  const deleteDoc = useCallback(async () => {
    if (!docId) return { success: false, error: 'No document ID provided' };
    
    setLoading(true);
    const result = await deleteDocument(collectionName, docId);
    setLoading(false);
    
    if (result.error) {
      setError(result.error);
    } else {
      setData(null);
    }
    
    return result;
  }, [collectionName, docId]);

  return {
    data,
    loading,
    error,
    updateDoc,
    deleteDoc,
    clearError: () => setError(null)
  };
};

// Hook for collection operations
export const useCollection = (collectionName, queryOptions = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToCollection(collectionName, queryOptions, (docs) => {
      setData(docs);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [collectionName, JSON.stringify(queryOptions)]);

  const addDoc = useCallback(async (docData) => {
    setLoading(true);
    const result = await createDocument(collectionName, docData);
    setLoading(false);
    
    if (result.error) {
      setError(result.error);
    }
    
    return result;
  }, [collectionName]);

  return {
    data,
    loading,
    error,
    addDoc,
    clearError: () => setError(null)
  };
};

// Hook for user bookings
export const useUserBookings = (userId, userType = 'customer') => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const field = userType === 'customer' ? 'customerId' : 'workerId';
    const queryOptions = {
      where: [[field, '==', userId]],
      orderBy: [['createdAt', 'desc']]
    };

    const unsubscribe = subscribeToCollection(COLLECTIONS.BOOKINGS, queryOptions, (docs) => {
      setBookings(docs);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [userId, userType]);

  return { bookings, loading, error };
};

// Hook for services by category
export const useServicesByCategory = (category, location = null) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) {
      setServices([]);
      setLoading(false);
      return;
    }

    let queryOptions = {
      where: [['category', '==', category], ['status', '==', 'active']],
      orderBy: [['rating', 'desc'], ['createdAt', 'desc']]
    };

    if (location) {
      queryOptions.where.push(['location.city', '==', location.city]);
    }

    const unsubscribe = subscribeToCollection(COLLECTIONS.SERVICES, queryOptions, (docs) => {
      setServices(docs);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [category, location?.city]);

  return { services, loading, error };
};

// Hook for workers by service
export const useWorkersByService = (serviceId, location = null) => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!serviceId) {
      setWorkers([]);
      setLoading(false);
      return;
    }

    let queryOptions = {
      where: [
        ['services', 'array-contains', serviceId],
        ['status', '==', 'active'],
        ['isAvailable', '==', true]
      ],
      orderBy: [['rating', 'desc'], ['completedJobs', 'desc']]
    };

    if (location) {
      queryOptions.where.push(['location.city', '==', location.city]);
    }

    const unsubscribe = subscribeToCollection(COLLECTIONS.WORKERS, queryOptions, (docs) => {
      setWorkers(docs);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [serviceId, location?.city]);

  return { workers, loading, error };
};

// Hook for reviews
export const useReviews = (targetId, targetType = 'worker') => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!targetId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    const field = targetType === 'worker' ? 'workerId' : 'serviceId';
    const queryOptions = {
      where: [[field, '==', targetId]],
      orderBy: [['createdAt', 'desc']]
    };

    const unsubscribe = subscribeToCollection(COLLECTIONS.REVIEWS, queryOptions, (docs) => {
      setReviews(docs);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [targetId, targetType]);

  return { reviews, loading, error };
};

// Hook for real-time chat
export const useChat = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const queryOptions = {
      where: [['chatId', '==', chatId]],
      orderBy: [['timestamp', 'asc']]
    };

    const unsubscribe = subscribeToCollection('messages', queryOptions, (docs) => {
      setMessages(docs);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [chatId]);

  const sendMessage = useCallback(async (messageData) => {
    const result = await createDocument('messages', {
      ...messageData,
      chatId,
      timestamp: new Date()
    });
    
    if (result.error) {
      setError(result.error);
    }
    
    return result;
  }, [chatId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearError: () => setError(null)
  };
};
