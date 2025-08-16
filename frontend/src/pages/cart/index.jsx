import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const CartPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Cart state - in a real app, this would come from a cart context or API
  const [cartItems, setCartItems] = useState([
    // Mock data for demonstration
    {
      id: 'p1',
      name: 'Professional Cordless Drill Set with 20V Battery',
      price: 2499,
      originalPrice: 3299,
      image: 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg',
      quantity: 2,
      inStock: true,
      deliveryTime: 'Same day delivery'
    },
    {
      id: 'p2',
      name: 'Heavy Duty Hammer Set - 3 Pieces',
      price: 899,
      originalPrice: 1199,
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
      quantity: 1,
      inStock: true,
      deliveryTime: 'Next day delivery'
    }
  ]);
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleContinueShopping = () => {
    navigate('/marketplace');
  };

  const handleCheckout = () => {
    // Navigate to marketplace checkout with cart items
    navigate('/marketplace-checkout', {
      state: {
        cartItems: cartItems,
        totalAmount: calculateTotal(),
        fromCart: true
      }
    });
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb />
        
        <div className="mt-6">
          <h1 className="text-3xl font-bold text-text-primary mb-8">Shopping Cart</h1>
          
          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="ShoppingCart" size={48} className="text-text-secondary" />
              </div>
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                Your cart is empty
              </h2>
              <p className="text-text-secondary mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start shopping to find great deals on tools and equipment!
              </p>
              <Button 
                variant="default" 
                size="lg"
                onClick={handleContinueShopping}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            /* Cart with Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-text-primary">
                      Cart Items ({cartItems.length})
                    </h2>
                  </div>
                  
                  <div className="divide-y divide-border">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-6">
                        <div className="flex items-start space-x-4">
                          {/* Product Image */}
                          <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">
                              {item.name}
                            </h3>
                            
                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-text-primary">
                                  {formatPrice(item.price)}
                                </span>
                                {item.originalPrice && (
                                  <span className="text-sm text-text-secondary line-through">
                                    {formatPrice(item.originalPrice)}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <Icon name="Truck" size={16} className="text-success" />
                                <span className="text-sm text-success">{item.deliveryTime}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-text-secondary">Quantity:</span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-smooth"
                                  >
                                    <Icon name="Minus" size={14} />
                                  </button>
                                  <span className="w-12 text-center font-medium">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-smooth"
                                  >
                                    <Icon name="Plus" size={14} />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Remove Button */}
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="flex items-center space-x-2 text-destructive hover:bg-destructive/10 px-3 py-2 rounded-lg transition-smooth"
                              >
                                <Icon name="Trash2" size={16} />
                                <span className="text-sm">Remove</span>
                              </button>
                            </div>
                          </div>
                          
                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-xl font-bold text-text-primary">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Continue Shopping Button */}
                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={handleContinueShopping}
                    iconName="ArrowLeft"
                    iconPosition="left"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-6">
                    Order Summary
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Subtotal</span>
                      <span className="text-text-primary font-medium">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-text-secondary">GST (18%)</span>
                      <span className="text-text-primary font-medium">
                        {formatPrice(tax)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Delivery</span>
                      <span className="text-success font-medium">Free</span>
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold text-text-primary">Total</span>
                        <span className="font-bold text-text-primary">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Checkout Button */}
                  <Button
                    variant="default"
                    size="lg"
                    fullWidth
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  {/* Security Badge */}
                  <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
                    <Icon name="Shield" size={16} className="text-success" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CartPage;
