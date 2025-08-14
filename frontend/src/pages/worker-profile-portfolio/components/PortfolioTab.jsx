import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PortfolioTab = ({ worker }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);

  const categories = ['all', 'residential', 'commercial', 'renovation', 'repair', 'installation'];

  const filteredProjects = selectedCategory === 'all' 
    ? worker?.portfolio 
    : worker?.portfolio?.filter(project => project?.category === selectedCategory);

  const openLightbox = (image) => {
    setLightboxImage(image);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth capitalize ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {category === 'all' ? 'All Projects' : category}
            </button>
          ))}
        </div>
      </div>
      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredProjects?.map((project, index) => (
          <div key={index} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-elevation-2 transition-smooth">
            {/* Project Image */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={project?.images?.[0]}
                alt={project?.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => openLightbox(project?.images?.[0])}
              />
              <div className="absolute top-2 right-2">
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium capitalize">
                  {project?.category}
                </span>
              </div>
              {project?.images?.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  +{project?.images?.length - 1} more
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="p-4">
              <h3 className="font-semibold text-card-foreground mb-2">{project?.title}</h3>
              <p className="text-sm text-text-secondary mb-3 line-clamp-2">{project?.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={14} className="text-text-secondary" />
                  <span className="text-xs text-text-secondary">{formatDate(project?.completedDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={14} className="text-text-secondary" />
                  <span className="text-xs text-text-secondary">{project?.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5]?.map((star) => (
                    <Icon
                      key={star}
                      name="Star"
                      size={12}
                      className={`${
                        star <= project?.rating
                          ? 'text-accent fill-current' :'text-muted-foreground'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-text-secondary ml-1">({project?.rating})</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProject(project)}
                  iconName="Eye"
                  iconPosition="left"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Video Showcases */}
      {worker?.videoShowcases && worker?.videoShowcases?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-6">Video Showcases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {worker?.videoShowcases?.map((video, index) => (
              <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="relative h-48 bg-muted flex items-center justify-center">
                  <Icon name="Play" size={48} className="text-primary cursor-pointer hover:scale-110 transition-transform" />
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {video?.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-card-foreground mb-2">{video?.title}</h3>
                  <p className="text-sm text-text-secondary">{video?.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
          <div className="bg-surface rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-text-primary">{selectedProject?.title}</h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-text-secondary hover:text-text-primary transition-smooth"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>

              {/* Project Images */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {selectedProject?.images?.map((image, index) => (
                  <div key={index} className="relative h-32 overflow-hidden rounded-lg cursor-pointer">
                    <Image
                      src={image}
                      alt={`${selectedProject?.title} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      onClick={() => openLightbox(image)}
                    />
                  </div>
                ))}
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-text-primary mb-3">Project Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Category:</span>
                      <span className="text-text-primary capitalize">{selectedProject?.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Duration:</span>
                      <span className="text-text-primary">{selectedProject?.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Completed:</span>
                      <span className="text-text-primary">{formatDate(selectedProject?.completedDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Rating:</span>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5]?.map((star) => (
                          <Icon
                            key={star}
                            name="Star"
                            size={14}
                            className={`${
                              star <= selectedProject?.rating
                                ? 'text-accent fill-current' :'text-muted-foreground'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-text-primary ml-1">({selectedProject?.rating})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-text-primary mb-3">Description</h3>
                  <p className="text-text-secondary leading-relaxed">{selectedProject?.description}</p>
                  
                  {selectedProject?.challenges && (
                    <div className="mt-4">
                      <h4 className="font-medium text-text-primary mb-2">Challenges & Solutions</h4>
                      <p className="text-sm text-text-secondary">{selectedProject?.challenges}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Testimonial */}
              {selectedProject?.testimonial && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Icon name="Quote" size={20} className="text-primary mt-1" />
                    <div>
                      <p className="text-text-secondary italic mb-2">"{selectedProject?.testimonial?.comment}"</p>
                      <p className="text-sm font-medium text-text-primary">
                        - {selectedProject?.testimonial?.clientName}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Image Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-300 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-smooth z-10"
            >
              <Icon name="X" size={24} />
            </button>
            <Image
              src={lightboxImage}
              alt="Portfolio image"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioTab;