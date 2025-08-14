import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Route to breadcrumb mapping
  const routeMap = {
    '/': { label: 'Home', icon: 'Home' },
    '/service-discovery-search': { label: 'Discover Services', icon: 'Search' },
    '/worker-profile-portfolio': { label: 'Professional Profiles', icon: 'Users' },
    '/booking-scheduling': { label: 'Book Service', icon: 'Calendar' },
    '/e-commerce-marketplace': { label: 'Marketplace', icon: 'ShoppingBag' },
    '/tool-rental-system': { label: 'Tool Rentals', icon: 'Wrench' },
    '/user-registration-login': { label: 'Account', icon: 'User' }
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [{ label: 'Home', path: '/', icon: 'Home' }];

    if (pathSegments?.length > 0) {
      const currentPath = `/${pathSegments?.join('/')}`;
      const routeInfo = routeMap?.[currentPath];
      
      if (routeInfo) {
        breadcrumbs?.push({
          label: routeInfo?.label,
          path: currentPath,
          icon: routeInfo?.icon
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page or if only home breadcrumb
  if (location?.pathname === '/' || breadcrumbs?.length <= 1) {
    return null;
  }

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6" aria-label="Breadcrumb">
      {breadcrumbs?.map((breadcrumb, index) => (
        <div key={breadcrumb?.path} className="flex items-center space-x-2">
          {index > 0 && (
            <Icon name="ChevronRight" size={16} className="text-text-secondary" />
          )}
          
          {index === breadcrumbs?.length - 1 ? (
            // Current page - not clickable
            (<div className="flex items-center space-x-1 text-text-primary font-medium">
              <Icon name={breadcrumb?.icon} size={16} />
              <span>{breadcrumb?.label}</span>
            </div>)
          ) : (
            // Clickable breadcrumb
            (<button
              onClick={() => handleBreadcrumbClick(breadcrumb?.path)}
              className="flex items-center space-x-1 hover:text-text-primary transition-smooth"
            >
              <Icon name={breadcrumb?.icon} size={16} />
              <span>{breadcrumb?.label}</span>
            </button>)
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;