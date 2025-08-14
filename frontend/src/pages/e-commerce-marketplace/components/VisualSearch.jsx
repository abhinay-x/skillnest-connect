import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const VisualSearch = ({ onSearch, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e?.target?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // In a real app, this would open camera
    fileInputRef?.current?.click();
  };

  const handleVisualSearch = async () => {
    if (!selectedImage) return;
    
    setIsSearching(true);
    
    // Mock visual search results
    const mockResults = [
      {
        id: 'vs1',
        name: 'Similar Power Drill',
        price: 2499,
        image: 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg',
        similarity: 95
      },
      {
        id: 'vs2',
        name: 'Cordless Drill Set',
        price: 3299,
        image: 'https://images.pexels.com/photos/5691660/pexels-photo-5691660.jpeg',
        similarity: 88
      },
      {
        id: 'vs3',
        name: 'Professional Drill',
        price: 4199,
        image: 'https://images.pexels.com/photos/5691661/pexels-photo-5691661.jpeg',
        similarity: 82
      }
    ];

    setTimeout(() => {
      setSearchResults(mockResults);
      setIsSearching(false);
      onSearch(mockResults);
    }, 2000);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setSearchResults([]);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-200 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-lg shadow-elevation-3 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Camera" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Visual Search</h2>
              <p className="text-sm text-text-secondary">Find products by uploading an image</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!selectedImage ? (
            /* Upload Area */
            (<div className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-smooth">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Upload" size={32} className="text-text-secondary" />
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  Upload Product Image
                </h3>
                <p className="text-text-secondary mb-4">
                  Drag and drop an image or click to browse
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef?.current?.click()}
                  iconName="Upload"
                  iconPosition="left"
                >
                  Choose Image
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-sm text-text-secondary">or</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>
              <Button
                variant="default"
                fullWidth
                onClick={handleCameraCapture}
                iconName="Camera"
                iconPosition="left"
              >
                Take Photo
              </Button>
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-text-primary mb-2">Tips for better results:</h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Use clear, well-lit images</li>
                  <li>• Focus on the main product</li>
                  <li>• Avoid cluttered backgrounds</li>
                  <li>• Include multiple angles if possible</li>
                </ul>
              </div>
            </div>)
          ) : (
            /* Search Results */
            (<div className="space-y-6">
              {/* Selected Image */}
              <div className="flex items-start space-x-4">
                <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={selectedImage}
                    alt="Selected image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-text-primary mb-2">Searching for similar products...</h3>
                  <p className="text-sm text-text-secondary mb-4">
                    Our AI is analyzing your image to find matching products
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      onClick={handleVisualSearch}
                      loading={isSearching}
                      iconName="Search"
                      iconPosition="left"
                      disabled={isSearching}
                    >
                      {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleClearImage}
                      iconName="X"
                      iconPosition="left"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
              {/* Search Results */}
              {searchResults?.length > 0 && (
                <div>
                  <h4 className="font-medium text-text-primary mb-4">
                    Found {searchResults?.length} similar products
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults?.map((result) => (
                      <div
                        key={result?.id}
                        className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-elevation-2 transition-smooth cursor-pointer"
                      >
                        <div className="aspect-square bg-muted overflow-hidden">
                          <Image
                            src={result?.image}
                            alt={result?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-text-primary text-sm">
                              {result?.name}
                            </h5>
                            <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                              {result?.similarity}% match
                            </span>
                          </div>
                          <p className="text-lg font-semibold text-text-primary">
                            {formatPrice(result?.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>)
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualSearch;