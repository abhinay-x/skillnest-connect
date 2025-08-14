# SkillNest Firebase Backend Deployment Guide

## Overview
This guide provides step-by-step instructions to deploy the complete Firebase backend for the SkillNest application.

## Prerequisites
- Node.js 18+ installed
- Firebase CLI installed globally: `npm install -g firebase-tools`
- Firebase project created at [Firebase Console](https://console.firebase.google.com)
- Razorpay account and API keys
- Optional: Twilio account for SMS verification

## Setup Instructions

### 1. Firebase Project Setup
```bash
# Login to Firebase
firebase login

# Initialize Firebase in the backend directory
cd e:\skillnest\backend
firebase init

# Select the following during initialization:
# - Firestore
# - Functions
# - Storage
# - Emulators (optional for development)
```

### 2. Environment Configuration

#### Create `.env` file in backend/functions:
```bash
cd functions
```

Create `.env` file with your actual credentials:
```
# Firebase Configuration (these will be auto-loaded)
# No need to add here - use firebase functions:config:set

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Twilio Configuration (optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Algolia Configuration (optional for advanced search)
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_API_KEY=your_algolia_api_key
```

#### Set Firebase environment variables:
```bash
# Set Razorpay configuration
firebase functions:config:set razorpay.key_id="your_key_id" razorpay.key_secret="your_key_secret"

# Set Twilio configuration (optional)
firebase functions:config:set twilio.account_sid="your_account_sid" twilio.auth_token="your_auth_token" twilio.phone_number="your_phone_number"

# Set Algolia configuration (optional)
firebase functions:config:set algolia.app_id="your_app_id" algolia.api_key="your_api_key"
```

### 3. Install Dependencies
```bash
cd functions
npm install
```

### 4. Firestore Indexes
Create the following composite indexes in Firebase Console:

#### Services Indexes:
- Collection: `services`
  - Fields: `category ASC`, `price ASC`
  - Fields: `category ASC`, `averageRating DESC`
  - Fields: `location ASC`, `createdAt DESC`

#### Bookings Indexes:
- Collection: `bookings`
  - Fields: `workerId ASC`, `bookingDate ASC`, `bookingTime ASC`, `status ASC`
  - Fields: `customerId ASC`, `createdAt DESC`
  - Fields: `workerId ASC`, `createdAt DESC`

#### Users Indexes:
- Collection: `users`
  - Fields: `userType ASC`, `createdAt DESC`
  - Fields: `location ASC`, `averageRating DESC`

### 5. Firebase Authentication Setup
1. Go to Firebase Console → Authentication
2. Enable the following sign-in methods:
   - Email/Password
   - Google
   - Phone (optional)
3. Configure authorized domains

### 6. Cloud Storage Setup
1. Go to Firebase Console → Storage
2. Create default bucket
3. Upload rules will be automatically applied from `storage.rules`

### 7. Firestore Security Rules
The rules are already configured in `firestore.rules`. Upload them:
```bash
firebase deploy --only firestore:rules
```

### 8. Cloud Storage Rules
Upload storage rules:
```bash
firebase deploy --only storage
```

### 9. Deploy Cloud Functions
```bash
# Deploy all functions
firebase deploy --only functions

# Or deploy specific functions
firebase deploy --only functions:createUserProfile,functions:createBooking
```

## Project Structure
```
backend/
├── firebase.json          # Firebase configuration
├── firestore.rules        # Firestore security rules
├── storage.rules          # Storage security rules
├── functions/
│   ├── index.js           # Main functions entry point
│   ├── auth.js            # Authentication functions
│   ├── bookings.js        # Booking management functions
│   ├── payments.js        # Payment processing functions
│   ├── notifications.js   # Push notification functions
│   ├── search.js          # Search and filtering functions
│   ├── chat.js            # Real-time chat functions
│   ├── analytics.js       # Analytics functions
│   ├── workers.js         # Worker management functions
│   ├── customers.js       # Customer management functions
│   ├── tools.js           # Tool rental functions
│   ├── ecommerce.js       # E-commerce functions
│   └── package.json       # Functions dependencies
└── DEPLOYMENT_GUIDE.md    # This file
```

## Available Cloud Functions

### Authentication Functions
- `createUserProfile` - Create user profile on signup
- `updateLastLogin` - Update user last login timestamp
- `getUserProfile` - Get complete user profile
- `updateUserProfile` - Update user profile data
- `verifyPhoneNumber` - Verify phone number via SMS
- `getUserByPhone` - Get user by phone number

### Booking Functions
- `createBooking` - Create new service booking
- `updateBookingStatus` - Update booking status
- `getUserBookings` - Get user's bookings with pagination
- `getBookingDetails` - Get detailed booking information
- `scheduleBookingReminders` - Send booking reminders (scheduled)

### Payment Functions
- `createRazorpayOrder` - Create Razorpay payment order
- `verifyRazorpayPayment` - Verify payment signature
- `getUserPayments` - Get user's payment history
- `processRefund` - Process payment refunds

### Notification Functions
- `sendPushNotification` - Send individual push notification
- `sendBulkNotification` - Send notifications to multiple users
- `markNotificationAsRead` - Mark notification as read
- `getUserNotifications` - Get user's notifications
- `markAllNotificationsAsRead` - Mark all notifications as read

### Search Functions
- `searchServices` - Search services with filters
- `searchWorkers` - Search workers with filters
- `advancedSearch` - Advanced search with multiple filters
- `getPopularSearches` - Get trending search queries
- `recordSearchQuery` - Record search queries for analytics

## Testing

### Local Testing with Emulators
```bash
# Start all emulators
firebase emulators:start

# Start specific emulators
firebase emulators:start --only functions,firestore,auth,storage
```

### Test Functions Locally
```bash
# Test authentication
firebase functions:shell
> createUserProfile({userId: 'test-user-id'})
```

## Environment Variables Setup Script
Create `setup-env.sh` (Linux/Mac) or `setup-env.bat` (Windows):

### setup-env.sh
```bash
#!/bin/bash

echo "Setting up Firebase environment variables..."

# Razorpay
firebase functions:config:set razorpay.key_id="rzp_test_your_key_id"
firebase functions:config:set razorpay.key_secret="your_key_secret"

# Twilio (optional)
firebase functions:config:set twilio.account_sid="AC_your_account_sid"
firebase functions:config:set twilio.auth_token="your_auth_token"
firebase functions:config:set twilio.phone_number="+1234567890"

# Algolia (optional)
firebase functions:config:set algolia.app_id="your_app_id"
firebase functions:config:set algolia.api_key="your_api_key"

echo "Environment variables set successfully!"
```

## Monitoring and Logs

### View Functions Logs
```bash
# View all functions logs
firebase functions:log

# View specific function logs
firebase functions:log --only createBooking

# Follow logs in real-time
firebase functions:log --follow
```

### Performance Monitoring
1. Go to Firebase Console → Performance
2. Enable Performance Monitoring
3. Monitor function execution times and errors

## Security Checklist
- [ ] All functions validate authentication
- [ ] Firestore rules restrict access appropriately
- [ ] Storage rules validate file types and sizes
- [ ] API keys are stored in environment variables
- [ ] Input validation is implemented
- [ ] Rate limiting is considered for public endpoints

## Troubleshooting

### Common Issues
1. **Functions deployment fails**: Check Node.js version (must be 18+)
2. **Permission errors**: Ensure Firebase project is properly configured
3. **Missing environment variables**: Run setup script above
4. **Firestore rules errors**: Check rules syntax and deployment

### Debug Commands
```bash
# Check Firebase project
firebase projects:list

# Check functions status
firebase functions:list

# Get detailed error logs
firebase functions:log --limit 50
```

## Production Checklist
- [ ] All environment variables are set
- [ ] Firestore indexes are created
- [ ] Security rules are tested
- [ ] Functions are tested locally
- [ ] Error handling is implemented
- [ ] Rate limiting is configured (if needed)
- [ ] Monitoring is enabled
- [ ] Backup strategy is in place

## Support
For issues or questions:
1. Check Firebase Console logs
2. Review function error messages
3. Test with Firebase emulators locally
4. Consult Firebase documentation

## Next Steps After Deployment
1. Update frontend environment variables
2. Test all API endpoints
3. Configure frontend to use production URLs
4. Set up monitoring and alerts
5. Implement backup strategies
