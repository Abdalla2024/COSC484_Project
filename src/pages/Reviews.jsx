import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaStarHalf } from 'react-icons/fa';

function Reviews() {
  const { sellerId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const reviewsPerPage = 5;

  // Mock data - would come from API
  const mockSellerData = {
    name: "JohnDoe",
    averageRating: 4.8,
    totalReviews: 47,
    ratingBreakdown: {
      5: 30,
      4: 12,
      3: 3,
      2: 1,
      1: 1
    }
  };

  const mockReviews = Array.from({ length: 47 }, (_, i) => ({
    id: i + 1,
    reviewer: `User${i + 1}`,
    rating: Math.floor(Math.random() * 2) + 4, // Random rating between 4-5
    date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
    comment: "Great seller! Item was exactly as described and meetup was smooth.",
  }));

  // Sorting logic
  const sortReviews = (reviews) => {
    switch (sortBy) {
      case 'highest':
        return [...reviews].sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return [...reviews].sort((a, b) => a.rating - b.rating);
      case 'newest':
      default:
        return [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  };

  // Pagination
  const totalPages = Math.ceil(mockReviews.length / reviewsPerPage);
  const sortedReviews = sortReviews(mockReviews);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  // Star rating component
  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={i} className="text-[#FFB800]" />
        ))}
        {hasHalfStar && <FaStarHalf className="text-[#FFB800]" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <FaStar key={`empty-${i}`} className="text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {/* Overall Rating Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Seller Reviews</h1>
              <p className="text-gray-600">{mockSellerData.name}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-[#FFB800]">
                  {mockSellerData.averageRating}
                </span>
                <StarRating rating={mockSellerData.averageRating} />
              </div>
              <p className="text-gray-600">{mockSellerData.totalReviews} reviews</p>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {Object.entries(mockSellerData.ratingBreakdown)
              .reverse()
              .map(([rating, count]) => (
                <div key={rating} className="flex items-center gap-4">
                  <span className="w-12 text-sm text-gray-600">{rating} stars</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FFB800]"
                      style={{
                        width: `${(count / mockSellerData.totalReviews) * 100}%`
                      }}
                    />
                  </div>
                  <span className="w-12 text-sm text-gray-600">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Sorting Controls */}
        <div className="flex justify-end mb-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
          >
            <option value="newest">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        {/* Reviews List */}
        <div className="space-y-4 mb-8">
          {paginatedReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">{review.reviewer}</h3>
                  <p className="text-gray-500 text-sm">{review.date}</p>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
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
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reviews; 