// Google Maps integration service
class GoogleMapsService {
  constructor() {
    this.isLoaded = false;
    this.loadPromise = null;
  }

  // Load Google Maps API
  loadGoogleMaps() {
    if (this.isLoaded) {
      return Promise.resolve(window.google);
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        this.isLoaded = true;
        resolve(window.google);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.isLoaded = true;
        resolve(window.google);
      };

      script.onerror = () => {
        reject(new Error('Failed to load Google Maps API'));
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  // Geocode address to coordinates
  async geocodeAddress(address) {
    try {
      await this.loadGoogleMaps();
      
      return new Promise((resolve, reject) => {
        const geocoder = new window.google.maps.Geocoder();
        
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            resolve({
              latitude: location.lat(),
              longitude: location.lng(),
              formatted: results[0].formatted_address,
              placeId: results[0].place_id,
              components: results[0].address_components
            });
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Geocoding error: ${error.message}`);
    }
  }

  // Reverse geocode coordinates to address
  async reverseGeocode(latitude, longitude) {
    try {
      await this.loadGoogleMaps();
      
      return new Promise((resolve, reject) => {
        const geocoder = new window.google.maps.Geocoder();
        const latlng = new window.google.maps.LatLng(latitude, longitude);
        
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve({
              formatted: results[0].formatted_address,
              components: results[0].address_components,
              placeId: results[0].place_id
            });
          } else {
            reject(new Error(`Reverse geocoding failed: ${status}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Reverse geocoding error: ${error.message}`);
    }
  }

  // Calculate distance between two points
  async calculateDistance(origin, destination, mode = 'DRIVING') {
    try {
      await this.loadGoogleMaps();
      
      return new Promise((resolve, reject) => {
        const service = new window.google.maps.DistanceMatrixService();
        
        service.getDistanceMatrix({
          origins: [origin],
          destinations: [destination],
          travelMode: window.google.maps.TravelMode[mode],
          unitSystem: window.google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, (response, status) => {
          if (status === 'OK') {
            const element = response.rows[0].elements[0];
            if (element.status === 'OK') {
              resolve({
                distance: element.distance.text,
                distanceValue: element.distance.value, // in meters
                duration: element.duration.text,
                durationValue: element.duration.value // in seconds
              });
            } else {
              reject(new Error(`Distance calculation failed: ${element.status}`));
            }
          } else {
            reject(new Error(`Distance Matrix API failed: ${status}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Distance calculation error: ${error.message}`);
    }
  }

  // Get directions between two points
  async getDirections(origin, destination, mode = 'DRIVING') {
    try {
      await this.loadGoogleMaps();
      
      return new Promise((resolve, reject) => {
        const directionsService = new window.google.maps.DirectionsService();
        
        directionsService.route({
          origin,
          destination,
          travelMode: window.google.maps.TravelMode[mode]
        }, (result, status) => {
          if (status === 'OK') {
            resolve(result);
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Directions error: ${error.message}`);
    }
  }

  // Search for places
  async searchPlaces(query, location = null, radius = 50000) {
    try {
      await this.loadGoogleMaps();
      
      return new Promise((resolve, reject) => {
        const service = new window.google.maps.places.PlacesService(
          document.createElement('div')
        );
        
        const request = {
          query,
          fields: ['place_id', 'name', 'formatted_address', 'geometry', 'rating', 'photos']
        };
        
        if (location) {
          request.location = new window.google.maps.LatLng(location.latitude, location.longitude);
          request.radius = radius;
        }
        
        service.textSearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const places = results.map(place => ({
              placeId: place.place_id,
              name: place.name,
              address: place.formatted_address,
              location: {
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng()
              },
              rating: place.rating,
              photos: place.photos?.map(photo => photo.getUrl()) || []
            }));
            resolve(places);
          } else {
            reject(new Error(`Places search failed: ${status}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Places search error: ${error.message}`);
    }
  }

  // Get place details
  async getPlaceDetails(placeId) {
    try {
      await this.loadGoogleMaps();
      
      return new Promise((resolve, reject) => {
        const service = new window.google.maps.places.PlacesService(
          document.createElement('div')
        );
        
        service.getDetails({
          placeId,
          fields: [
            'place_id', 'name', 'formatted_address', 'geometry',
            'formatted_phone_number', 'website', 'rating', 'reviews',
            'opening_hours', 'photos', 'types'
          ]
        }, (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve({
              placeId: place.place_id,
              name: place.name,
              address: place.formatted_address,
              location: {
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng()
              },
              phone: place.formatted_phone_number,
              website: place.website,
              rating: place.rating,
              reviews: place.reviews,
              openingHours: place.opening_hours,
              photos: place.photos?.map(photo => photo.getUrl()) || [],
              types: place.types
            });
          } else {
            reject(new Error(`Place details request failed: ${status}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Place details error: ${error.message}`);
    }
  }

  // Create map instance
  async createMap(element, options = {}) {
    try {
      await this.loadGoogleMaps();
      
      const defaultOptions = {
        zoom: 10,
        center: { lat: 28.6139, lng: 77.2090 }, // Delhi, India
        mapTypeId: 'roadmap'
      };
      
      return new window.google.maps.Map(element, { ...defaultOptions, ...options });
    } catch (error) {
      throw new Error(`Map creation error: ${error.message}`);
    }
  }

  // Add marker to map
  addMarker(map, position, options = {}) {
    const marker = new window.google.maps.Marker({
      position,
      map,
      ...options
    });
    
    return marker;
  }

  // Create info window
  createInfoWindow(content, options = {}) {
    return new window.google.maps.InfoWindow({
      content,
      ...options
    });
  }

  // Get current location
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }
}

// Create singleton instance
const googleMapsService = new GoogleMapsService();

export default googleMapsService;

// Travel modes
export const TRAVEL_MODES = {
  DRIVING: 'DRIVING',
  WALKING: 'WALKING',
  BICYCLING: 'BICYCLING',
  TRANSIT: 'TRANSIT'
};

// Map types
export const MAP_TYPES = {
  ROADMAP: 'roadmap',
  SATELLITE: 'satellite',
  HYBRID: 'hybrid',
  TERRAIN: 'terrain'
};
