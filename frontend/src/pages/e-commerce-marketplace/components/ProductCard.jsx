import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, onProductClick, isWishlisted = false }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e?.stopPropagation();
    setIsLoading(true);
    await onAddToCart(product);
    setIsLoading(false);
  };

  const handleWishlistToggle = (e) => {
    e?.stopPropagation();
    onToggleWishlist(product?.id);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(price);
  };

  const calculateDiscount = () => {
    if (product?.originalPrice && product?.price < product?.originalPrice) {
      return Math.round(((product?.originalPrice - product?.price) / product?.originalPrice) * 100);
    }
    return 0;
  };

  const renderRating = () => {
    const rating = product?.rating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)]?.map((_, i) => (
          <Icon key={i} name="Star" size={12} className="text-warning fill-current" />
        ))}
        {hasHalfStar && (
          <Icon name="Star" size={12} className="text-warning fill-current opacity-50" />
        )}
        {[...Array(emptyStars)]?.map((_, i) => (
          <Icon key={i} name="Star" size={12} className="text-muted-foreground" />
        ))}
        <span className="text-xs text-text-secondary ml-1">
          ({product?.reviewCount || 0})
        </span>
      </div>
    );
  };

  const discount = calculateDiscount();

  return (
    <div
      onClick={() => onProductClick(product)}
      className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-elevation-2 transition-smooth cursor-pointer group"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product?.image}
          alt={product?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-2 bg-surface/80 backdrop-blur-sm rounded-full hover:bg-surface transition-smooth"
        >
          <Icon
            name="Heart"
            size={16}
            className={isWishlisted ? 'text-destructive fill-current' : 'text-text-secondary'}
          />
        </button>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-medium">
            {discount}% OFF
          </div>
        )}

        {/* Stock Status */}
        {product?.stock <= 5 && product?.stock > 0 && (
          <div className="absolute bottom-2 left-2 bg-warning text-warning-foreground px-2 py-1 rounded text-xs font-medium">
            Only {product?.stock} left
          </div>
        )}

        {product?.stock === 0 && (
          <div className="absolute inset-0 bg-surface/80 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-text-primary line-clamp-2 mb-2 group-hover:text-primary transition-smooth">
          {product?.name}
        </h3>

        {/* Rating */}
        <div className="mb-2">
          {renderRating()}
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-semibold text-text-primary">
            {formatPrice(product?.price)}
          </span>
          {product?.originalPrice && product?.originalPrice > product?.price && (
            <span className="text-sm text-text-secondary line-through">
              {formatPrice(product?.originalPrice)}
            </span>
          )}
        </div>

        {/* Availability */}
        <div className="flex items-center space-x-2 mb-3">
          <Icon
            name={product?.inStock ? "CheckCircle" : "XCircle"}
            size={14}
            className={product?.inStock ? "text-success" : "text-destructive"}
          />
          <span className={`text-xs ${product?.inStock ? "text-success" : "text-destructive"}`}>
            {product?.inStock ? "In Stock" : "Out of Stock"}
          </span>
          {product?.deliveryTime && (
            <>
              <span className="text-text-secondary">•</span>
              <span className="text-xs text-text-secondary">
                {product?.deliveryTime}
              </span>
            </>
          )}
        </div>

        {/* Rental Option */}
        {product?.hasRentalOption && (
          <div className="flex items-center space-x-1 mb-3 p-2 bg-accent/10 rounded">
            <Icon name="Clock" size={14} className="text-accent" />
            <span className="text-xs text-accent font-medium">
              Also available for rent
            </span>
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          variant={product?.inStock ? "default" : "outline"}
          size="sm"
          fullWidth
          disabled={!product?.inStock}
          loading={isLoading}
          iconName="ShoppingCart"
          iconPosition="left"
          onClick={() => onAddToCart(product)}
        >
          {product?.inStock ? "Add to Cart" : "Notify When Available"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;