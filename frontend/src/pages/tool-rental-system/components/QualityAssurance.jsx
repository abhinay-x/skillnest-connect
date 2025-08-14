import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';


const QualityAssurance = ({ selectedTool }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!selectedTool) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-elevation-1">
        <div className="text-center text-text-secondary">
          <Icon name="Shield" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select a tool to view quality assurance details</p>
        </div>
      </div>
    );
  }

  const inspectionImages = selectedTool?.inspectionImages || [
    {
      id: 1,
      url: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
      title: "Overall Condition",
      description: "Tool exterior and general condition"
    },
    {
      id: 2,
      url: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
      title: "Working Parts",
      description: "Motor and mechanical components"
    },
    {
      id: 3,
      url: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
      title: "Safety Features",
      description: "Guards and safety mechanisms"
    }
  ];

  const qualityChecks = [
    { item: "Motor Performance", status: "Excellent", icon: "Zap" },
    { item: "Safety Guards", status: "Good", icon: "Shield" },
    { item: "Blade Sharpness", status: "Excellent", icon: "Scissors" },
    { item: "Power Cord", status: "Good", icon: "Cable" },
    { item: "Overall Condition", status: "Excellent", icon: "CheckCircle" }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-primary';
      case 'fair': return 'text-warning';
      case 'poor': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'excellent': return 'CheckCircle2';
      case 'good': return 'CheckCircle';
      case 'fair': return 'AlertCircle';
      case 'poor': return 'XCircle';
      default: return 'Circle';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Shield" size={24} className="text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Quality Assurance</h3>
      </div>
      {/* Inspection Images */}
      <div className="mb-6">
        <h4 className="font-medium text-text-primary mb-3">Pre-Rental Inspection Photos</h4>
        
        {/* Main Image */}
        <div className="mb-4">
          <div className="h-64 rounded-lg overflow-hidden bg-muted">
            <Image
              src={inspectionImages?.[selectedImage]?.url}
              alt={inspectionImages?.[selectedImage]?.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-2">
            <h5 className="font-medium text-text-primary">{inspectionImages?.[selectedImage]?.title}</h5>
            <p className="text-sm text-text-secondary">{inspectionImages?.[selectedImage]?.description}</p>
          </div>
        </div>

        {/* Thumbnail Images */}
        <div className="flex space-x-2">
          {inspectionImages?.map((image, index) => (
            <button
              key={image?.id}
              onClick={() => setSelectedImage(index)}
              className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-smooth ${
                selectedImage === index ? 'border-primary' : 'border-border hover:border-primary/50'
              }`}
            >
              <Image
                src={image?.url}
                alt={image?.title}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      {/* Quality Checklist */}
      <div className="mb-6">
        <h4 className="font-medium text-text-primary mb-3">Quality Checklist</h4>
        <div className="space-y-3">
          {qualityChecks?.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name={check?.icon} size={20} className="text-text-secondary" />
                <span className="text-text-primary">{check?.item}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getStatusIcon(check?.status)} 
                  size={16} 
                  className={getStatusColor(check?.status)} 
                />
                <span className={`text-sm font-medium ${getStatusColor(check?.status)}`}>
                  {check?.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Condition Report */}
      <div className="mb-6">
        <h4 className="font-medium text-text-primary mb-3">Condition Report</h4>
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-primary">Overall Rating:</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5]?.map((star) => (
                <Icon
                  key={star}
                  name="Star"
                  size={16}
                  className={star <= 4 ? "text-warning fill-current" : "text-border"}
                />
              ))}
              <span className="ml-2 text-sm font-medium text-text-primary">4.0/5</span>
            </div>
          </div>
          
          <div className="text-sm text-text-secondary">
            <p className="mb-2">
              <strong>Last Inspection:</strong> {new Date()?.toLocaleDateString('en-IN', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })}
            </p>
            <p className="mb-2">
              <strong>Inspector:</strong> Quality Team - SkillNest
            </p>
            <p>
              <strong>Notes:</strong> Tool is in excellent working condition. All safety features 
              are functional. Minor cosmetic wear consistent with normal usage.
            </p>
          </div>
        </div>
      </div>
      {/* Warranty & Support */}
      <div className="border-t border-border pt-4">
        <h4 className="font-medium text-text-primary mb-3">Warranty & Support</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Icon name="Shield" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-text-primary">Quality Guarantee</p>
              <p className="text-xs text-text-secondary">100% refund if not satisfied</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Icon name="Headphones" size={20} className="text-primary" />
            <div>
              <p className="text-sm font-medium text-text-primary">24/7 Support</p>
              <p className="text-xs text-text-secondary">Technical assistance available</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Icon name="RotateCcw" size={20} className="text-accent" />
            <div>
              <p className="text-sm font-medium text-text-primary">Easy Returns</p>
              <p className="text-xs text-text-secondary">Hassle-free return policy</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Icon name="Wrench" size={20} className="text-secondary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Maintenance</p>
              <p className="text-xs text-text-secondary">Regular servicing included</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityAssurance;