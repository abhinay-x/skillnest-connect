import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useBookings, useOrders, useRentals } from '../../hooks/useFirebaseFunction';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const MyBookings = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Firebase hooks
  const { getUserBookings } = useBookings();
  const { getUserOrders } = useOrders();
  const { getUserRentals } = useRentals();

  // Fetch all booking data
  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [bookingsResult, ordersResult, rentalsResult] = await Promise.allSettled([
        getUserBookings('customer'),
        getUserOrders(),
        getUserRentals()
      ]);
      
      const allData = [];
      
      // Process service bookings
      if (bookingsResult.status === 'fulfilled' && bookingsResult.value?.bookings) {
        const serviceBookings = bookingsResult.value.bookings.map(booking => ({
          ...booking,
          type: 'service',
          date: booking.bookingDate,
          time: booking.bookingTime,
          amount: booking.totalAmount,
          service: {
            name: booking.serviceName,
            category: booking.serviceCategory || 'Service',
            worker: booking.workerName,
            workerImage: booking.workerImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
          },
          description: booking.notes
        }));
        allData.push(...serviceBookings);
      }
      
      // Process marketplace orders
      if (ordersResult.status === 'fulfilled' && ordersResult.value?.orders) {
        const marketplaceOrders = ordersResult.value.orders.map(order => ({
          ...order,
          type: 'marketplace',
          orderDate: order.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
          deliveryDate: order.deliveryDate,
          amount: order.totalAmount,
          address: order.deliveryAddress?.street ? 
            `${order.deliveryAddress.street}, ${order.deliveryAddress.city}` : 
            order.deliveryAddress
        }));
        allData.push(...marketplaceOrders);
      }
      
      // Process rentals
      if (rentalsResult.status === 'fulfilled' && rentalsResult.value?.rentals) {
        const rentalBookings = rentalsResult.value.rentals.map(rental => ({
          ...rental,
          type: 'rental',
          amount: rental.totalAmount,
          address: rental.deliveryAddress?.street ? 
            `${rental.deliveryAddress.street}, ${rental.deliveryAddress.city}` : 
            rental.deliveryAddress
        }));
        allData.push(...rentalBookings);
      }
      
      // Sort by creation date (newest first)
      allData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date();
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date();
        return dateB - dateA;
      });
      
      setAllBookings(allData);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAllBookings();
    }
  }, [currentUser]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-primary bg-primary/10';
      case 'active': return 'text-success bg-success/10';
      case 'completed': return 'text-success bg-success/10';
      case 'shipped': return 'text-warning bg-warning/10';
      case 'delivered': return 'text-success bg-success/10';
      case 'cancelled': return 'text-destructive bg-destructive/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return 'CheckCircle';
      case 'active': return 'Play';
      case 'completed': return 'CheckCircle2';
      case 'shipped': return 'Truck';
      case 'delivered': return 'Package';
      case 'cancelled': return 'XCircle';
      default: return 'Clock';
    }
  };

  const filteredBookings = allBookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'services') return booking.type === 'service';
    if (activeTab === 'marketplace') return booking.type === 'marketplace';
    if (activeTab === 'rentals') return booking.type === 'rental';
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All Bookings', count: allBookings.length },
    { id: 'services', label: 'Services', count: allBookings.filter(b => b.type === 'service').length },
    { id: 'marketplace', label: 'Orders', count: allBookings.filter(b => b.type === 'marketplace').length },
    { id: 'rentals', label: 'Rentals', count: allBookings.filter(b => b.type === 'rental').length }
  ];

  const renderServiceBooking = (booking) => (
    <div key={booking.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Wrench" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{booking.service.name}</h3>
            <p className="text-sm text-text-secondary">{booking.service.category}</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <Image src={booking.service.workerImage} alt={booking.service.worker} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-text-secondary">{booking.service.worker}</span>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
          <Icon name={getStatusIcon(booking.status)} size={12} className="inline mr-1" />
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm text-text-secondary">Date & Time</p>
          <p className="font-medium text-text-primary">{formatDate(booking.date)} at {booking.time}</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary">Amount</p>
          <p className="font-medium text-text-primary">{formatPrice(booking.amount)}</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary">Booking ID</p>
          <p className="font-medium text-text-primary font-mono">{booking.id}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-text-secondary mb-1">Address</p>
        <p className="text-sm text-text-primary">{booking.address}</p>
      </div>
      
      {booking.description && (
        <div className="mb-4">
          <p className="text-sm text-text-secondary mb-1">Description</p>
          <p className="text-sm text-text-primary">{booking.description}</p>
        </div>
      )}
      
      <div className="flex space-x-3">
        <Button variant="outline" size="sm" iconName="MessageCircle" iconPosition="left">
          Contact Worker
        </Button>
        {booking.status === 'confirmed' && (
          <Button variant="outline" size="sm" iconName="Calendar" iconPosition="left">
            Reschedule
          </Button>
        )}
        <Button variant="outline" size="sm" iconName="FileText" iconPosition="left">
          View Details
        </Button>
      </div>
    </div>
  );

  const renderMarketplaceOrder = (booking) => (
    <div key={booking.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="ShoppingBag" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Marketplace Order</h3>
            <p className="text-sm text-text-secondary">{booking.items.length} item{booking.items.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
          <Icon name={getStatusIcon(booking.status)} size={12} className="inline mr-1" />
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-text-secondary mb-2">Items</p>
        <div className="space-y-2">
          {booking.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-text-primary">{item.name} (x{item.quantity})</span>
              <span className="text-text-primary">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm text-text-secondary">Order Date</p>
          <p className="font-medium text-text-primary">{formatDate(booking.orderDate)}</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary">Delivery Date</p>
          <p className="font-medium text-text-primary">{formatDate(booking.deliveryDate)}</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary">Total Amount</p>
          <p className="font-medium text-text-primary">{formatPrice(booking.amount)}</p>
        </div>
      </div>
      
      {booking.trackingId && (
        <div className="mb-4">
          <p className="text-sm text-text-secondary mb-1">Tracking ID</p>
          <p className="font-medium text-text-primary font-mono">{booking.trackingId}</p>
        </div>
      )}
      
      <div className="flex space-x-3">
        <Button variant="outline" size="sm" iconName="Truck" iconPosition="left">
          Track Order
        </Button>
        <Button variant="outline" size="sm" iconName="FileText" iconPosition="left">
          View Invoice
        </Button>
        {booking.status === 'delivered' && (
          <Button variant="outline" size="sm" iconName="Star" iconPosition="left">
            Rate & Review
          </Button>
        )}
      </div>
    </div>
  );

  const renderRentalBooking = (booking) => (
    <div key={booking.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Tool Rental</h3>
            <p className="text-sm text-text-secondary">{booking.items.length} item{booking.items.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
          <Icon name={getStatusIcon(booking.status)} size={12} className="inline mr-1" />
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-text-secondary mb-2">Rental Items</p>
        <div className="space-y-2">
          {booking.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-text-primary">{item.name} (x{item.quantity})</span>
              <span className="text-text-primary">{formatPrice(item.pricePerDay)}/day</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm text-text-secondary">Rental Period</p>
          <p className="font-medium text-text-primary">
            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
          </p>
        </div>
        <div>
          <p className="text-sm text-text-secondary">Rental Amount</p>
          <p className="font-medium text-text-primary">{formatPrice(booking.amount)}</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary">Security Deposit</p>
          <p className="font-medium text-warning">{formatPrice(booking.securityDeposit)}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-text-secondary mb-1">
          {booking.pickupOption === 'delivery' ? 'Delivery Address' : 'Pickup Location'}
        </p>
        <p className="text-sm text-text-primary">{booking.address}</p>
      </div>
      
      <div className="flex space-x-3">
        <Button variant="outline" size="sm" iconName="MessageCircle" iconPosition="left">
          Contact Support
        </Button>
        {booking.status === 'active' && (
          <Button variant="outline" size="sm" iconName="Calendar" iconPosition="left">
            Extend Rental
          </Button>
        )}
        <Button variant="outline" size="sm" iconName="FileText" iconPosition="left">
          View Agreement
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading your bookings...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="AlertCircle" size={24} className="text-destructive" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Error Loading Bookings</h3>
              <p className="text-text-secondary mb-6">{error}</p>
              <Button onClick={fetchAllBookings} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb />
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">My Bookings</h1>
              <p className="text-text-secondary mt-2">Manage your services, orders, and rentals</p>
            </div>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => navigate('/services')}
            >
              New Booking
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-muted text-text-secondary'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Calendar" size={32} className="text-text-secondary" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">No bookings found</h3>
              <p className="text-text-secondary mb-6">
                {activeTab === 'all' 
                  ? "You haven't made any bookings yet."
                  : `No ${activeTab} bookings found.`
                }
              </p>
              <Button
                variant="default"
                onClick={() => navigate('/services')}
                iconName="Plus"
                iconPosition="left"
              >
                Make Your First Booking
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => {
                switch (booking.type) {
                  case 'service':
                    return renderServiceBooking(booking);
                  case 'marketplace':
                    return renderMarketplaceOrder(booking);
                  case 'rental':
                    return renderRentalBooking(booking);
                  default:
                    return null;
                }
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyBookings;
