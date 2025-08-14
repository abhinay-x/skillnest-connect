import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const PaymentMethodSelector = ({ 
  selectedPaymentMethod, 
  onPaymentMethodSelect,
  totalAmount = 0 
}) => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const paymentMethods = [
    {
      id: 'card-1',
      type: 'card',
      name: 'Credit Card',
      details: '**** **** **** 4532',
      brand: 'Visa',
      icon: 'CreditCard',
      isDefault: true,
      securityBadges: ['Secure', 'Verified']
    },
    {
      id: 'card-2',
      type: 'card',
      name: 'Debit Card',
      details: '**** **** **** 8901',
      brand: 'Mastercard',
      icon: 'CreditCard',
      isDefault: false,
      securityBadges: ['Secure']
    },
    {
      id: 'upi-1',
      type: 'upi',
      name: 'UPI',
      details: 'user@paytm',
      brand: 'UPI',
      icon: 'Smartphone',
      isDefault: false,
      securityBadges: ['Instant', 'Secure']
    },
    {
      id: 'netbanking',
      type: 'netbanking',
      name: 'Net Banking',
      details: 'All major banks supported',
      brand: 'Banking',
      icon: 'Building',
      isDefault: false,
      securityBadges: ['Secure', 'Verified']
    },
    {
      id: 'wallet-1',
      type: 'wallet',
      name: 'Paytm Wallet',
      details: 'Balance: ₹2,450',
      brand: 'Paytm',
      icon: 'Wallet',
      isDefault: false,
      securityBadges: ['Instant']
    },
    {
      id: 'skillnest-wallet',
      type: 'skillnest-wallet',
      name: 'SkillNest Wallet',
      details: 'Balance: ₹1,200',
      brand: 'SkillNest',
      icon: 'Zap',
      isDefault: false,
      securityBadges: ['Instant', 'Cashback']
    },
    {
      id: 'cash',
      type: 'cash',
      name: 'Cash on Completion',
      details: 'Pay after service completion',
      brand: 'Cash',
      icon: 'Banknote',
      isDefault: false,
      securityBadges: ['Flexible']
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(price);
  };

  const getPaymentMethodIcon = (type) => {
    switch (type) {
      case 'card': return 'CreditCard';
      case 'upi': return 'Smartphone';
      case 'netbanking': return 'Building';
      case 'wallet': return 'Wallet';
      case 'skillnest-wallet': return 'Zap';
      case 'cash': return 'Banknote';
      default: return 'CreditCard';
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Secure': return 'bg-success/10 text-success';
      case 'Verified': return 'bg-primary/10 text-primary';
      case 'Instant': return 'bg-warning/10 text-warning';
      case 'Cashback': return 'bg-accent/10 text-accent';
      case 'Flexible': return 'bg-secondary/10 text-secondary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleCardInputChange = (field, value) => {
    setNewCard(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddCard = () => {
    // Mock card addition
    const cardToAdd = {
      id: `card-${Date.now()}`,
      type: 'card',
      name: 'Credit Card',
      details: `**** **** **** ${newCard?.number?.slice(-4)}`,
      brand: 'Visa',
      icon: 'CreditCard',
      isDefault: false,
      securityBadges: ['Secure', 'Verified']
    };
    
    onPaymentMethodSelect(cardToAdd);
    setShowAddCard(false);
    setNewCard({ number: '', expiry: '', cvv: '', name: '' });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          Payment Method
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-sm text-success font-medium">Secure Payment</span>
        </div>
      </div>
      {/* Payment Methods List */}
      <div className="space-y-3 mb-6">
        {paymentMethods?.map((method) => (
          <div
            key={method?.id}
            className={`
              p-4 border rounded-lg cursor-pointer transition-smooth
              ${selectedPaymentMethod?.id === method?.id ? 
                'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
            `}
            onClick={() => onPaymentMethodSelect(method)}
          >
            <div className="flex items-center space-x-4">
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center
                ${selectedPaymentMethod?.id === method?.id ? 
                  'bg-primary text-primary-foreground' : 
                  'bg-muted text-text-secondary'}
              `}>
                <Icon name={getPaymentMethodIcon(method?.type)} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-card-foreground">
                    {method?.name}
                  </h4>
                  {method?.isDefault && (
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mb-2">
                  {method?.details}
                </p>
                <div className="flex items-center space-x-2">
                  {method?.securityBadges?.map((badge, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(badge)}`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                {selectedPaymentMethod?.id === method?.id && (
                  <Icon name="Check" size={20} className="text-primary" />
                )}
                {method?.type === 'cash' && (
                  <span className="text-xs text-text-secondary">No advance payment</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Add New Card */}
      <div className="border-t border-border pt-6">
        {!showAddCard ? (
          <Button
            variant="ghost"
            fullWidth
            onClick={() => setShowAddCard(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Add New Card
          </Button>
        ) : (
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-card-foreground">
                Add New Card
              </h5>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddCard(false)}
                iconName="X"
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Card Number"
                type="text"
                value={newCard?.number}
                onChange={(e) => handleCardInputChange('number', e?.target?.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Date"
                  type="text"
                  value={newCard?.expiry}
                  onChange={(e) => handleCardInputChange('expiry', e?.target?.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
                <Input
                  label="CVV"
                  type="text"
                  value={newCard?.cvv}
                  onChange={(e) => handleCardInputChange('cvv', e?.target?.value)}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>

              <Input
                label="Cardholder Name"
                type="text"
                value={newCard?.name}
                onChange={(e) => handleCardInputChange('name', e?.target?.value)}
                placeholder="Name as on card"
                required
              />

              <div className="flex space-x-3">
                <Button
                  variant="default"
                  onClick={handleAddCard}
                  disabled={!newCard?.number || !newCard?.expiry || !newCard?.cvv || !newCard?.name}
                  className="flex-1"
                >
                  Add Card
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddCard(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Payment Security Info */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-sm font-medium text-card-foreground">
            Your payment is secure
          </span>
        </div>
        <div className="text-xs text-text-secondary space-y-1">
          <p>• 256-bit SSL encryption for all transactions</p>
          <p>• PCI DSS compliant payment processing</p>
          <p>• Money-back guarantee for unsatisfactory service</p>
          <p>• 24/7 fraud monitoring and protection</p>
        </div>
      </div>
      {/* Selected Payment Summary */}
      {selectedPaymentMethod && (
        <div className="mt-6 p-4 bg-success/5 border border-success/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Check" size={16} className="text-success" />
              <div>
                <p className="font-medium text-success">
                  {selectedPaymentMethod?.name} Selected
                </p>
                <p className="text-sm text-text-secondary">
                  {selectedPaymentMethod?.details}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-card-foreground">
                {formatPrice(totalAmount)}
              </p>
              {selectedPaymentMethod?.type === 'cash' && (
                <p className="text-xs text-text-secondary">
                  Pay on completion
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;