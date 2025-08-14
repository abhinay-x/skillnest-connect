import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../context/LocationContext.jsx';
import { useUserBookings } from '../../hooks/useFirestore';
import Header from '../../components/ui/Header';
import { Search, MapPin, Star, Clock, Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const { currentLocation, getEffectiveLocation } = useLocation();
  const { bookings, loading: bookingsLoading } = useUserBookings(currentUser?.uid, 'customer');
  
  const [recentServices] = useState([
    { id: 1, name: 'Plumbing', icon: '🔧', count: 12 },
    { id: 2, name: 'Electrical', icon: '⚡', count: 8 },
    { id: 3, name: 'Cleaning', icon: '🧹', count: 15 },
    { id: 4, name: 'Painting', icon: '🎨', count: 6 }
  ]);

  const location = getEffectiveLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {userProfile?.profile?.firstName || userProfile?.displayName}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Find trusted professionals for your home services
          </p>
        </div>

        {/* Quick Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="md:w-64">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={location?.address?.formatted || "Enter location"}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <Link
              to="/services"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Popular Services */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Popular Services Near You
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recentServices.map(service => (
                  <Link
                    key={service.id}
                    to={`/services/${service.name.toLowerCase()}`}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{service.icon}</div>
                      <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {service.count} providers
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Bookings
                </h2>
                <Link
                  to="/bookings"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              {bookingsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.slice(0, 3).map(booking => (
                    <div key={booking.id} className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {booking.serviceName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {booking.workerName} • {new Date(booking.scheduledDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          booking.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No bookings yet</p>
                  <Link
                    to="/services"
                    className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Book Your First Service
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Link
                  to="/services"
                  className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5 mr-3 text-blue-600" />
                  Find Services
                </Link>
                
                <Link
                  to="/bookings"
                  className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Calendar className="w-5 h-5 mr-3 text-green-600" />
                  My Bookings
                </Link>
                
                <Link
                  to="/marketplace"
                  className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5 mr-3 text-purple-600" />
                  Marketplace
                </Link>
                
                <Link
                  to="/tool-rental"
                  className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Star className="w-5 h-5 mr-3 text-orange-600" />
                  Rent Tools
                </Link>
              </div>
            </div>

            {/* Location Info */}
            {location && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Your Location
                </h3>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {location.address?.city}, {location.address?.state}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {location.address?.formatted}
                    </p>
                  </div>
                </div>
                
                <button className="mt-4 text-sm text-blue-600 hover:text-blue-700">
                  Change Location
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{bookings.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="font-semibold text-green-600">
                    {bookings.filter(b => b.status === 'completed').length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
                  <span className="font-semibold text-blue-600">
                    {bookings.filter(b => b.status === 'in-progress').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
