import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AddressSelector = ({ 
  selectedAddress, 
  onAddressSelect, 
  savedAddresses = [] 
}) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    instructions: ''
  });

  const addressTypeOptions = [
    { value: 'home', label: 'Home' },
    { value: 'office', label: 'Office' },
    { value: 'other', label: 'Other' }
  ];

  const stateOptions = [
    { value: 'delhi', label: 'Delhi' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'west-bengal', label: 'West Bengal' },
    { value: 'punjab', label: 'Punjab' }
  ];

  // Mock saved addresses if none provided
  const mockSavedAddresses = savedAddresses?.length > 0 ? savedAddresses : [
    {
      id: 1,
      type: 'home',
      name: 'Home',
      addressLine1: 'A-123, Sector 15',
      addressLine2: 'Near Metro Station',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      landmark: 'Opposite City Mall',
      isDefault: true
    },
    {
      id: 2,
      type: 'office',
      name: 'Office',
      addressLine1: 'Tower B, 5th Floor',
      addressLine2: 'Cyber City',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122002',
      landmark: 'Near DLF Phase 2',
      isDefault: false
    }
  ];

  const handleCurrentLocation = () => {
    setUseCurrentLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position?.coords;
          // Mock reverse geocoding
          const currentLocationAddress = {
            id: 'current',
            type: 'current',
            name: 'Current Location',
            addressLine1: 'Current GPS Location',
            addressLine2: `Lat: ${latitude?.toFixed(6)}, Lng: ${longitude?.toFixed(6)}`,
            city: 'Auto-detected',
            state: 'Auto-detected',
            pincode: 'Auto-detected',
            landmark: 'GPS Location',
            coordinates: { latitude, longitude }
          };
          onAddressSelect(currentLocationAddress);
          setUseCurrentLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setUseCurrentLocation(false);
        }
      );
    }
  };

  const handleAddressInputChange = (field, value) => {
    setNewAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAddress = () => {
    const addressToSave = {
      ...newAddress,
      id: Date.now(),
      isDefault: false
    };
    onAddressSelect(addressToSave);
    setShowAddressForm(false);
    setNewAddress({
      type: 'home',
      name: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      instructions: ''
    });
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'home': return 'Home';
      case 'office': return 'Building';
      case 'current': return 'MapPin';
      default: return 'MapPin';
    }
  };

  const formatAddress = (address) => {
    return `${address?.addressLine1}, ${address?.addressLine2 ? address?.addressLine2 + ', ' : ''}${address?.city}, ${address?.state} ${address?.pincode}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <h3 className="text-lg font-semibold text-card-foreground mb-6">
        Service Location
      </h3>
      {/* Current Location Option */}
      <div className="mb-6">
        <Button
          variant="outline"
          fullWidth
          onClick={handleCurrentLocation}
          disabled={useCurrentLocation}
          loading={useCurrentLocation}
          iconName="MapPin"
          iconPosition="left"
        >
          {useCurrentLocation ? 'Getting Location...' : 'Use Current Location'}
        </Button>
      </div>
      {/* Saved Addresses */}
      <div className="mb-6">
        <h4 className="font-medium text-card-foreground mb-3">
          Saved Addresses
        </h4>
        <div className="space-y-3">
          {mockSavedAddresses?.map((address) => (
            <div
              key={address?.id}
              className={`
                p-4 border rounded-lg cursor-pointer transition-smooth
                ${selectedAddress?.id === address?.id ? 
                  'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
              `}
              onClick={() => onAddressSelect(address)}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${selectedAddress?.id === address?.id ? 
                    'bg-primary text-primary-foreground' : 
                    'bg-muted text-text-secondary'}
                `}>
                  <Icon name={getAddressIcon(address?.type)} size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h5 className="font-medium text-card-foreground">
                      {address?.name}
                    </h5>
                    {address?.isDefault && (
                      <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary">
                    {formatAddress(address)}
                  </p>
                  {address?.landmark && (
                    <p className="text-xs text-text-secondary mt-1">
                      Landmark: {address?.landmark}
                    </p>
                  )}
                </div>

                {selectedAddress?.id === address?.id && (
                  <Icon name="Check" size={20} className="text-primary" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Add New Address */}
      <div>
        {!showAddressForm ? (
          <Button
            variant="ghost"
            fullWidth
            onClick={() => setShowAddressForm(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Add New Address
          </Button>
        ) : (
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-card-foreground">
                Add New Address
              </h5>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddressForm(false)}
                iconName="X"
              />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Address Type"
                  options={addressTypeOptions}
                  value={newAddress?.type}
                  onChange={(value) => handleAddressInputChange('type', value)}
                  required
                />
                <Input
                  label="Address Name"
                  type="text"
                  value={newAddress?.name}
                  onChange={(e) => handleAddressInputChange('name', e?.target?.value)}
                  placeholder="e.g., Home, Office"
                  required
                />
              </div>

              <Input
                label="Address Line 1"
                type="text"
                value={newAddress?.addressLine1}
                onChange={(e) => handleAddressInputChange('addressLine1', e?.target?.value)}
                placeholder="House/Flat/Office No., Building Name"
                required
              />

              <Input
                label="Address Line 2"
                type="text"
                value={newAddress?.addressLine2}
                onChange={(e) => handleAddressInputChange('addressLine2', e?.target?.value)}
                placeholder="Area, Sector, Locality"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="City"
                  type="text"
                  value={newAddress?.city}
                  onChange={(e) => handleAddressInputChange('city', e?.target?.value)}
                  placeholder="City"
                  required
                />
                <Select
                  label="State"
                  options={stateOptions}
                  value={newAddress?.state}
                  onChange={(value) => handleAddressInputChange('state', value)}
                  placeholder="Select State"
                  searchable
                  required
                />
                <Input
                  label="PIN Code"
                  type="text"
                  value={newAddress?.pincode}
                  onChange={(e) => handleAddressInputChange('pincode', e?.target?.value)}
                  placeholder="110001"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                />
              </div>

              <Input
                label="Landmark (Optional)"
                type="text"
                value={newAddress?.landmark}
                onChange={(e) => handleAddressInputChange('landmark', e?.target?.value)}
                placeholder="Near Metro Station, Mall, etc."
              />

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={newAddress?.instructions}
                  onChange={(e) => handleAddressInputChange('instructions', e?.target?.value)}
                  placeholder="Delivery instructions, gate code, floor number, etc."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="default"
                  onClick={handleSaveAddress}
                  disabled={!newAddress?.name || !newAddress?.addressLine1 || !newAddress?.city || !newAddress?.state || !newAddress?.pincode}
                  className="flex-1"
                >
                  Save Address
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddressForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Selected Address Summary */}
      {selectedAddress && (
        <div className="mt-6 p-4 bg-success/5 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Check" size={16} className="text-success" />
            <span className="font-medium text-success">Selected Address</span>
          </div>
          <p className="text-sm text-card-foreground">
            <strong>{selectedAddress?.name}</strong><br />
            {formatAddress(selectedAddress)}
          </p>
          {selectedAddress?.landmark && (
            <p className="text-xs text-text-secondary mt-1">
              Landmark: {selectedAddress?.landmark}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressSelector;