import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ReviewsTab = ({ worker }) => {
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showAllReviews, setShowAllReviews] = useState(false);

  const ratingFilters = [
    { value: 'all', label: 'All Reviews' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' }
  ];

  const filteredReviews = worker?.reviews?.filter(review => 
    selectedRating === 'all' || review?.rating === parseInt(selectedRating)
  );

  const sortedReviews = [...filteredReviews]?.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b?.rating - a?.rating;
      case 'lowest':
        return a?.rating - b?.rating;
      default:
        return 0;
    }
  });

  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews?.slice(0, 6);

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    worker?.reviews?.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();
  const totalReviews = worker?.reviews?.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reviews Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              {ratingFilters?.map((filter) => (
                <button
                  key={filter?.value}
                  onClick={() => setSelectedRating(filter?.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-smooth ${
                    selectedRating === filter?.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {filter?.label}
                </button>
              ))}
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-md bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {sortOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {displayedReviews?.map((review, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  {/* Reviewer Avatar */}
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    {review?.avatar ? (
                      <Image
                        src={review?.avatar}
                        alt={review?.reviewerName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <Icon name="User" size={20} className="text-text-secondary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Reviewer Info */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-card-foreground">{review?.reviewerName}</h4>
                        <p className="text-sm text-text-secondary">{formatDate(review?.date)}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5]?.map((star) => (
                          <Icon
                            key={star}
                            name="Star"
                            size={16}
                            className={`${
                              star <= review?.rating
                                ? 'text-accent fill-current' :'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="flex items-center space-x-2 mb-3">
                      <Icon name="Wrench" size={14} className="text-text-secondary" />
                      <span className="text-sm text-text-secondary">{review?.serviceType}</span>
                    </div>

                    {/* Review Content */}
                    <p className="text-text-secondary leading-relaxed mb-4">{review?.comment}</p>

                    {/* Review Categories */}
                    {review?.categories && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {Object.entries(review?.categories)?.map(([category, rating]) => (
                          <div key={category} className="text-center">
                            <div className="text-sm font-medium text-card-foreground capitalize">
                              {category}
                            </div>
                            <div className="flex items-center justify-center space-x-1 mt-1">
                              {[1, 2, 3, 4, 5]?.map((star) => (
                                <Icon
                                  key={star}
                                  name="Star"
                                  size={12}
                                  className={`${
                                    star <= rating
                                      ? 'text-accent fill-current' :'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Review Images */}
                    {review?.images && review?.images?.length > 0 && (
                      <div className="flex space-x-2 mb-4">
                        {review?.images?.map((image, imgIndex) => (
                          <div key={imgIndex} className="w-16 h-16 rounded-md overflow-hidden">
                            <Image
                              src={image}
                              alt={`Review image ${imgIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Worker Response */}
                    {review?.workerResponse && (
                      <div className="bg-muted rounded-lg p-4 mt-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon name="MessageCircle" size={16} className="text-primary" />
                          <span className="text-sm font-medium text-primary">Response from {worker?.name}</span>
                        </div>
                        <p className="text-sm text-text-secondary">{review?.workerResponse}</p>
                      </div>
                    )}

                    {/* Review Actions */}
                    <div className="flex items-center space-x-4 mt-4">
                      <button className="flex items-center space-x-1 text-sm text-text-secondary hover:text-text-primary transition-smooth">
                        <Icon name="ThumbsUp" size={14} />
                        <span>Helpful ({review?.helpfulCount || 0})</span>
                      </button>
                      <button className="flex items-center space-x-1 text-sm text-text-secondary hover:text-text-primary transition-smooth">
                        <Icon name="Flag" size={14} />
                        <span>Report</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {!showAllReviews && sortedReviews?.length > 6 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowAllReviews(true)}
                iconName="ChevronDown"
                iconPosition="right"
              >
                Show All Reviews ({sortedReviews?.length - 6} more)
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rating Overview */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Rating Overview</h3>
            
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-card-foreground">{worker?.rating?.toFixed(1)}</div>
              <div className="flex items-center justify-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5]?.map((star) => (
                  <Icon
                    key={star}
                    name="Star"
                    size={20}
                    className={`${
                      star <= Math.floor(worker?.rating)
                        ? 'text-accent fill-current'
                        : star - 0.5 <= worker?.rating
                        ? 'text-accent fill-current opacity-50' :'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-text-secondary">{totalReviews} reviews</div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1]?.map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm text-text-secondary w-6">{rating}</span>
                  <Icon name="Star" size={12} className="text-accent" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${totalReviews > 0 ? (ratingDistribution?.[rating] / totalReviews) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-text-secondary w-8">
                    {ratingDistribution?.[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Highlights */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Review Highlights</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Quality</span>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} className="text-accent" />
                  <span className="text-sm font-medium text-card-foreground">4.8</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Punctuality</span>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} className="text-accent" />
                  <span className="text-sm font-medium text-card-foreground">4.9</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Communication</span>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} className="text-accent" />
                  <span className="text-sm font-medium text-card-foreground">4.7</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Value for Money</span>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} className="text-accent" />
                  <span className="text-sm font-medium text-card-foreground">4.6</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Reviews</h3>
            <div className="space-y-4">
              {worker?.reviews?.slice(0, 3)?.map((review, index) => (
                <div key={index} className="border-b border-border last:border-b-0 pb-3 last:pb-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5]?.map((star) => (
                        <Icon
                          key={star}
                          name="Star"
                          size={12}
                          className={`${
                            star <= review?.rating
                              ? 'text-accent fill-current' :'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-text-secondary">{formatDate(review?.date)}</span>
                  </div>
                  <p className="text-sm text-text-secondary line-clamp-2">{review?.comment}</p>
                  <p className="text-xs text-text-secondary mt-1">- {review?.reviewerName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsTab;