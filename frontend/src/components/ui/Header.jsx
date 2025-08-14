import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ user = null, cartCount = 0, bookingCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { label: 'Discover', path: '/services', icon: 'Search' },
    { label: 'Marketplace', path: '/marketplace', icon: 'ShoppingBag' },
    { label: 'Rentals', path: '/tool-rental', icon: 'Wrench' },
    { label: 'Book', path: '/booking', icon: 'Calendar' },
    { label: 'Profiles', path: '/worker/profile', icon: 'Users' }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogin = () => {
    navigate('/user-registration-login');
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    // Logout logic would go here
    setIsUserMenuOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location?.pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event?.target?.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  return (
    <header className="sticky top-0 z-100 bg-surface border-b border-border shadow-elevation-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-smooth"
            >
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-text-primary">SkillNest</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                  isActivePath(item?.path)
                    ? 'text-primary bg-primary/10' :'text-text-secondary hover:text-text-primary hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart/Booking Indicators */}
            <div className="hidden sm:flex items-center space-x-2">
              {/* Cart Indicator */}
              <button
                onClick={() => navigate('/marketplace')}
                className="relative p-2 text-text-secondary hover:text-text-primary transition-smooth"
              >
                <Icon name="ShoppingCart" size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {/* Booking Indicator */}
              <button
                onClick={() => navigate('/booking')}
                className="relative p-2 text-text-secondary hover:text-text-primary transition-smooth"
              >
                <Icon name="Calendar" size={20} />
                {bookingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-success text-success-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {bookingCount > 99 ? '99+' : bookingCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Menu */}
            <div className="relative user-menu-container">
              {user ? (
                <button
                  onClick={handleUserMenuToggle}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-smooth"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} color="white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-text-primary">
                    {user?.name}
                  </span>
                  <Icon name="ChevronDown" size={16} className="text-text-secondary" />
                </button>
              ) : (
                <Button variant="default" onClick={handleLogin}>
                  Sign In
                </Button>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-elevation-2 py-1 animate-fade-in">
                  {user ? (
                    <>
                      <button
                        onClick={() => navigate('/worker-profile-portfolio')}
                        className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                      >
                        <Icon name="User" size={16} className="mr-3" />
                        My Profile
                      </button>
                      <button
                        onClick={() => navigate('/booking-scheduling')}
                        className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                      >
                        <Icon name="Calendar" size={16} className="mr-3" />
                        My Bookings
                      </button>
                      <div className="border-t border-border my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-smooth"
                      >
                        <Icon name="LogOut" size={16} className="mr-3" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleLogin}
                        className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                      >
                        <Icon name="LogIn" size={16} className="mr-3" />
                        Sign In
                      </button>
                      <button
                        onClick={() => navigate('/user-registration-login')}
                        className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                      >
                        <Icon name="UserPlus" size={16} className="mr-3" />
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-muted transition-smooth"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface animate-slide-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`flex items-center w-full space-x-3 px-3 py-2 rounded-md text-base font-medium transition-smooth ${
                    isActivePath(item?.path)
                      ? 'text-primary bg-primary/10' :'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.label}</span>
                </button>
              ))}
              
              {/* Mobile Cart/Booking Links */}
              <div className="border-t border-border pt-2 mt-2">
                <button
                  onClick={() => handleNavigation('/e-commerce-marketplace')}
                  className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-text-secondary hover:text-text-primary hover:bg-muted transition-smooth"
                >
                  <div className="flex items-center space-x-3">
                    <Icon name="ShoppingCart" size={20} />
                    <span>Cart</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => handleNavigation('/booking-scheduling')}
                  className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-text-secondary hover:text-text-primary hover:bg-muted transition-smooth"
                >
                  <div className="flex items-center space-x-3">
                    <Icon name="Calendar" size={20} />
                    <span>Bookings</span>
                  </div>
                  {bookingCount > 0 && (
                    <span className="bg-success text-success-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {bookingCount > 99 ? '99+' : bookingCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;