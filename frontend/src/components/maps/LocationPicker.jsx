import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, X } from 'lucide-react';
import googleMapsService from '../../services/external/googleMaps';

const LocationPicker = ({ onLocationSelect, defaultLocation, placeholder }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = async () => {
    try {
      await googleMapsService.loadGoogleMaps();
      
      const mapOptions = {
        zoom: 15,
        center: defaultLocation || { lat: 28.6139, lng: 77.2090 },
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);

      newMap.addListener('click', (event) => {
        const location = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        handleMapClick(location);
      });

      if (defaultLocation) {
        addMarker(defaultLocation);
        reverseGeocode(defaultLocation);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const addMarker = (location) => {
    if (marker) marker.setMap(null);
    
    const newMarker = new window.google.maps.Marker({
      position: location,
      map,
      draggable: true
    });

    newMarker.addListener('dragend', (event) => {
      const newLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      reverseGeocode(newLocation);
    });

    setMarker(newMarker);
    map.setCenter(location);
  };

  const handleMapClick = async (location) => {
    addMarker(location);
    await reverseGeocode(location);
  };

  const reverseGeocode = async (location) => {
    try {
      const result = await googleMapsService.reverseGeocode(location.lat, location.lng);
      const locationData = {
        address: result.formatted,
        coordinates: location
      };
      setSelectedLocation(locationData);
      setSearchQuery(result.formatted);
      onLocationSelect(locationData);
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await googleMapsService.searchPlaces(query, null, 5000);
      setSearchResults(results.slice(0, 5));
    } catch (error) {
      console.error('Error searching places:', error);
    }
  };

  const handleLocationSelect = async (place) => {
    try {
      const details = await googleMapsService.getPlaceDetails(place.placeId);
      const location = {
        lat: details.location.latitude,
        lng: details.location.longitude
      };
      
      setSelectedLocation({
        address: details.address,
        coordinates: location
      });
      
      setSearchQuery(details.address);
      setSearchResults([]);
      addMarker(location);
      onLocationSelect({
        address: details.address,
        coordinates: location
      });
    } catch (error) {
      console.error('Error getting place details:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await googleMapsService.getCurrentLocation();
      const coords = { lat: location.latitude, lng: location.longitude };
      addMarker(coords);
      await reverseGeocode(coords);
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder || "Search for a location..."}
            className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {selectedLocation && (
            <button onClick={() => { setSelectedLocation(null); setSearchQuery(''); }}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
            {searchResults.map((result) => (
              <button
                key={result.placeId}
                onClick={() => handleLocationSelect(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b last:border-b-0"
              >
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium">{result.name}</p>
                    <p className="text-xs text-gray-500">{result.address}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative h-96 rounded-lg overflow-hidden">
        <div ref={mapRef} className="w-full h-full" />
        
        <button
          onClick={getCurrentLocation}
          className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Navigation className="w-5 h-5" />
        </button>
      </div>

      {selectedLocation && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-blue-500 mt-0.5 mr-2" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Selected Location</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{selectedLocation.address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
