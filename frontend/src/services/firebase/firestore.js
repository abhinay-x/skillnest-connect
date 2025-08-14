import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import { db } from './config';

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  WORKERS: 'workers',
  SERVICES: 'services',
  BOOKINGS: 'bookings',
  REVIEWS: 'reviews',
  PAYMENTS: 'payments',
  TOOLS: 'tools',
  TRAINING: 'training',
  CHATS: 'chats',
  NOTIFICATIONS: 'notifications'
};

// Generic CRUD operations
export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    return { id: null, error: error.message };
  }
};

export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
    } else {
      return { data: null, error: 'Document not found' };
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    return { data: null, error: error.message };
  }
};

export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
};

export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
};

// Query operations
export const getDocuments = async (collectionName, queryOptions = {}) => {
  try {
    let q = collection(db, collectionName);
    
    if (queryOptions.where) {
      queryOptions.where.forEach(([field, operator, value]) => {
        q = query(q, where(field, operator, value));
      });
    }
    
    if (queryOptions.orderBy) {
      queryOptions.orderBy.forEach(([field, direction = 'asc']) => {
        q = query(q, orderBy(field, direction));
      });
    }
    
    if (queryOptions.limit) {
      q = query(q, limit(queryOptions.limit));
    }
    
    if (queryOptions.startAfter) {
      q = query(q, startAfter(queryOptions.startAfter));
    }
    
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { data: documents, error: null };
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    return { data: [], error: error.message };
  }
};

// Real-time listeners
export const subscribeToDocument = (collectionName, docId, callback) => {
  const docRef = doc(db, collectionName, docId);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  });
};

export const subscribeToCollection = (collectionName, queryOptions = {}, callback) => {
  let q = collection(db, collectionName);
  
  if (queryOptions.where) {
    queryOptions.where.forEach(([field, operator, value]) => {
      q = query(q, where(field, operator, value));
    });
  }
  
  if (queryOptions.orderBy) {
    queryOptions.orderBy.forEach(([field, direction = 'asc']) => {
      q = query(q, orderBy(field, direction));
    });
  }
  
  if (queryOptions.limit) {
    q = query(q, limit(queryOptions.limit));
  }
  
  return onSnapshot(q, (querySnapshot) => {
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(documents);
  });
};

// Service-specific operations
export const getServicesByCategory = async (category, location = null) => {
  try {
    let queryOptions = {
      where: [['category', '==', category], ['status', '==', 'active']],
      orderBy: [['rating', 'desc'], ['createdAt', 'desc']]
    };
    
    if (location) {
      queryOptions.where.push(['location.city', '==', location.city]);
    }
    
    return await getDocuments(COLLECTIONS.SERVICES, queryOptions);
  } catch (error) {
    console.error('Error getting services by category:', error);
    return { data: [], error: error.message };
  }
};

export const getWorkersByService = async (serviceId, location = null) => {
  try {
    let queryOptions = {
      where: [['services', 'array-contains', serviceId], ['status', '==', 'active'], ['isAvailable', '==', true]],
      orderBy: [['rating', 'desc'], ['completedJobs', 'desc']]
    };
    
    if (location) {
      queryOptions.where.push(['location.city', '==', location.city]);
    }
    
    return await getDocuments(COLLECTIONS.WORKERS, queryOptions);
  } catch (error) {
    console.error('Error getting workers by service:', error);
    return { data: [], error: error.message };
  }
};

export const createBooking = async (bookingData) => {
  try {
    const booking = {
      ...bookingData,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    return await createDocument(COLLECTIONS.BOOKINGS, booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return { id: null, error: error.message };
  }
};

export const updateBookingStatus = async (bookingId, status, additionalData = {}) => {
  try {
    const updateData = {
      status,
      ...additionalData,
      updatedAt: serverTimestamp()
    };
    
    if (status === 'completed') {
      updateData.completedAt = serverTimestamp();
    }
    
    return await updateDocument(COLLECTIONS.BOOKINGS, bookingId, updateData);
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { success: false, error: error.message };
  }
};

export const getUserBookings = async (userId, userType = 'customer') => {
  try {
    const field = userType === 'customer' ? 'customerId' : 'workerId';
    const queryOptions = {
      where: [[field, '==', userId]],
      orderBy: [['createdAt', 'desc']]
    };
    
    return await getDocuments(COLLECTIONS.BOOKINGS, queryOptions);
  } catch (error) {
    console.error('Error getting user bookings:', error);
    return { data: [], error: error.message };
  }
};

export const addReview = async (reviewData) => {
  try {
    // Create review
    const reviewResult = await createDocument(COLLECTIONS.REVIEWS, reviewData);
    
    if (reviewResult.id) {
      // Update worker's rating
      const workerRef = doc(db, COLLECTIONS.WORKERS, reviewData.workerId);
      await runTransaction(db, async (transaction) => {
        const workerDoc = await transaction.get(workerRef);
        
        if (workerDoc.exists()) {
          const workerData = workerDoc.data();
          const currentRating = workerData.rating || 0;
          const currentReviewCount = workerData.reviewCount || 0;
          
          const newReviewCount = currentReviewCount + 1;
          const newRating = ((currentRating * currentReviewCount) + reviewData.rating) / newReviewCount;
          
          transaction.update(workerRef, {
            rating: parseFloat(newRating.toFixed(1)),
            reviewCount: newReviewCount,
            updatedAt: serverTimestamp()
          });
        }
      });
    }
    
    return reviewResult;
  } catch (error) {
    console.error('Error adding review:', error);
    return { id: null, error: error.message };
  }
};

// Batch operations
export const batchWrite = async (operations) => {
  try {
    const batch = writeBatch(db);
    
    operations.forEach(({ type, collection: collectionName, id, data }) => {
      const docRef = id ? doc(db, collectionName, id) : doc(collection(db, collectionName));
      
      switch (type) {
        case 'create':
        case 'set':
          batch.set(docRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
          break;
        case 'update':
          batch.update(docRef, { ...data, updatedAt: serverTimestamp() });
          break;
        case 'delete':
          batch.delete(docRef);
          break;
        default:
          console.warn(`Unknown batch operation type: ${type}`);
      }
    });
    
    await batch.commit();
    return { success: true, error: null };
  } catch (error) {
    console.error('Error in batch write:', error);
    return { success: false, error: error.message };
  }
};

// Search functionality
export const searchServices = async (searchTerm, filters = {}) => {
  try {
    let queryOptions = {
      where: [['status', '==', 'active']],
      orderBy: [['rating', 'desc']]
    };
    
    if (filters.category) {
      queryOptions.where.push(['category', '==', filters.category]);
    }
    
    if (filters.location) {
      queryOptions.where.push(['location.city', '==', filters.location]);
    }
    
    if (filters.priceRange) {
      queryOptions.where.push(['basePrice', '>=', filters.priceRange.min]);
      queryOptions.where.push(['basePrice', '<=', filters.priceRange.max]);
    }
    
    const result = await getDocuments(COLLECTIONS.SERVICES, queryOptions);
    
    // Client-side filtering for search term (Firestore doesn't support full-text search)
    if (searchTerm && result.data) {
      const filteredData = result.data.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      return { data: filteredData, error: null };
    }
    
    return result;
  } catch (error) {
    console.error('Error searching services:', error);
    return { data: [], error: error.message };
  }
};
