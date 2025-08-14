import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SearchHeader from '../../components/ui/SearchHeader';
import Breadcrumb from '../../components/ui/Breadcrumb';
import CategoryBanner from './components/CategoryBanner';
import FilterSidebar from './components/FilterSidebar';
import ProductGrid from './components/ProductGrid';
import SortDropdown from './components/SortDropdown';
import VisualSearch from './components/VisualSearch';
import ShoppingCart from './components/ShoppingCart';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ECommerceMarketplace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    price: { min: '', max: '' },
    brands: [],
    rating: null,
    availability: {
      inStock: false,
      sameDayDelivery: false,
      freeDelivery: false,
      rentalAvailable: false
    },
    location: {
      pickup: false,
      localStock: false
    }
  });
  
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wishlistedItems, setWishlistedItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // Mock data
  const categories = [
    {
      id: 'hand-tools',
      name: 'Hand Tools',
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
      itemCount: 245
    },
    {
      id: 'power-tools',
      name: 'Power Tools',
      image: 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg',
      itemCount: 189
    },
    {
      id: 'construction',
      name: 'Construction Materials',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg',
      itemCount: 156
    },
    {
      id: 'safety',
      name: 'Safety Equipment',
      image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg',
      itemCount: 98
    },
    {
      id: 'hardware',
      name: 'Hardware',
      image: 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg',
      itemCount: 312
    },
    {
      id: 'measuring',
      name: 'Measuring Tools',
      image: 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg',
      itemCount: 87
    }
  ];

  const mockProducts = [
    {
      id: 'p1',
      name: 'Professional Cordless Drill Set with 20V Battery',
      price: 2499,
      originalPrice: 3299,
      image: 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg',
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      stock: 15,
      deliveryTime: 'Same day delivery',
      hasRentalOption: true,
      category: 'power-tools'
    },
    {
      id: 'p2',
      name: 'Heavy Duty Hammer Set - 3 Pieces',
      price: 899,
      originalPrice: 1199,
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
      rating: 4.2,
      reviewCount: 89,
      inStock: true,
      stock: 8,
      deliveryTime: 'Next day delivery',
      hasRentalOption: false,
      category: 'hand-tools'
    },
    {
      id: 'p3',
      name: 'Safety Helmet with LED Light',
      price: 1299,
      originalPrice: 1599,
      image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg',
      rating: 4.7,
      reviewCount: 156,
      inStock: true,
      stock: 25,
      deliveryTime: 'Same day delivery',
      hasRentalOption: false,
      category: 'safety'
    },
    {
      id: 'p4',
      name: 'Digital Measuring Tape - 50m Range',
      price: 1899,
      originalPrice: 2299,
      image: 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg',
      rating: 4.3,
      reviewCount: 67,
      inStock: true,
      stock: 12,
      deliveryTime: 'Next day delivery',
      hasRentalOption: true,
      category: 'measuring'
    },
    {
      id: 'p5',
      name: 'Cement Bag - 50kg Premium Quality',
      price: 399,
      originalPrice: 449,
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg',
      rating: 4.1,
      reviewCount: 234,
      inStock: true,
      stock: 3,
      deliveryTime: '2-3 days delivery',
      hasRentalOption: false,
      category: 'construction'
    },
    {
      id: 'p6',
      name: 'Screwdriver Set - 12 Pieces Professional',
      price: 699,
      originalPrice: 899,
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
      rating: 4.4,
      reviewCount: 145,
      inStock: false,
      stock: 0,
      deliveryTime: 'Out of stock',
      hasRentalOption: false,
      category: 'hand-tools'
    }
  ];

  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  // Initialize from URL params or state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams?.get('q') || location?.state?.query || '';
    const category = urlParams?.get('category') || '';
    
    setSearchQuery(query);
    setSelectedCategory(category);
  }, [location]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory) {
      filtered = filtered?.filter(product => product?.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered?.filter(product =>
        product?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Price filter
    if (filters?.price?.min || filters?.price?.max) {
      filtered = filtered?.filter(product => {
        const price = product?.price;
        const min = filters?.price?.min ? parseFloat(filters?.price?.min) : 0;
        const max = filters?.price?.max ? parseFloat(filters?.price?.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Brand filter
    if (filters?.brands?.length > 0) {
      // Mock brand filtering - in real app, products would have brand property
      filtered = filtered?.filter(product => 
        filters?.brands?.some(brand => product?.name?.toLowerCase()?.includes(brand?.toLowerCase()))
      );
    }

    // Rating filter
    if (filters?.rating) {
      filtered = filtered?.filter(product => product?.rating >= filters?.rating);
    }

    // Availability filters
    if (filters?.availability?.inStock) {
      filtered = filtered?.filter(product => product?.inStock);
    }

    if (filters?.availability?.rentalAvailable) {
      filtered = filtered?.filter(product => product?.hasRentalOption);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low-high':
        filtered?.sort((a, b) => a?.price - b?.price);
        break;
      case 'price-high-low':
        filtered?.sort((a, b) => b?.price - a?.price);
        break;
      case 'rating':
        filtered?.sort((a, b) => b?.rating - a?.rating);
        break;
      case 'newest':
        // Mock newest sort
        filtered?.sort((a, b) => b?.id?.localeCompare(a?.id));
        break;
      case 'popularity':
        filtered?.sort((a, b) => b?.reviewCount - a?.reviewCount);
        break;
      case 'discount':
        filtered?.sort((a, b) => {
          const discountA = a?.originalPrice ? ((a?.originalPrice - a?.price) / a?.originalPrice) : 0;
          const discountB = b?.originalPrice ? ((b?.originalPrice - b?.price) / b?.originalPrice) : 0;
          return discountB - discountA;
        });
        break;
      default:
        // Relevance - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, filters, sortBy]);

  // Event handlers
  const handleSearch = ({ query, location }) => {
    setSearchQuery(query);
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      price: { min: '', max: '' },
      brands: [],
      rating: null,
      availability: {
        inStock: false,
        sameDayDelivery: false,
        freeDelivery: false,
        rentalAvailable: false
      },
      location: {
        pickup: false,
        localStock: false
      }
    });
  };

  const handleAddToCart = async (product) => {
    const existingItem = cartItems?.find(item => item?.id === product?.id);
    
    if (existingItem) {
      setCartItems(prev =>
        prev?.map(item =>
          item?.id === product?.id
            ? { ...item, quantity: item?.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const handleToggleWishlist = (productId) => {
    setWishlistedItems(prev =>
      prev?.includes(productId)
        ? prev?.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleProductClick = (product) => {
    // In a real app, this would navigate to product detail page
    console.log('Product clicked:', product);
  };

  const handleVisualSearch = (results) => {
    setProducts(results);
    setIsVisualSearchOpen(false);
  };

  const handleUpdateCartQuantity = (itemId, quantity) => {
    setCartItems(prev =>
      prev?.map(item =>
        item?.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems(prev => prev?.filter(item => item?.id !== itemId));
  };

  const handleCheckout = async () => {
    // Mock checkout process
    await new Promise(resolve => setTimeout(resolve, 2000));
    navigate('/booking-scheduling', { state: { fromCheckout: true } });
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (filters?.price?.min || filters?.price?.max) count++;
    if (filters?.brands?.length > 0) count++;
    if (filters?.rating) count++;
    if (Object.values(filters?.availability)?.some(Boolean)) count++;
    if (Object.values(filters?.location)?.some(Boolean)) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartCount={cartItems?.reduce((sum, item) => sum + item?.quantity, 0)}
        bookingCount={0}
      />
      <SearchHeader onSearch={handleSearch} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb />
        
        {/* Category Banner */}
        <CategoryBanner
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        <div className="flex lg:space-x-6 mt-6">
          {/* Desktop Filter Sidebar */}
          <FilterSidebar
            isOpen={isFilterSidebarOpen}
            onClose={() => setIsFilterSidebarOpen(false)}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isMobile={false}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  onClick={() => setIsFilterSidebarOpen(true)}
                  iconName="Filter"
                  iconPosition="left"
                  className="lg:hidden"
                >
                  Filters
                  {activeFiltersCount() > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFiltersCount()}
                    </span>
                  )}
                </Button>

                {/* Visual Search Button */}
                <Button
                  variant="outline"
                  onClick={() => setIsVisualSearchOpen(true)}
                  iconName="Camera"
                  iconPosition="left"
                >
                  Visual Search
                </Button>

                {/* Results Count */}
                <span className="text-sm text-text-secondary">
                  {filteredProducts?.length} products found
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Cart Button */}
                <Button
                  variant="outline"
                  onClick={() => setIsCartOpen(true)}
                  iconName="ShoppingCart"
                  iconPosition="left"
                >
                  Cart ({cartItems?.reduce((sum, item) => sum + item?.quantity, 0)})
                </Button>

                {/* Sort Dropdown */}
                <SortDropdown
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount() > 0 && (
              <div className="flex items-center space-x-2 mb-6 flex-wrap">
                <span className="text-sm text-text-secondary">Active filters:</span>
                {filters?.price?.min || filters?.price?.max ? (
                  <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    Price: ₹{filters?.price?.min || '0'} - ₹{filters?.price?.max || '∞'}
                    <button
                      onClick={() => handleFilterChange('price', { min: '', max: '' })}
                      className="ml-2 hover:text-primary/80"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </span>
                ) : null}
                {filters?.brands?.map(brand => (
                  <span key={brand} className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {brand}
                    <button
                      onClick={() => handleFilterChange('brands', filters?.brands?.filter(b => b !== brand))}
                      className="ml-2 hover:text-primary/80"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </span>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* Product Grid */}
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              onProductClick={handleProductClick}
              wishlistedItems={wishlistedItems}
              emptyStateMessage={
                searchQuery || selectedCategory || activeFiltersCount() > 0
                  ? "No products match your criteria" : "No products available"
              }
            />
          </div>
        </div>
      </main>
      {/* Mobile Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        isMobile={true}
      />
      {/* Visual Search Modal */}
      <VisualSearch
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
        onSearch={handleVisualSearch}
      />
      {/* Shopping Cart */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default ECommerceMarketplace;