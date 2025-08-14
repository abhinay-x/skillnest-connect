import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ShoppingCart = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(price);
  };

  const calculateSubtotal = () => {
    return cartItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    await onCheckout();
    setIsCheckingOut(false);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      onRemoveItem(itemId);
    } else {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  if (!isOpen) return null;

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-200 flex justify-end">
      <div className="w-full max-w-md bg-surface shadow-elevation-3 h-full overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="ShoppingCart" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">
              Shopping Cart ({cartItems?.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        {cartItems?.length === 0 ? (
          /* Empty Cart */
          (<div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Icon name="ShoppingCart" size={32} className="text-text-secondary" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Your cart is empty
            </h3>
            <p className="text-text-secondary mb-6">
              Add some products to get started
            </p>
            <Button variant="default" onClick={onClose}>
              Continue Shopping
            </Button>
          </div>)
        ) : (
          /* Cart Items */
          (<div className="flex flex-col h-full">
            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems?.map((item) => (
                <div key={item?.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item?.image}
                        alt={item?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-text-primary line-clamp-2 mb-1">
                        {item?.name}
                      </h4>
                      <p className="text-sm text-text-secondary mb-2">
                        {formatPrice(item?.price)} each
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item?.id, item?.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-smooth"
                          >
                            <Icon name="Minus" size={14} />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item?.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item?.id, item?.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-smooth"
                          >
                            <Icon name="Plus" size={14} />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => onRemoveItem(item?.id)}
                          className="p-1 text-destructive hover:bg-destructive/10 rounded transition-smooth"
                        >
                          <Icon name="Trash2" size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-text-primary">
                        {formatPrice(item?.price * item?.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Order Summary */}
            <div className="border-t border-border p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="text-text-primary">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">GST (18%)</span>
                  <span className="text-text-primary">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Delivery</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-text-primary">Total</span>
                    <span className="text-text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                variant="default"
                fullWidth
                onClick={handleCheckout}
                loading={isCheckingOut}
                iconName="CreditCard"
                iconPosition="left"
              >
                Proceed to Checkout
              </Button>

              {/* Continue Shopping */}
              <Button
                variant="outline"
                fullWidth
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            </div>
          </div>)
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;