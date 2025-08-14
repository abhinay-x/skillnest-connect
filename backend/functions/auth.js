const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { onCall } = require('firebase-functions/v2/https');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');

// Create user profile on signup
exports.createUserProfile = onDocumentCreated('users/{userId}', async (event) => {
  const userId = event.params.userId;
  const userData = event.data.data();
  
  try {
    // Create user-specific collections and initial data
    const batch = admin.firestore().batch();
    
    // Create user preferences document
    const preferencesRef = admin.firestore().collection('userPreferences').doc(userId);
    batch.set(preferencesRef, {
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        profileVisible: true,
        showLocation: true
      },
      theme: 'light',
      language: 'en',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Create user stats document
    const statsRef = admin.firestore().collection('userStats').doc(userId);
    batch.set(statsRef, {
      totalBookings: 0,
      totalEarnings: 0,
      totalSpent: 0,
      averageRating: 0,
      totalReviews: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    await batch.commit();
    console.log(`User profile created for ${userId}`);
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
});

// Update user last login
exports.updateLastLogin = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const userId = request.auth.uid;
  
  try {
    await admin.firestore().collection('users').doc(userId).update({
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating last login:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update last login');
  }
});

// Get user profile
exports.getUserProfile = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const userId = request.auth.uid;
  
  try {
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const preferencesDoc = await admin.firestore().collection('userPreferences').doc(userId).get();
    const statsDoc = await admin.firestore().collection('userStats').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }
    
    return {
      user: userDoc.data(),
      preferences: preferencesDoc.exists ? preferencesDoc.data() : null,
      stats: statsDoc.exists ? statsDoc.data() : null
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get user profile');
  }
});

// Update user profile
exports.updateUserProfile = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const userId = request.auth.uid;
  const updates = request.data;
  
  try {
    await admin.firestore().collection('users').doc(userId).update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update user profile');
  }
});

// Verify phone number
exports.verifyPhoneNumber = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const { phoneNumber, verificationCode } = request.data;
  
  try {
    // In a real implementation, you would verify the code with SMS provider
    // This is a simplified version
    
    await admin.firestore().collection('users').doc(request.auth.uid).update({
      phoneNumber: phoneNumber,
      phoneVerified: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true, verified: true };
  } catch (error) {
    console.error('Error verifying phone number:', error);
    throw new functions.https.HttpsError('internal', 'Failed to verify phone number');
  }
});

// Get user by phone number
exports.getUserByPhone = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const { phoneNumber } = request.data;
  
  try {
    const userSnapshot = await admin.firestore()
      .collection('users')
      .where('phoneNumber', '==', phoneNumber)
      .limit(1)
      .get();
    
    if (userSnapshot.empty) {
      return { user: null };
    }
    
    return { user: userSnapshot.docs[0].data() };
  } catch (error) {
    console.error('Error getting user by phone:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get user by phone');
  }
});
