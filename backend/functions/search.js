const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { onCall } = require('firebase-functions/v2/https');

// Search services
exports.searchServices = onCall(async (request) => {
  const { query, category, location, priceRange, rating, limit = 20, lastDoc } = request.data;

  try {
    let servicesQuery = admin.firestore().collection('services');
    
    // Build query based on filters
    if (category && category !== 'all') {
      servicesQuery = servicesQuery.where('category', '==', category);
    }
    
    if (priceRange && priceRange.length === 2) {
      servicesQuery = servicesQuery
        .where('price', '>=', priceRange[0])
        .where('price', '<=', priceRange[1]);
    }
    
    if (rating && rating > 0) {
      servicesQuery = servicesQuery.where('averageRating', '>=', rating);
    }
    
    if (location) {
      servicesQuery = servicesQuery.where('location', '==', location);
    }
    
    servicesQuery = servicesQuery.orderBy('createdAt', 'desc').limit(limit);
    
    if (lastDoc) {
      const lastDocRef = await admin.firestore().collection('services').doc(lastDoc).get();
      servicesQuery = servicesQuery.startAfter(lastDocRef);
    }

    const snapshot = await servicesQuery.get();
    const services = [];

    snapshot.forEach(doc => {
      const service = doc.data();
      
      // Text search within results
      if (query) {
        const searchText = `${service.name} ${service.description} ${service.tags?.join(' ')}`.toLowerCase();
        if (searchText.includes(query.toLowerCase())) {
          services.push({ id: doc.id, ...service });
        }
      } else {
        services.push({ id: doc.id, ...service });
      }
    });

    return {
      services,
      hasMore: services.length === limit,
      total: services.length
    };
  } catch (error) {
    console.error('Error searching services:', error);
    throw new functions.https.HttpsError('internal', 'Failed to search services');
  }
});

// Search workers
exports.searchWorkers = onCall(async (request) => {
  const { query, category, location, rating, limit = 20, lastDoc } = request.data;

  try {
    let workersQuery = admin.firestore()
      .collection('users')
      .where('userType', '==', 'worker');
    
    if (category && category !== 'all') {
      workersQuery = workersQuery.where('category', '==', category);
    }
    
    if (location) {
      workersQuery = workersQuery.where('location', '==', location);
    }
    
    if (rating && rating > 0) {
      workersQuery = workersQuery.where('averageRating', '>=', rating);
    }
    
    workersQuery = workersQuery.orderBy('createdAt', 'desc').limit(limit);
    
    if (lastDoc) {
      const lastDocRef = await admin.firestore().collection('users').doc(lastDoc).get();
      workersQuery = workersQuery.startAfter(lastDocRef);
    }

    const snapshot = await workersQuery.get();
    const workers = [];

    snapshot.forEach(doc => {
      const worker = doc.data();
      
      if (query) {
        const searchText = `${worker.firstName} ${worker.lastName} ${worker.skills?.join(' ')} ${worker.description}`.toLowerCase();
        if (searchText.includes(query.toLowerCase())) {
          workers.push({ id: doc.id, ...worker });
        }
      } else {
        workers.push({ id: doc.id, ...worker });
      }
    });

    return {
      workers,
      hasMore: workers.length === limit,
      total: workers.length
    };
  } catch (error) {
    console.error('Error searching workers:', error);
    throw new functions.https.HttpsError('internal', 'Failed to search workers');
  }
});

// Advanced search with filters
exports.advancedSearch = onCall(async (request) => {
  const {
    type, // 'services', 'workers', 'bookings', 'products'
    query,
    filters = {},
    sortBy = 'relevance',
    sortOrder = 'desc',
    limit = 20,
    lastDoc
  } = request.data;

  try {
    let collectionRef;
    let searchFields = [];
    
    switch (type) {
      case 'services':
        collectionRef = admin.firestore().collection('services');
        searchFields = ['name', 'description', 'category', 'tags'];
        break;
      case 'workers':
        collectionRef = admin.firestore()
          .collection('users')
          .where('userType', '==', 'worker');
        searchFields = ['firstName', 'lastName', 'skills', 'description', 'location'];
        break;
      case 'bookings':
        collectionRef = admin.firestore().collection('bookings');
        searchFields = ['serviceName', 'workerName', 'customerName'];
        break;
      case 'products':
        collectionRef = admin.firestore().collection('products');
        searchFields = ['name', 'description', 'category', 'tags'];
        break;
      default:
        throw new functions.https.HttpsError('invalid-argument', 'Invalid search type');
    }

    // Apply filters
    let query = collectionRef;
    
    if (filters.category) {
      query = query.where('category', '==', filters.category);
    }
    
    if (filters.priceRange && filters.priceRange.length === 2) {
      query = query
        .where('price', '>=', filters.priceRange[0])
        .where('price', '<=', filters.priceRange[1]);
    }
    
    if (filters.rating && filters.rating > 0) {
      query = query.where('averageRating', '>=', filters.rating);
    }
    
    if (filters.location) {
      query = query.where('location', '==', filters.location);
    }
    
    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }
    
    // Sorting
    const sortField = sortBy === 'price' ? 'price' : 
                     sortBy === 'rating' ? 'averageRating' : 
                     sortBy === 'date' ? 'createdAt' : 'createdAt';
    
    query = query.orderBy(sortField, sortOrder === 'asc' ? 'asc' : 'desc');
    query = query.limit(limit);
    
    if (lastDoc) {
      const lastDocRef = await admin.firestore().collection(type).doc(lastDoc).get();
      query = query.startAfter(lastDocRef);
    }

    const snapshot = await query.get();
    const results = [];

    snapshot.forEach(doc => {
      const item = doc.data();
      
      // Text search
      if (query) {
        let searchText = '';
        searchFields.forEach(field => {
          if (item[field]) {
            searchText += Array.isArray(item[field]) ? item[field].join(' ') : item[field];
            searchText += ' ';
          }
        });
        
        if (searchText.toLowerCase().includes(query.toLowerCase())) {
          results.push({ id: doc.id, ...item });
        }
      } else {
        results.push({ id: doc.id, ...item });
      }
    });

    return {
      results,
      hasMore: results.length === limit,
      total: results.length,
      type
    };
  } catch (error) {
    console.error('Error in advanced search:', error);
    throw new functions.https.HttpsError('internal', 'Failed to perform advanced search');
  }
});

// Get popular searches
exports.getPopularSearches = onCall(async (request) => {
  try {
    const popularSnapshot = await admin.firestore()
      .collection('popularSearches')
      .orderBy('count', 'desc')
      .limit(10)
      .get();

    const popularSearches = [];
    popularSnapshot.forEach(doc => {
      popularSearches.push(doc.data());
    });

    return { popularSearches };
  } catch (error) {
    console.error('Error getting popular searches:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get popular searches');
  }
});

// Record search query
exports.recordSearchQuery = onCall(async (request) => {
  const { query, type } = request.data;

  if (!query || query.trim().length < 2) {
    return { success: false, message: 'Query too short' };
  }

  try {
    const searchRef = admin.firestore()
      .collection('searchQueries')
      .doc(`${type}_${query.toLowerCase()}`);

    await searchRef.set({
      query: query.toLowerCase(),
      type: type,
      count: admin.firestore.FieldValue.increment(1),
      lastSearched: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Error recording search query:', error);
    throw new functions.https.HttpsError('internal', 'Failed to record search query');
  }
});
