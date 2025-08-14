import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUserBookings } from '../../hooks/useFirestore';
import Header from '../../components/ui/Header';
import { DollarSign, Clock, Star, Users, Calendar, MapPin, Bell, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorkerDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const { bookings, loading: bookingsLoading } = useUserBookings(currentUser?.uid, 'worker');
  
  const [isAvailable, setIsAvailable] = useState(true);
  const [todayEarnings] = useState(450);
  const [monthlyEarnings] = useState(12500);
  const [rating] = useState(4.8);
  const [completedJobs] = useState(127);

  const todayBookings = bookings.filter(booking => {
    const today = new Date().toDateString();
    return new Date(booking.scheduledDate).toDateString() === today;
  });

  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  const activeBookings = bookings.filter(booking => booking.status === 'in-progress');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {userProfile?.profile?.firstName || userProfile?.displayName}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your services and grow your business
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-3">Available</span>
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAvailable ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAvailable ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <Link
              to="/worker/profile"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Profile
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Today's Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{todayEarnings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{monthlyEarnings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{rating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed Jobs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedJobs}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Schedule */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Today's Schedule
                </h2>
                <Link
                  to="/worker/schedule"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              {todayBookings.length > 0 ? (
                <div className="space-y-4">
                  {todayBookings.map(booking => (
                    <div key={booking.id} className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {booking.serviceName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {booking.customerName} • {booking.scheduledTime}
                        </p>
                        <div className="flex items-center mt-2">
                          <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {booking.address}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          ₹{booking.amount}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          booking.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
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
                  <p className="text-gray-500 dark:text-gray-400">No bookings scheduled for today</p>
                </div>
              )}
            </div>

            {/* Pending Requests */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Pending Requests
                  {pendingBookings.length > 0 && (
                    <span className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-full text-xs">
                      {pendingBookings.length}
                    </span>
                  )}
                </h2>
                <Link
                  to="/worker/requests"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              {pendingBookings.length > 0 ? (
                <div className="space-y-4">
                  {pendingBookings.slice(0, 3).map(booking => (
                    <div key={booking.id} className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {booking.serviceName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {booking.customerName} • {new Date(booking.scheduledDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                          Accept
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No pending requests</p>
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
                  to="/worker/requests"
                  className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 mr-3 text-blue-600" />
                  Job Requests
                  {pendingBookings.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {pendingBookings.length}
                    </span>
                  )}
                </Link>
                
                <Link
                  to="/worker/schedule"
                  className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Calendar className="w-5 h-5 mr-3 text-green-600" />
                  My Schedule
                </Link>
                
                <Link
                  to="/worker/earnings"
                  className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <DollarSign className="w-5 h-5 mr-3 text-purple-600" />
                  Earnings
                </Link>
                
                <Link
                  to="/worker/profile"
                  className="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 mr-3 text-orange-600" />
                  Profile & Settings
                </Link>
              </div>
            </div>

            {/* Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Performance
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Response Rate</span>
                  <span className="font-semibold text-gray-900 dark:text-white">95%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">On-time Rate</span>
                  <span className="font-semibold text-green-600">98%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
                  <span className="font-semibold text-blue-600">{rating}/5.0</span>
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Reviews
              </h3>
              
              <div className="space-y-4">
                <div className="border-l-4 border-yellow-400 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    "Excellent work! Very professional and punctual."
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    - Priya S.
                  </p>
                </div>
                
                <div className="border-l-4 border-yellow-400 pl-4">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4].map(star => (
                        <Star key={star} className="w-4 h-4 fill-current" />
                      ))}
                      <Star className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    "Good service, completed on time."
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    - Rahul M.
                  </p>
                </div>
              </div>
              
              <Link
                to="/worker/reviews"
                className="block mt-4 text-sm text-blue-600 hover:text-blue-700"
              >
                View All Reviews
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkerDashboard;
