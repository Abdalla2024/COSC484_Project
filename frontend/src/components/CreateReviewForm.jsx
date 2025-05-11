import { useState, useEffect } from 'react';
import { FaStar, FaStarHalf } from 'react-icons/fa';
import reviewService from '../services/reviewService';

// Star rating display component
const StarRatingDisplay = ({ rating = 0 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center">
      {rating > 0 ? (
        <>
          {[...Array(fullStars)].map((_, i) => (
            <FaStar key={i} className="text-[#FFB800]" />
          ))}
          {hasHalfStar && <FaStarHalf className="text-[#FFB800]" />}
          {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
            <FaStar key={`empty-${i}`} className="text-gray-300" />
          ))}
        </>
      ) : (
        // Show 5 empty stars when rating is 0
        [...Array(5)].map((_, i) => (
          <FaStar key={`empty-${i}`} className="text-gray-300" />
        ))
      )}
    </div>
  );
};

const CreateReviewForm = ({ sellerId, onReviewCreated }) => {
  // Form state
  const [rating, setRating] = useState(1);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hoveredRating, setHoveredRating] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Reset form completely when sellerId changes
  useEffect(() => {
    resetForm();
  }, [sellerId]);
  
  // Function to reset the form to default values
  const resetForm = () => {
    setRating(1);
    setTitle('');
    setContent('');
    setHoveredRating(null);
    setError(null);
    setSuccess(false);
  };
  
  // Sample review data for preview
  const reviewerName = 'Anonymous';
  const reviewDate = new Date().toLocaleDateString();
  const sampleReview = {
    title: 'Preview Title',
    content: 'Your review will appear here'
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleRatingHover = (value) => {
    setHoveredRating(value);
  };

  const handleRatingLeave = () => {
    setHoveredRating(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter a review comment');
      return;
    }
    
    if (!rating) {
      setError('Please select a rating');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const reviewerId = localStorage.getItem('userId') || '65f1eb587f284a2f2a5d6ef5';
      
      const reviewData = {
        reviewerId,
        sellerId,
        rating,
        title: title.trim() || undefined,
        content: content.trim()
      };
      
      const result = await reviewService.createReview(reviewData);
      console.log('Review submitted:', result);
      
      // Show success message
      setSuccess(true);
      
      // Reset form completely
      resetForm();
      
      // Notify parent component
      if (typeof onReviewCreated === 'function') {
        onReviewCreated(result);
      }
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-8 border border-gray-300">
      <div className="mb-6 bg-white rounded-lg p-4 border border-gray-300">
        <h2 className="text-xl font-bold mb-4 text-black">Review Preview</h2>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-black">{reviewerName}</h3>
            <p className="text-gray-700 text-sm">{reviewDate}</p>
          </div>
          <StarRatingDisplay rating={rating} />
        </div>
        {title ? (
          <h4 className="font-semibold mb-2 text-black">{title}</h4>
        ) : (
          content ? null : <h4 className="font-semibold mb-2 text-gray-500 italic">{sampleReview.title}</h4>
        )}
        {content ? (
          <p className="text-black">{content}</p>
        ) : (
          <p className="text-gray-500 italic">{sampleReview.content}</p>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4 text-black">Write a Review</h2>
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md border border-green-300">
          Your review was submitted successfully!
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md border border-red-300">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="text-black">
        <div className="mb-4">
          <label className="block text-gray-800 font-semibold mb-2">Rating</label>
          <div className="flex gap-1 items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer text-3xl ${
                  (hoveredRating || rating) >= star
                    ? 'text-[#FFB800]'
                    : 'text-gray-400'
                }`}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => handleRatingHover(star)}
                onMouseLeave={handleRatingLeave}
              />
            ))}
            <span className="ml-2 text-black font-medium">{rating} out of 5</span>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="review-title" className="block text-gray-800 font-semibold mb-2">
            Title (Optional)
          </label>
          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="Summarize your experience"
            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-black bg-white"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="review-content" className="block text-gray-800 font-semibold mb-2">
            Review
          </label>
          <textarea
            id="review-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="What did you like or dislike about this seller?"
            className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-black bg-white"
            required
          />
          <div className="text-right text-sm text-gray-700 mt-1">
            {content.length}/1000
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#FFB800] text-black font-semibold py-3 px-4 rounded-md hover:bg-[#FFB800]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB800] disabled:opacity-50 border border-[#E5A700]"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default CreateReviewForm; 