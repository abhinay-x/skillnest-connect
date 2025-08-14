import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PricingTab = ({ worker, onBookNow, onRequestQuote }) => {
  const [selectedService, setSelectedService] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(price);
  };

  const getPriceRange = (service) => {
    if (service?.minPrice === service?.maxPrice) {
      return formatPrice(service?.minPrice);
    }
    return `${formatPrice(service?.minPrice)} - ${formatPrice(service?.maxPrice)}`;
  };

  const getSurgeMultiplier = () => {
    const hour = new Date()?.getHours();
    if (hour >= 22 || hour <= 6) return 1.5; // Night hours
    if (hour >= 18 && hour <= 21) return 1.2; // Evening hours
    return 1.0; // Regular hours
  };

  const surgeMultiplier = getSurgeMultiplier();
  const isSurgeTime = surgeMultiplier > 1.0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pricing Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Base Rates */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-card-foreground">Service Pricing</h2>
              {isSurgeTime && (
                <div className="bg-warning/10 text-warning px-3 py-1 rounded-full text-sm font-medium">
                  <Icon name="TrendingUp" size={14} className="inline mr-1" />
                  Surge Pricing Active ({Math.round((surgeMultiplier - 1) * 100)}% extra)
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {worker?.services?.map((service, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 cursor-pointer transition-smooth ${
                    selectedService === index
                      ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedService(selectedService === index ? null : index)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-card-foreground">{service?.name}</h3>
                      <p className="text-sm text-text-secondary">{service?.description}</p>
                    </div>
                    <Icon
                      name={selectedService === index ? "ChevronUp" : "ChevronDown"}
                      size={16}
                      className="text-text-secondary mt-1"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary">
                        {getPriceRange(service)}
                      </span>
                      <span className="text-sm text-text-secondary">/{service?.unit}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} className="text-text-secondary" />
                      <span className="text-sm text-text-secondary">{service?.duration}</span>
                    </div>
                  </div>

                  {/* Expanded Service Details */}
                  {selectedService === index && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-card-foreground mb-2">What's Included:</h4>
                          <ul className="space-y-1">
                            {service?.includes?.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-center space-x-2 text-sm text-text-secondary">
                                <Icon name="Check" size={14} className="text-success" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {service?.additionalCharges && service?.additionalCharges?.length > 0 && (
                          <div>
                            <h4 className="font-medium text-card-foreground mb-2">Additional Charges:</h4>
                            <ul className="space-y-1">
                              {service?.additionalCharges?.map((charge, chargeIndex) => (
                                <li key={chargeIndex} className="flex items-center justify-between text-sm">
                                  <span className="text-text-secondary">{charge?.name}</span>
                                  <span className="text-card-foreground font-medium">
                                    {formatPrice(charge?.price)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => onBookNow(service)}
                            iconName="Calendar"
                            iconPosition="left"
                          >
                            Book Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRequestQuote(service)}
                            iconName="FileText"
                            iconPosition="left"
                          >
                            Get Quote
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Package Deals */}
          {worker?.packages && worker?.packages?.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-card-foreground mb-6">Package Deals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {worker?.packages?.map((pkg, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 relative">
                    {pkg?.popular && (
                      <div className="absolute -top-2 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <h3 className="font-semibold text-card-foreground mb-2">{pkg?.name}</h3>
                      <p className="text-sm text-text-secondary mb-4">{pkg?.description}</p>
                      
                      <div className="flex items-baseline space-x-2 mb-4">
                        <span className="text-2xl font-bold text-primary">{formatPrice(pkg?.price)}</span>
                        {pkg?.originalPrice && (
                          <span className="text-sm text-text-secondary line-through">
                            {formatPrice(pkg?.originalPrice)}
                          </span>
                        )}
                        {pkg?.savings && (
                          <span className="text-sm text-success font-medium">
                            Save {formatPrice(pkg?.savings)}
                          </span>
                        )}
                      </div>

                      <ul className="space-y-2 mb-4">
                        {pkg?.services?.map((service, serviceIndex) => (
                          <li key={serviceIndex} className="flex items-center space-x-2 text-sm">
                            <Icon name="Check" size={14} className="text-success" />
                            <span className="text-text-secondary">{service}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        variant={pkg?.popular ? "default" : "outline"}
                        fullWidth
                        onClick={() => onBookNow(pkg)}
                        iconName="ShoppingCart"
                        iconPosition="left"
                      >
                        Select Package
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Terms */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-6">Payment Terms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-card-foreground mb-3">Payment Methods</h3>
                <div className="space-y-2">
                  {worker?.paymentMethods?.map((method, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-success" />
                      <span className="text-sm text-text-secondary">{method}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-card-foreground mb-3">Payment Schedule</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Advance Payment:</span>
                    <span className="text-card-foreground">{worker?.advancePayment}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">On Completion:</span>
                    <span className="text-card-foreground">{100 - worker?.advancePayment}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Cancellation:</span>
                    <span className="text-card-foreground">{worker?.cancellationPolicy}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Quote Calculator */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Quote</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Service Type
                </label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Select a service</option>
                  {worker?.services?.map((service, index) => (
                    <option key={index} value={service?.name}>
                      {service?.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  defaultValue="2"
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary">Base Rate:</span>
                  <span className="text-card-foreground">₹800/hr</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary">Hours:</span>
                  <span className="text-card-foreground">2</span>
                </div>
                {isSurgeTime && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-warning">Surge ({Math.round((surgeMultiplier - 1) * 100)}%):</span>
                    <span className="text-warning">₹320</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-semibold text-lg border-t border-border pt-2">
                  <span className="text-card-foreground">Total:</span>
                  <span className="text-primary">₹1,920</span>
                </div>
              </div>

              <Button
                variant="default"
                fullWidth
                onClick={onRequestQuote}
                iconName="Calculator"
                iconPosition="left"
              >
                Get Detailed Quote
              </Button>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Pricing Information</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-text-secondary">
                    Prices may vary based on complexity and materials required
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Icon name="Clock" size={16} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-text-secondary">
                    Minimum booking duration: {worker?.minimumBooking}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Icon name="MapPin" size={16} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-text-secondary">
                    Travel charges apply for locations beyond {worker?.freeServiceRadius}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Icon name="Shield" size={16} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-text-secondary">
                    All work comes with {worker?.warrantyPeriod} warranty
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Pricing */}
          {worker?.emergencyServices && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="AlertTriangle" size={20} className="text-error" />
                <h3 className="text-lg font-semibold text-error">Emergency Services</h3>
              </div>
              <p className="text-sm text-text-secondary mb-3">
                Available 24/7 for urgent repairs and emergencies
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Emergency Rate:</span>
                  <span className="text-error font-medium">2x Regular Rate</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Response Time:</span>
                  <span className="text-card-foreground">Within 1 hour</span>
                </div>
              </div>
              <Button
                variant="destructive"
                fullWidth
                className="mt-4"
                iconName="Phone"
                iconPosition="left"
              >
                Emergency Booking
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingTab;