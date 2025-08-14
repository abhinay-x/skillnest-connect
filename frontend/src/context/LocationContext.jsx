import React, { createContext, useContext, useEffect, useState } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  // Get current position
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      setLoading(true);
      setError(null);

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get address
            const address = await reverseGeocode(latitude, longitude);
            
            const locationData = {
              latitude,
              longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
              address
            };
            
            setCurrentLocation(locationData);
            setPermissionStatus('granted');
            setLoading(false);
            resolve(locationData);
          } catch (geocodeError) {
            const locationData = {
              latitude,
              longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
              address: null
            };
            
            setCurrentLocation(locationData);
            setPermissionStatus('granted');
            setLoading(false);
            resolve(locationData);
          }
        },
        (error) => {
          setLoading(false);
          setPermissionStatus('denied');
          
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
            default:
              errorMessage = 'An unknown error occurred while retrieving location';
              break;
          }
          
          setError(errorMessage);
          reject(new Error(errorMessage));
        },
        options
      );
    });
  };

  // Watch position for continuous tracking
  const watchLocation = (callback) => {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser');
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute
    };

    return navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const address = await reverseGeocode(latitude, longitude);
          
          const locationData = {
            latitude,
            longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            address
          };
          
          setCurrentLocation(locationData);
          if (callback) callback(locationData);
        } catch (error) {
          console.error('Error in watch location:', error);
        }
      },
      (error) => {
        console.error('Watch location error:', error);
        setError(error.message);
      },
      options
    );
  };

  // Reverse geocoding (convert coordinates to address)
  const reverseGeocode = async (latitude, longitude) => {
    try {
      // Using a free geocoding service (you can replace with Google Maps API)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }
      
      const data = await response.json();
      
      return {
        formatted: data.locality || data.city || data.principalSubdivision || 'Unknown location',
        street: data.localityInfo?.administrative?.[3]?.name || '',
        city: data.city || data.locality || '',
        state: data.principalSubdivision || '',
        country: data.countryName || '',
        postalCode: data.postcode || '',
        countryCode: data.countryCode || ''
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  // Forward geocoding (convert address to coordinates)
  const geocodeAddress = async (address) => {
    try {
      // Using Nominatim (OpenStreetMap) for free geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error('Address not found');
      }
      
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        formatted: result.display_name,
        boundingBox: result.boundingbox
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  };

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    
    return distance;
  };

  // Get nearby locations/services
  const getNearbyServices = (services, radius = 10) => {
    if (!currentLocation || !services) return [];
    
    return services.filter(service => {
      if (!service.location?.latitude || !service.location?.longitude) return false;
      
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        service.location.latitude,
        service.location.longitude
      );
      
      return distance <= radius;
    }).sort((a, b) => {
      const distanceA = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        a.location.latitude,
        a.location.longitude
      );
      const distanceB = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        b.location.latitude,
        b.location.longitude
      );
      
      return distanceA - distanceB;
    });
  };

  // Set selected location manually
  const selectLocation = async (location) => {
    try {
      let locationData;
      
      if (typeof location === 'string') {
        // If location is an address string, geocode it
        const geocoded = await geocodeAddress(location);
        locationData = {
          latitude: geocoded.latitude,
          longitude: geocoded.longitude,
          address: { formatted: geocoded.formatted },
          manual: true
        };
      } else {
        // If location is an object with coordinates
        locationData = {
          ...location,
          manual: true
        };
      }
      
      setSelectedLocation(locationData);
      return locationData;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Clear location data
  const clearLocation = () => {
    setCurrentLocation(null);
    setSelectedLocation(null);
    setError(null);
  };

  // Get effective location (selected or current)
  const getEffectiveLocation = () => {
    return selectedLocation || currentLocation;
  };

  // Check if location services are available
  const isLocationAvailable = () => {
    return 'geolocation' in navigator;
  };

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      await getCurrentLocation();
      return true;
    } catch (error) {
      return false;
    }
  };

  // Initialize location on mount
  useEffect(() => {
    // Try to get saved location from localStorage
    const savedLocation = localStorage.getItem('skillnest-location');
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setSelectedLocation(parsed);
      } catch (error) {
        console.error('Error parsing saved location:', error);
      }
    }
  }, []);

  // Save selected location to localStorage
  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem('skillnest-location', JSON.stringify(selectedLocation));
    }
  }, [selectedLocation]);

  const value = {
    // State
    currentLocation,
    selectedLocation,
    loading,
    error,
    permissionStatus,
    
    // Methods
    getCurrentLocation,
    watchLocation,
    reverseGeocode,
    geocodeAddress,
    calculateDistance,
    getNearbyServices,
    selectLocation,
    clearLocation,
    getEffectiveLocation,
    isLocationAvailable,
    requestLocationPermission,
    
    // Utilities
    clearError: () => setError(null)
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
