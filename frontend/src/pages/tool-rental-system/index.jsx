import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchHeader from '../../components/ui/SearchHeader';
import Breadcrumb from '../../components/ui/Breadcrumb';
import CategorySelector from './components/CategorySelector';
import RentalFilters from './components/RentalFilters';
import ToolCard from './components/ToolCard';
import RentalCalculator from './components/RentalCalculator';
import AvailabilityCalendar from './components/AvailabilityCalendar';
import QualityAssurance from './components/QualityAssurance';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ToolRentalSystem = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const [rentalDetails, setRentalDetails] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('relevance');

  // Mock data for categories
  const categories = [
    {
      id: 1,
      name: "Construction Equipment",
      image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
      availableCount: 45
    },
    {
      id: 2,
      name: "Power Tools",
      image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
      availableCount: 78
    },
    {
      id: 3,
      name: "Measurement Tools",
      image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
      availableCount: 32
    },
    {
      id: 4,
      name: "Transportation",
      image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
      availableCount: 18
    },
    {
      id: 5,
      name: "Home Improvement",
      image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
      availableCount: 56
    },
    {
      id: 6,
      name: "Gardening",
      image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
      availableCount: 29
    }
  ];

  // Mock data for tools
  const tools = [
    {
      id: 1,
      name: "Professional Circular Saw",
      description: "High-performance circular saw perfect for precision cutting in construction and woodworking projects.",
      image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
      category: 1,
      available: true,
      featured: true,
      rating: 4.8,
      condition: "Excellent",
      location: "Sector 15, Gurgaon",
      specifications: {
        power: "1800W",
        weight: "4.2 kg",
        bladeSize: "190mm"
      },
      pricing: {
        hourly: 150,
        daily: 800,
        weekly: 4500,
        monthly: 15000
      },
      operatorCost: 500,
      trainingCost: 1000,
      deliveryCost: 200,
      securityDeposit: 5000,
      unavailableDates: ['2025-08-16', '2025-08-17'],
      maintenanceDates: ['2025-08-20'],
      inspectionImages: [
        {
          id: 1,
          url: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
          title: "Overall Condition",
          description: "Tool exterior and general condition"
        }
      ]
    },
    {
      id: 2,
      name: "Heavy Duty Drill Machine",
      description: "Powerful drill machine suitable for concrete, metal, and wood drilling applications.",
      image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
      category: 2,
      available: true,
      featured: false,
      rating: 4.6,
      condition: "Good",
      location: "DLF Phase 2, Gurgaon",
      specifications: {
        power: "1200W",
        weight: "2.8 kg",
        chuckSize: "13mm"
      },
      pricing: {
        hourly: 100,
        daily: 600,
        weekly: 3500,
        monthly: 12000
      },
      operatorCost: 400,
      trainingCost: 800,
      deliveryCost: 150,
      securityDeposit: 3000,
      unavailableDates: ['2025-08-18'],
      maintenanceDates: [],
      inspectionImages: []
    },
    {
      id: 3,
      name: "Digital Laser Level",
      description: "Precision laser level for accurate measurements and alignment in construction projects.",
      image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
      category: 3,
      available: false,
      featured: false,
      rating: 4.9,
      condition: "Excellent",
      location: "Cyber City, Gurgaon",
      specifications: {
        power: "Battery",
        weight: "1.5 kg",
        range: "30m"
      },
      pricing: {
        hourly: 80,
        daily: 400,
        weekly: 2500,
        monthly: 8000
      },
      operatorCost: 300,
      trainingCost: 600,
      deliveryCost: 100,
      securityDeposit: 2000,
      unavailableDates: ['2025-08-14', '2025-08-15', '2025-08-16'],
      maintenanceDates: [],
      inspectionImages: []
    },
    {
      id: 4,
      name: "Mini Excavator",
      description: "Compact excavator perfect for small construction and landscaping projects.",
      image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
      category: 1,
      available: true,
      featured: true,
      rating: 4.7,
      condition: "Good",
      location: "Sohna Road, Gurgaon",
      specifications: {
        power: "25HP",
        weight: "2500 kg",
        bucketSize: "0.5m³"
      },
      pricing: {
        hourly: 1200,
        daily: 8000,
        weekly: 50000,
        monthly: 180000
      },
      operatorCost: 1500,
      trainingCost: 3000,
      deliveryCost: 1000,
      securityDeposit: 50000,
      unavailableDates: [],
      maintenanceDates: ['2025-08-25'],
      inspectionImages: []
    },
    {
      id: 5,
      name: "Paint Sprayer Pro",
      description: "Professional paint sprayer for efficient and smooth painting of large surfaces.",
      image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
      category: 5,
      available: true,
      featured: false,
      rating: 4.5,
      condition: "Good",
      location: "Golf Course Road, Gurgaon",
      specifications: {
        power: "650W",
        weight: "3.2 kg",
        capacity: "1.5L"
      },
      pricing: {
        hourly: 120,
        daily: 700,
        weekly: 4000,
        monthly: 14000
      },
      operatorCost: 450,
      trainingCost: 900,
      deliveryCost: 180,
      securityDeposit: 4000,
      unavailableDates: ['2025-08-19'],
      maintenanceDates: [],
      inspectionImages: []
    },
    {
      id: 6,
      name: "Lawn Mower Electric",
      description: "Eco-friendly electric lawn mower for maintaining gardens and lawns efficiently.",
      image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
      category: 6,
      available: true,
      featured: false,
      rating: 4.4,
      condition: "Excellent",
      location: "New Town, Gurgaon",
      specifications: {
        power: "1400W",
        weight: "12 kg",
        cuttingWidth: "37cm"
      },
      pricing: {
        hourly: 80,
        daily: 500,
        weekly: 2800,
        monthly: 10000
      },
      operatorCost: 350,
      trainingCost: 500,
      deliveryCost: 120,
      securityDeposit: 2500,
      unavailableDates: [],
      maintenanceDates: [],
      inspectionImages: []
    }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'availability', label: 'Available First' }
  ];

  // Filter and sort tools
  const getFilteredTools = () => {
    let filteredTools = tools;

    // Filter by category
    if (selectedCategory) {
      filteredTools = filteredTools?.filter(tool => tool?.category === selectedCategory?.id);
    }

    // Filter by search query
    if (searchQuery) {
      filteredTools = filteredTools?.filter(tool =>
        tool?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        tool?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply filters
    if (filters?.priceRange) {
      const [min, max] = filters?.priceRange?.split('-')?.map(p => p?.replace('+', ''));
      filteredTools = filteredTools?.filter(tool => {
        const dailyPrice = tool?.pricing?.daily;
        if (max) {
          return dailyPrice >= parseInt(min) && dailyPrice <= parseInt(max);
        } else {
          return dailyPrice >= parseInt(min);
        }
      });
    }

    if (filters?.condition && filters?.condition?.length > 0) {
      filteredTools = filteredTools?.filter(tool =>
        filters?.condition?.includes(tool?.condition?.toLowerCase())
      );
    }

    if (filters?.availability === 'immediate') {
      filteredTools = filteredTools?.filter(tool => tool?.available);
    }

    if (filters?.rating) {
      const minRating = parseFloat(filters?.rating?.replace('+', ''));
      filteredTools = filteredTools?.filter(tool => tool?.rating >= minRating);
    }

    // Sort tools
    switch (sortBy) {
      case 'price-low':
        filteredTools?.sort((a, b) => a?.pricing?.daily - b?.pricing?.daily);
        break;
      case 'price-high':
        filteredTools?.sort((a, b) => b?.pricing?.daily - a?.pricing?.daily);
        break;
      case 'rating':
        filteredTools?.sort((a, b) => b?.rating - a?.rating);
        break;
      case 'availability':
        filteredTools?.sort((a, b) => b?.available - a?.available);
        break;
      default:
        // Keep original order for relevance
        break;
    }

    return filteredTools;
  };

  let filteredTools = getFilteredTools();

  const handleSearch = ({ query }) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedTool(null);
  };

  const handleSelectTool = (tool) => {
    setSelectedTool(tool);
  };

  const handleDateSelect = (dateString) => {
    setSelectedDates(prev => {
      if (prev?.includes(dateString)) {
        return prev?.filter(date => date !== dateString);
      } else {
        return [...prev, dateString];
      }
    });
  };

  const handleRentalUpdate = (details) => {
    setRentalDetails(details);
  };

  // Initialize from URL state if available
  useEffect(() => {
    if (location?.state?.query) {
      setSearchQuery(location?.state?.query);
    }
  }, [location?.state]);

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader 
        onSearch={handleSearch}
        initialQuery={searchQuery}
        showLocationFilter={true}
        placeholder="Search for tools, equipment, or services..."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb />
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-text-secondary">
                Rent professional tools and equipment with flexible duration options
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="Package" size={20} className="text-primary" />
                <span className="text-sm text-text-secondary">
                  {filteredTools?.length} tools available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <RentalFilters
                onFiltersChange={setFilters}
                activeFilters={filters}
              />
              
              {/* Rental Calculator - Desktop */}
              <div className="hidden lg:block">
                <RentalCalculator
                  selectedTool={selectedTool}
                  onRentalUpdate={handleRentalUpdate}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 p-4 bg-card rounded-lg shadow-elevation-1">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-text-secondary">
                  {filteredTools?.length} results
                  {selectedCategory && ` in ${selectedCategory?.name}`}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e?.target?.value)}
                  className="text-sm border border-border rounded-md px-3 py-1 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {sortOptions?.map(option => (
                    <option key={option?.value} value={option?.value}>
                      {option?.label}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-border rounded-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-text-secondary hover:text-text-primary'}`}
                  >
                    <Icon name="Grid3X3" size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-text-secondary hover:text-text-primary'}`}
                  >
                    <Icon name="List" size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Tools Grid/List */}
            {filteredTools?.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 gap-6" :"space-y-4"
              }>
                {filteredTools?.map(tool => (
                  <ToolCard
                    key={tool?.id}
                    tool={tool}
                    onSelect={handleSelectTool}
                    isSelected={selectedTool?.id === tool?.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="Search" size={48} className="mx-auto mb-4 text-text-secondary opacity-50" />
                <h3 className="text-lg font-medium text-text-primary mb-2">No tools found</h3>
                <p className="text-text-secondary mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button variant="outline" onClick={() => {
                  setFilters({});
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>

          {/* Right Sidebar - Tool Details */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Availability Calendar */}
              <AvailabilityCalendar
                selectedTool={selectedTool}
                onDateSelect={handleDateSelect}
                selectedDates={selectedDates}
              />
              
              {/* Quality Assurance */}
              <QualityAssurance selectedTool={selectedTool} />
            </div>
          </div>
        </div>

        {/* Mobile Rental Calculator */}
        <div className="lg:hidden mt-8">
          <RentalCalculator
            selectedTool={selectedTool}
            onRentalUpdate={handleRentalUpdate}
          />
        </div>

        {/* Featured Tools Section */}
        {!selectedCategory && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Featured Equipment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools?.filter(tool => tool?.featured)?.map(tool => (
                <ToolCard
                  key={tool?.id}
                  tool={tool}
                  onSelect={handleSelectTool}
                  isSelected={selectedTool?.id === tool?.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolRentalSystem;