const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const now = admin.firestore.FieldValue.serverTimestamp();

async function seedData() {
  // 1. Users
  await db.collection("users").add({
    uid: "user123",
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "+919876543210",
    userType: "customer",
    profileImage: "https://...",
    createdAt: now,
    updatedAt: now,
    isActive: true,
    location: { lat: 12.9716, lng: 77.5946 },
    address: "Bangalore, India",
    preferences: { notifications: true, theme: "light" }
  });

  // 2. Services
  await db.collection("services").add({
    name: "Plumbing Service",
    description: "Professional plumbing services...",
    category: "Home Services",
    price: 500,
    priceUnit: "per hour",
    duration: 60,
    workerId: "worker123",
    images: ["url1", "url2"],
    tags: ["plumbing", "repair", "emergency"],
    averageRating: 4.5,
    totalReviews: 25,
    isActive: true,
    location: { lat: 12.9716, lng: 77.5946 },
    availability: ["09:00", "10:00", "11:00"],
    createdAt: now,
    updatedAt: now
  });

  // 3. Bookings
  await db.collection("bookings").add({
    customerId: "customer123",
    workerId: "worker123",
    serviceId: "service123",
    serviceName: "Plumbing Service",
    bookingDate: "2024-08-15",
    bookingTime: "14:00",
    duration: 60,
    price: 500,
    status: "pending",
    address: "Customer address",
    notes: "Special instructions",
    paymentStatus: "pending",
    paymentId: "pay_123",
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    cancelledAt: null
  });

  // 4. Reviews
  await db.collection("reviews").add({
    bookingId: "booking123",
    customerId: "customer123",
    workerId: "worker123",
    serviceId: "service123",
    rating: 5,
    comment: "Great service!",
    images: ["review_image_url"],
    createdAt: now,
    updatedAt: now
  });

  // 5. Chats
  const chatRef = await db.collection("chats").add({
    participants: ["user1", "user2"],
    bookingId: "booking123",
    lastMessage: "Hello there!",
    lastMessageAt: now,
    createdAt: now,
    updatedAt: now
  });

  // Messages subcollection
  await chatRef.collection("messages").add({
    senderId: "user123",
    message: "Hello",
    type: "text",
    createdAt: now,
    read: false
  });

  // 6. Notifications
  await db.collection("notifications").add({
    userId: "user123",
    title: "New Booking",
    message: "You have a new booking request",
    type: "booking",
    data: { bookingId: "123" },
    read: false,
    createdAt: now,
    updatedAt: now
  });

  // 7. Payments
  await db.collection("payments").add({
    bookingId: "booking123",
    customerId: "customer123",
    workerId: "worker123",
    amount: 500,
    currency: "INR",
    razorpayOrderId: "order_123",
    razorpayPaymentId: "pay_123",
    razorpaySignature: "signature",
    status: "success",
    refundAmount: 0,
    createdAt: now,
    updatedAt: now
  });

  // 8. Tools
  await db.collection("tools").add({
    name: "Electric Drill",
    description: "Professional grade drill",
    category: "Power Tools",
    pricePerDay: 200,
    pricePerWeek: 1200,
    ownerId: "worker123",
    images: ["tool_image_url"],
    availability: true,
    location: { lat: 12.9716, lng: 77.5946 },
    condition: "excellent",
    specifications: { power: "500W", brand: "Bosch" },
    createdAt: now,
    updatedAt: now
  });

  // 9. Tool Rentals
  await db.collection("toolRentals").add({
    toolId: "tool123",
    customerId: "customer123",
    ownerId: "worker123",
    startDate: "2024-08-15",
    endDate: "2024-08-17",
    totalPrice: 400,
    status: "active",
    deposit: 500,
    createdAt: now,
    updatedAt: now
  });

  console.log("✅ All collections seeded successfully!");
}

seedData().then(() => process.exit()).catch(console.error);
