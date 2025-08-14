import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

import Select from '../../../components/ui/Select';

const ServiceDetailsForm = ({ 
  serviceDetails, 
  onServiceDetailsChange, 
  onPhotosUpload 
}) => {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const durationOptions = [
    { value: '0.5', label: '30 minutes' },
    { value: '1', label: '1 hour' },
    { value: '1.5', label: '1.5 hours' },
    { value: '2', label: '2 hours' },
    { value: '3', label: '3 hours' },
    { value: '4', label: '4 hours' },
    { value: '6', label: '6 hours' },
    { value: '8', label: '8 hours (Full day)' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low - Can wait a few days' },
    { value: 'medium', label: 'Medium - Within this week' },
    { value: 'high', label: 'High - Within 24 hours' },
    { value: 'urgent', label: 'Urgent - Immediate attention needed' }
  ];

  const handleInputChange = (field, value) => {
    onServiceDetailsChange({
      ...serviceDetails,
      [field]: value
    });
  };

  const handleFileUpload = (files) => {
    const newPhotos = Array.from(files)?.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file?.name
    }));
    
    const updatedPhotos = [...uploadedPhotos, ...newPhotos];
    setUploadedPhotos(updatedPhotos);
    onPhotosUpload(updatedPhotos);
  };

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === 'dragenter' || e?.type === 'dragover') {
      setDragActive(true);
    } else if (e?.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFileUpload(e?.dataTransfer?.files);
    }
  };

  const removePhoto = (photoId) => {
    const updatedPhotos = uploadedPhotos?.filter(photo => photo?.id !== photoId);
    setUploadedPhotos(updatedPhotos);
    onPhotosUpload(updatedPhotos);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <h3 className="text-lg font-semibold text-card-foreground mb-6">
        Service Details
      </h3>
      <div className="space-y-6">
        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Describe your job requirements *
          </label>
          <textarea
            value={serviceDetails?.description || ''}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            placeholder="Please provide detailed information about the work you need done. Include specific requirements, materials needed, and any special instructions..."
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            required
          />
          <p className="text-xs text-text-secondary mt-1">
            Minimum 50 characters. Be specific to get accurate quotes.
          </p>
        </div>

        {/* Estimated Duration */}
        <div>
          <Select
            label="Estimated Duration *"
            description="How long do you think this job will take?"
            options={durationOptions}
            value={serviceDetails?.estimatedDuration || ''}
            onChange={(value) => handleInputChange('estimatedDuration', value)}
            placeholder="Select duration"
            required
          />
        </div>

        {/* Priority Level */}
        <div>
          <Select
            label="Priority Level"
            description="When do you need this work completed?"
            options={priorityOptions}
            value={serviceDetails?.priority || 'medium'}
            onChange={(value) => handleInputChange('priority', value)}
            placeholder="Select priority"
          />
        </div>

        {/* Special Requirements */}
        <div>
          <Input
            label="Special Requirements"
            type="text"
            value={serviceDetails?.specialRequirements || ''}
            onChange={(e) => handleInputChange('specialRequirements', e?.target?.value)}
            placeholder="e.g., Bring own tools, work quietly, pet-friendly worker needed"
            description="Any specific requirements or preferences"
          />
        </div>

        {/* Budget Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Minimum Budget (₹)"
            type="number"
            value={serviceDetails?.minBudget || ''}
            onChange={(e) => handleInputChange('minBudget', e?.target?.value)}
            placeholder="500"
            description="Your minimum expected cost"
          />
          <Input
            label="Maximum Budget (₹)"
            type="number"
            value={serviceDetails?.maxBudget || ''}
            onChange={(e) => handleInputChange('maxBudget', e?.target?.value)}
            placeholder="2000"
            description="Your maximum budget limit"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Upload Photos (Optional)
          </label>
          <p className="text-xs text-text-secondary mb-3">
            Add photos to help the professional understand your requirements better
          </p>
          
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center transition-smooth cursor-pointer
              ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('photo-upload')?.click()}
          >
            <Icon name="Upload" size={32} className="mx-auto mb-3 text-text-secondary" />
            <p className="text-sm text-card-foreground mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-text-secondary">
              PNG, JPG, JPEG up to 5MB each (Max 5 photos)
            </p>
          </div>

          <input
            id="photo-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e?.target?.files)}
            className="hidden"
          />

          {/* Uploaded Photos Preview */}
          {uploadedPhotos?.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {uploadedPhotos?.map((photo) => (
                <div key={photo?.id} className="relative group">
                  <img
                    src={photo?.url}
                    alt={photo?.name}
                    className="w-full h-24 object-cover rounded-lg border border-border"
                  />
                  <button
                    onClick={() => removePhoto(photo?.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth"
                  >
                    <Icon name="X" size={12} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg truncate">
                    {photo?.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Additional Notes
          </label>
          <textarea
            value={serviceDetails?.additionalNotes || ''}
            onChange={(e) => handleInputChange('additionalNotes', e?.target?.value)}
            placeholder="Any other information you'd like to share with the professional..."
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
        </div>

        {/* Contact Preferences */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium text-card-foreground mb-3">
            Contact Preferences
          </h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={serviceDetails?.allowCalls || false}
                onChange={(e) => handleInputChange('allowCalls', e?.target?.checked)}
                className="rounded border-border text-primary focus:ring-ring"
              />
              <span className="text-sm text-card-foreground">
                Allow phone calls for clarification
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={serviceDetails?.allowMessages || true}
                onChange={(e) => handleInputChange('allowMessages', e?.target?.checked)}
                className="rounded border-border text-primary focus:ring-ring"
              />
              <span className="text-sm text-card-foreground">
                Allow messages and chat
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={serviceDetails?.shareLocation || false}
                onChange={(e) => handleInputChange('shareLocation', e?.target?.checked)}
                className="rounded border-border text-primary focus:ring-ring"
              />
              <span className="text-sm text-card-foreground">
                Share exact location with selected professional
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsForm;