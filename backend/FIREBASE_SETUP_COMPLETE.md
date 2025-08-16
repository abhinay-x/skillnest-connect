# Complete Firebase Setup Guide for SkillNest

## 🔥 Firebase Database Setup - Step by Step

### Step 1: Create Firebase Project

#### 1.1 Go to Firebase Console
- Visit: https://console.firebase.google.com
- Click "Create Project"
- Name: "SkillNest"
- Enable Google Analytics (optional)
- Click "Create Project"

#### 1.2 Get Project Configuration
- After project creation, click "Continue"
- Click the gear icon (⚙️) → Project Settings
- Under "Your apps" → Click "Web" icon (`</>`)
- App nickname: "SkillNest Web"
- Register app
- **Copy the configuration object** - you'll need this for frontend

### Step 2: Enable Firebase Services

#### 2.1 Enable Authentication
- Go to Authentication → Get Started
- Enable these sign-in methods:
  - **Email/Password** → Enable
  - **Google** → Enable → Select support email
  - **Phone** → Enable (optional)

#### 2.2 Enable Firestore Database
- Go to Firestore Database → Create Database
- Choose **Production Mode** → Next
- Select location: Choose nearest region (e.g., `asia-south1` for India)
- Click "Enable"

#### 2.3 Enable Storage
- Go to Storage → Get Started
- Click "Next" through setup
- Choose location: Same as Firestore
- Click "Done"

#### 2.4 Enable Cloud Messaging (Push Notifications)
- Go to Cloud Messaging → Get Started
- Click "Register" for Web Push
- Follow setup instructions

### Step 3: Database Structure Creation

#### 3.1 Manual Collection Creation (Recommended)
Go to Firestore Database and create these collections with sample documents:

**Collections to Create:**

##### 1. Users Collection
```javascript
Collection: users
Document ID: auto-generated
Fields:
- uid: "user123" (string)
- email: "user@example.com" (string)
- firstName: "John" (string)
- lastName: "Doe" (string)
- phoneNumber: "+919876543210" (string)
- userType: "customer" (string) [customer/worker/admin]
- profileImage: "https://..." (string)
- createdAt: timestamp
- updatedAt: timestamp
- isActive: true (boolean)
- location: {lat: 12.9716, lng: 77.5946} (map)
- address: "Bangalore, India" (string)
- preferences: {notifications: true, theme: "light"} (map)
```

##### 2. Services Collection
```javascript
Collection: services
Fields:
- name: "Plumbing Service" (string)
- description: "Professional plumbing services..." (string)
- category: "Home Services" (string)
- price: 500 (number)
- priceUnit: "per hour" (string)
- duration: 60 (number) // in minutes
- workerId: "worker123" (string)
- images: ["url1", "url2"] (array)
- tags: ["plumbing", "repair", "emergency"] (array)
- averageRating: 4.5 (number)
- totalReviews: 25 (number)
- isActive: true (boolean)
- location: {lat: 12.9716, lng: 77.5946} (map)
- availability: ["09:00", "10:00", "11:00"] (array)
- createdAt: timestamp
- updatedAt: timestamp
```

##### 3. Bookings Collection
```javascript
Collection: bookings
Fields:
- customerId: "customer123" (string)
- workerId: "worker123" (string)
- serviceId: "service123" (string)
- serviceName: "Plumbing Service" (string)
- bookingDate: "2024-08-15" (string)
- bookingTime: "14:00" (string)
- duration: 60 (number)
- price: 500 (number)
- status: "pending" (string) [pending/confirmed/completed/cancelled]
- address: "Customer address" (string)
- notes: "Special instructions" (string)
- paymentStatus: "pending" (string)
- paymentId: "pay_123" (string)
- createdAt: timestamp
- updatedAt: timestamp
- completedAt: timestamp (nullable)
- cancelledAt: timestamp (nullable)
```

##### 4. Reviews Collection
```javascript
Collection: reviews
Fields:
- bookingId: "booking123" (string)
- customerId: "customer123" (string)
- workerId: "worker123" (string)
- serviceId: "service123" (string)
- rating: 5 (number) [1-5]
- comment: "Great service!" (string)
- images: ["review_image_url"] (array)
- createdAt: timestamp
- updatedAt: timestamp
```

##### 5. Chat Collection
```javascript
Collection: chats
Fields:
- participants: ["user1", "user2"] (array)
- bookingId: "booking123" (string)
- lastMessage: "Hello there!" (string)
- lastMessageAt: timestamp
- createdAt: timestamp
- updatedAt: timestamp
```

##### 6. Messages Collection (subcollection)
```javascript
Collection: chats/{chatId}/messages
Fields:
- senderId: "user123" (string)
- message: "Hello" (string)
- type: "text" (string) [text/image/file]
- fileUrl: "https://..." (string, optional)
- createdAt: timestamp
- read: false (boolean)
```

##### 7. Notifications Collection
```javascript
Collection: notifications
Fields:
- userId: "user123" (string)
- title: "New Booking" (string)
- message: "You have a new booking request" (string)
- type: "booking" (string) [booking/message/payment/system]
- data: {bookingId: "123"} (map)
- read: false (boolean)
- createdAt: timestamp
- updatedAt: timestamp
```

##### 8. Payments Collection
```javascript
Collection: payments
Fields:
- bookingId: "booking123" (string)
- customerId: "customer123" (string)
- workerId: "worker123" (string)
- amount: 500 (number)
- currency: "INR" (string)
- razorpayOrderId: "order_123" (string)
- razorpayPaymentId: "pay_123" (string)
- razorpaySignature: "signature" (string)
- status: "success" (string) [pending/success/failed/refunded]
- refundAmount: 0 (number)
- refundId: "refund_123" (string, optional)
- createdAt: timestamp
- updatedAt: timestamp
```

##### 9. Tools Collection (for tool rental)
```javascript
Collection: tools
Fields:
- name: "Electric Drill" (string)
- description: "Professional grade drill" (string)
- category: "Power Tools" (string)
- pricePerDay: 200 (number)
- pricePerWeek: 1200 (number)
- ownerId: "worker123" (string)
- images: ["tool_image_url"] (array)
- availability: true (boolean)
- location: {lat: 12.9716, lng: 77.5946} (map)
- condition: "excellent" (string)
- specifications: {power: "500W", brand: "Bosch"} (map)
- createdAt: timestamp
- updatedAt: timestamp
```

##### 10. Tool Rentals Collection
```javascript
Collection: toolRentals
Fields:
- toolId: "tool123" (string)
- customerId: "customer123" (string)
- ownerId: "worker123" (string)
- startDate: "2024-08-15" (string)
- endDate: "2024-08-17" (string)
- totalPrice: 400 (number)
- status: "active" (string) [pending/active/completed/cancelled]
- deposit: 500 (number)
- createdAt: timestamp
- updatedAt: timestamp
```

### Step 4: URL Integration

#### 4.1 Get Firebase URLs
After setup, you'll get these URLs:

**Firebase Project URLs:**
```
# Your project URLs will look like:
Project ID: skillnest-portal-39ed4
Firestore URL: https://firestore.googleapis.com/v1/projects/skillnest-portal-39ed4/databases/(default)/documents
Storage URL: gs://skillnest-portal-39ed4.appspot.com
Functions URL: https://nam3-skillnest-portal-39ed4.cloudfunctions.net
```

#### 4.2 Frontend Configuration

Create `src/config/firebase.js`:
```javascript
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "skillnest-12345.firebaseapp.com",
  projectId: "skillnest-12345",
  storageBucket: "skillnest-12345.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Backend URLs
const backendUrls = {
  functions: 'https://nam3-skillnest-portal-39ed4.cloudfunctions.net',
  firestore: 'https://firestore.googleapis.com/v1/projects/skillnest-portal-39ed4/databases/(default)/documents',
  storage: 'gs://skillnest-portal-39ed4.appspot.com'
};

export { firebaseConfig, backendUrls };
```

### Step 5: Firestore Indexes Setup

#### 5.1 Create Required Indexes
Go to Firestore Database → Indexes tab → Add Index:

**Index 1: Services by Category and Price**
- Collection: services
- Fields: category (Ascending), price (Ascending)
- Query scope: Collection

**Index 2: Services by Location and Rating**
- Collection: services
- Fields: location (Ascending), averageRating (Descending)
- Query scope: Collection

**Index 3: Bookings by User and Date**
- Collection: bookings
- Fields: customerId (Ascending), bookingDate (Ascending)
- Query scope: Collection

**Index 4: Bookings by Worker and Status**
- Collection: bookings
- Fields: workerId (Ascending), status (Ascending), createdAt (Descending)
- Query scope: Collection

### Step 6: Firebase CLI Setup

#### 6.1 Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

#### 6.2 Initialize Project
```bash
cd e:\skillnest\backend
firebase init

# Select:
# - Firestore
# - Functions
# - Storage
# - Emulators (optional)

# Choose existing project: skillnest-12345
```

#### 6.3 Deploy Rules
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage

# Deploy Functions
firebase deploy --only functions
```

### Step 7: Testing Database

#### 7.1 Test Firestore Connection
```javascript
// Test adding a document
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const db = getFirestore();

// Add test service
await addDoc(collection(db, 'services'), {
  name: 'Test Plumbing Service',
  description: 'Test description',
  price: 500,
  category: 'Home Services',
  createdAt: new Date()
});
```

#### 7.2 Test Authentication
```javascript
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const userCredential = await createUserWithEmailAndPassword(auth, 'test@example.com', 'password123');
```

### Step 8: Environment Variables

Create `.env` file in frontend:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=skillnest-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=skillnest-12345
VITE_FIREBASE_STORAGE_BUCKET=skillnest-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FUNCTIONS_URL=https://us-central1-skillnest-12345.cloudfunctions.net
```

### Step 9: Quick Verification Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email, Google, Phone)
- [ ] Firestore database created
- [ ] Storage bucket created
- [ ] All collections created with sample data
- [ ] Indexes created
- [ ] Rules deployed
- [ ] Functions deployed
- [ ] Frontend environment variables configured
- [ ] Test connection successful

### Step 10: Common Issues & Solutions

#### Issue 1: "Firebase: Error (auth/invalid-api-key)"
**Solution**: Check if API key is correct in firebaseConfig

#### Issue 2: "Missing or insufficient permissions"
**Solution**: Check Firestore rules and ensure user is authenticated

#### Issue 3: "Index not found"
**Solution**: Create required composite indexes in Firestore

#### Issue 4: "Storage bucket not found"
**Solution**: Ensure Storage is enabled and bucket name is correct

### Support Resources
- **Firebase Console**: https://console.firebase.google.com
- **Documentation**: https://firebase.google.com/docs
- **CLI Reference**: https://firebase.google.com/docs/cli
- **Community**: https://stackoverflow.com/questions/tagged/firebase

### Quick Commands Reference
```bash
# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only firestore:rules
firebase deploy --only storage
firebase deploy --only functions
firebase deploy --only hosting

# Test locally
firebase emulators:start

# Check project
firebase projects:list

# View logs
firebase functions:log
```
