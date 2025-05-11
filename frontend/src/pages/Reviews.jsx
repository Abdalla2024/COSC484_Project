import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaStarHalf } from 'react-icons/fa';
import userService from '../services/userService';
import reviewService from '../services/reviewService';
import CreateReviewForm from '../components/CreateReviewForm';

function Reviews() {
  const { sellerId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const reviewsPerPage = 5;

  // Add state for current user
  const [currentUser, setCurrentUser] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch the seller data
        console.log('Fetching seller data for ID:', sellerId);
        const sellerData = await userService.getUserById(sellerId);
        setSeller(sellerData);
        console.log('Seller data:', sellerData);
        
        // Fetch reviews for this seller
        console.log('Fetching reviews for seller ID:', sellerId);
        const reviewsData = await reviewService.getSellerReviews(sellerId);
        console.log('Reviews data:', reviewsData);
        setReviews(reviewsData);
        
        // Get current user from localStorage for auth state
        const userId = localStorage.getItem('userId');
        console.log('Current user ID from localStorage:', userId);
        if (userId) {
          setCurrentUser({ _id: userId });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching review data:', err);
        setError(err.message || 'Failed to load reviews');
        setLoading(false);
      }
    };

    fetchData();
  }, [sellerId]);

  // Calculate rating breakdown
  const calculateRatingBreakdown = (reviewsList) => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    reviewsList.forEach(review => {
      const rating = Math.floor(review.rating);
      if (rating >= 1 && rating <= 5) {
        breakdown[rating]++;
      }
    });
    
    return breakdown;
  };
  
  // Calculate average rating
  const calculateAverageRating = (reviewsList) => {
    if (!reviewsList || reviewsList.length === 0) return 0;
    
    const sum = reviewsList.reduce((total, review) => total + review.rating, 0);
    return (sum / reviewsList.length).toFixed(1);
  };

  // Sorting logic
  const sortReviews = (reviewsList) => {
    if (!reviewsList) return [];
    
    switch (sortBy) {
      case 'highest':
        return [...reviewsList].sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return [...reviewsList].sort((a, b) => a.rating - b.rating);
      case 'newest':
      default:
        return [...reviewsList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  // Pagination
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const sortedReviews = sortReviews(reviews);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );
  
  // Calculate display data
  const averageRating = calculateAverageRating(reviews);
  const ratingBreakdown = calculateRatingBreakdown(reviews);

  // Star rating component
  const StarRating = ({ rating = 0 }) => {
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle new review creation or update
  const handleReviewCreated = (newReview) => {
    console.log('Review received:', newReview);
    
    if (newReview.wasUpdated) {
      // This was an update to an existing review
      console.log('Updating existing review');
      
      // Find and update the existing review in the list
      const updatedReviews = reviews.map(review => 
        review._id === newReview._id ? newReview : review
      );
      
      setReviews(updatedReviews);
    } else {
      // This was a brand new review
      console.log('Adding new review to list');
      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);
    }
    
    // Recalculate averages and breakdowns
    // Use setTimeout to ensure state has updated
    setTimeout(() => {
      const newAverage = calculateAverageRating(reviews);
      console.log('New average rating:', newAverage);
    }, 0);
    
    // Update the current page to show the new review
    setCurrentPage(1);
    
    // Hide the form if it was shown conditionally
    setShowReviewForm(false);
  };

  // Check if user has already reviewed this seller
  const hasUserReviewed = currentUser && reviews.some(review => {
    const reviewerId = review.reviewerId;
    const currentUserId = currentUser._id;
    
    // Handle case where reviewerId might be an object or string
    if (typeof reviewerId === 'object' && reviewerId !== null) {
      return reviewerId._id === currentUserId;
    }
    
    // Direct string comparison
    return reviewerId === currentUserId;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
        <div className="text-xl text-red-600 mb-4">{error}</div>
        <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {/* Overall Rating Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-black">Seller Reviews</h1>
              <p className="text-gray-700">
                {seller?.displayName || seller?.username || (seller?.email ? seller.email.split('@')[0] : 'Unknown Seller')}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-[#FFB800]">
                  {averageRating}
                </span>
                <StarRating rating={parseFloat(averageRating)} />
              </div>
              <p className="text-gray-700">{reviews.length} reviews</p>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {Object.entries(ratingBreakdown)
              .reverse()
              .map(([rating, count]) => (
                <div key={rating} className="flex items-center gap-4">
                  <span className="w-12 text-sm text-gray-700">{rating} stars</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FFB800]"
                      style={{
                        width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="w-12 text-sm text-gray-700">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Sorting Controls */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link to={`/profile/${sellerId}`} className="text-blue-600 hover:underline">
              ← Back to Seller Profile
            </Link>
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-4 pr-10 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-black bg-white"
            >
              <option value="newest">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Reviews List - Now displayed BEFORE the form */}
        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center mb-8">
            <p className="text-black mb-4">This seller has no reviews yet.</p>
            <Link 
              to={`/profile/${sellerId}`} 
              className="inline-block bg-[#FFB800] text-black px-4 py-2 rounded-md"
            >
              View Seller's Listings
            </Link>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {paginatedReviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-black">
                      {review.reviewerId?.displayName || 
                       review.reviewerId?.username || 
                       (review.reviewerId?.email ? review.reviewerId.email.split('@')[0] : 'Anonymous')}
                    </h3>
                    <p className="text-gray-700 text-sm">{formatDate(review.createdAt)}</p>
                    {review.verified && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                {review.title && (
                  <h4 className="font-semibold mb-2 text-black">{review.title}</h4>
                )}
                <p className="text-black">{review.content}</p>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination - Before the form */}
        {reviews.length > reviewsPerPage && (
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            {totalPages <= 7 ? (
              // Show all page numbers if 7 or fewer
              [...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 border rounded-md ${
                    currentPage === i + 1
                      ? 'bg-[#FFB800] text-white border-[#FFB800]'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))
            ) : (
              // Show limited page numbers with ellipsis for many pages
              <>
                {[1, 2, 3].map(number => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage === number
                        ? 'bg-[#FFB800] text-white border-[#FFB800]'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                <span className="px-4 py-2">...</span>
                {[totalPages - 2, totalPages - 1, totalPages].map(number => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage === number
                        ? 'bg-[#FFB800] text-white border-[#FFB800]'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </>
            )}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
        
        {/* Review Form - Now displayed AFTER the reviews */}
        <div className="mb-8">
          <CreateReviewForm 
            sellerId={sellerId} 
            onReviewCreated={handleReviewCreated} 
          />
        </div>
        
        {/* Hide all conditional review form sections
        <div className="mb-8">
          {showReviewForm ? (
            <CreateReviewForm 
              sellerId={sellerId} 
              onReviewCreated={handleReviewCreated} 
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <p className="mb-4">Have you interacted with this seller? Share your experience!</p>
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-[#FFB800] text-black px-6 py-2 rounded-md hover:bg-[#FFB800]/90"
              >
                Write a Review
              </button>
            </div>
          )}
        </div>
        */}
      </div>
    </div>
  );
}

export default Reviews; 