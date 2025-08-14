import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ChatList from '../components/chat/ChatList';
import PaymentCheckout from '../components/payment/PaymentCheckout';
import LocationPicker from '../components/maps/LocationPicker';
import AdminDashboard from '../components/admin/AdminDashboard';
import NotificationPanel from '../components/notifications/NotificationPanel';
import FileUpload from '../components/upload/FileUpload';
import SearchFilter from '../components/search/SearchFilter';
import { pushNotificationService } from '../services/firebase/pushNotifications';
import { MessageCircle, CreditCard, MapPin, Bell, Upload, Search, Settings } from 'lucide-react';

const AdvancedFeaturesDemo = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    // Initialize push notifications
    const initNotifications = async () => {
      if ('Notification' in window) {
        const permission = Notification.permission;
        setNotificationPermission(permission);
        
        if (permission === 'granted') {
          const token = await pushNotificationService.getToken();
          if (token && user) {
            await pushNotificationService.saveTokenToFirestore(user.uid, token);
          }
        }
      }
    };

    initNotifications();

    // Listen for foreground messages
    const unsubscribe = pushNotificationService.onMessageReceived((payload) => {
      console.log('Foreground message received:', payload);
      // Show in-app notification
    });

    return unsubscribe;
  }, [user]);

  const requestNotificationPermission = async () => {
    const token = await pushNotificationService.requestPermission();
    if (token && user) {
      await pushNotificationService.saveTokenToFirestore(user.uid, token);
      setNotificationPermission('granted');
    }
  };

  const handleFileUpload = (uploadedFiles) => {
    console.log('Files uploaded:', uploadedFiles);
    // Handle uploaded files
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    // Handle successful payment
  };

  const handleLocationSelect = (location) => {
    console.log('Location selected:', location);
    // Handle location selection
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const tabs = [
    { id: 'chat', label: 'Real-time Chat', icon: MessageCircle },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'maps', label: 'Location Services', icon: MapPin },
    { id: 'admin', label: 'Admin Dashboard', icon: Settings },
    { id: 'upload', label: 'File Upload', icon: Upload },
    { id: 'search', label: 'Search & Filter', icon: Search }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Active Chats</h3>
              <ChatList />
            </div>
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Chat Interface</h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Select a chat from the list to start messaging. Real-time messaging powered by Socket.io.
                </p>
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Checkout</h3>
            <PaymentCheckout
              booking={{
                id: 'demo-booking-123',
                serviceName: 'Home Cleaning Service',
                date: '2024-01-15',
                time: '14:00',
                duration: 3,
                basePrice: 1500,
                workerName: 'John Doe'
              }}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={(error) => console.error('Payment failed:', error)}
            />
          </div>
        );

      case 'maps':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Location Picker</h3>
            <LocationPicker
              onLocationSelect={handleLocationSelect}
              defaultLocation={{
                lat: 12.9716,
                lng: 77.5946,
                address: 'Bangalore, India'
              }}
            />
          </div>
        );

      case 'admin':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Admin Dashboard</h3>
            <AdminDashboard />
          </div>
        );

      case 'upload':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">File Upload</h3>
            <FileUpload
              onFileUpload={handleFileUpload}
              maxFiles={3}
              maxSize={2 * 1024 * 1024} // 2MB
              acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
              folder="demo-uploads"
            />
          </div>
        );

      case 'search':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Search & Filter</h3>
              <SearchFilter
                entityType="services"
                onResultsChange={handleSearchResults}
              />
            </div>
            <div className="lg:col-span-3">
              <h3 className="text-lg font-semibold mb-4">Search Results ({searchResults.length})</h3>
              <div className="space-y-4">
                {searchResults.length > 0 ? (
                  searchResults.map((item, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold">₹{item.price}</span>
                        <span className="text-sm text-gray-500">{item.category}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No results found. Try adjusting your search criteria.
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Advanced Features Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore all the advanced features integrated into SkillNest
          </p>
        </div>

        {/* Notification Permission */}
        {notificationPermission === 'default' && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100">
                  Enable Push Notifications
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Stay updated with real-time notifications
                </p>
              </div>
              <button
                onClick={requestNotificationPermission}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Enable
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {renderContent()}
        </div>

        {/* Notification Panel */}
        {showNotifications && (
          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        )}

        {/* Floating Notification Button */}
        <button
          onClick={() => setShowNotifications(true)}
          className="fixed bottom-6 right-6 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <Bell className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default AdvancedFeaturesDemo;
