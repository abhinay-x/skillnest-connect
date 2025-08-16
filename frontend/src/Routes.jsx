import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

// Auth Pages
import AuthPage from "./pages/auth/AuthPage";
import Onboarding from "./pages/Onboarding";

// Customer Pages
import CustomerDashboard from "./pages/customer/Dashboard";
import CustomerProfile from "./pages/customer/Profile";
import ServiceDiscoverySearch from './pages/service-discovery-search';
import BookingScheduling from './pages/booking-scheduling';
import MyBookings from './pages/my-bookings';
import ProfilesPage from './pages/profiles';
import ECommerceMarketplace from './pages/e-commerce-marketplace';
import ToolRentalSystem from './pages/tool-rental-system';
import CartPage from './pages/cart';
import MarketplaceCheckout from './pages/marketplace-checkout';
import RentalCheckout from './pages/rental-checkout';

// Worker Pages
import WorkerDashboard from "./pages/worker/Dashboard";
import WorkerProfilePortfolio from './pages/worker-profile-portfolio';

// Common Pages
import Home from "./pages/Home";
import NotFound from "pages/NotFound";
import OrderConfirmation from './pages/order-confirmation';

// Unauthorized Page Component
const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">403</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          You don't have permission to access this page.
        </p>
        <a
          href="/dashboard"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Header />
        <RouterRoutes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          
          {/* Onboarding Route */}
          <Route 
            path="/onboarding" 
            element={<Onboarding />}
          />
          
          {/* Auth Routes (only accessible when not logged in) */}
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false} redirectTo="/dashboard">
                <AuthPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <ProtectedRoute requireAuth={false} redirectTo="/dashboard">
                <AuthPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <ProtectedRoute requireAuth={false} redirectTo="/dashboard">
                <AuthPage />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes - Customer */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/services" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'worker']}>
                <ServiceDiscoverySearch />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/services/:category" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'worker']}>
                <ServiceDiscoverySearch />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <BookingScheduling />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'worker']}>
                <MyBookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'worker']}>
                <MyBookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profiles" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'worker']}>
                <ProfilesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/marketplace" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'worker']}>
                <ECommerceMarketplace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'worker']}>
                <CartPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tool-rental" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'worker']}>
                <ToolRentalSystem />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/marketplace-checkout" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'worker']}>
                <MarketplaceCheckout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/rental-checkout" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'worker']}>
                <RentalCheckout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-confirmation" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'worker']}>
                <OrderConfirmation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customer/profile" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerProfile />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes - Worker */}
          <Route 
            path="/worker/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['worker']}>
                <WorkerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/worker/profile" 
            element={
              <ProtectedRoute allowedRoles={['worker']}>
                <WorkerProfilePortfolio />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profiles" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'worker']}>
                <WorkerProfilePortfolio />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/worker/requests" 
            element={
              <ProtectedRoute allowedRoles={['worker']}>
                <WorkerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/worker/schedule" 
            element={
              <ProtectedRoute allowedRoles={['worker']}>
                <WorkerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/worker/earnings" 
            element={
              <ProtectedRoute allowedRoles={['worker']}>
                <WorkerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/worker/reviews" 
            element={
              <ProtectedRoute allowedRoles={['worker']}>
                <WorkerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                  <p>Admin features coming soon...</p>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Legacy Routes - Redirect to new structure */}
          <Route path="/user-registration-login" element={<Navigate to="/login" replace />} />
          <Route path="/booking-scheduling" element={<Navigate to="/booking" replace />} />
          <Route path="/service-discovery-search" element={<Navigate to="/services" replace />} />
          <Route path="/worker-profile-portfolio" element={<Navigate to="/worker/profile" replace />} />
          <Route path="/e-commerce-marketplace" element={<Navigate to="/marketplace" replace />} />
          <Route path="/tool-rental-system" element={<Navigate to="/tool-rental" replace />} />

          {/* Utility Routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
        <Footer />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
