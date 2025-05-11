// Use environment variable for API URL
const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'http://localhost:3000';
console.log('Using API_URL in reviewService:', API_URL);

export const reviewService = {
  // Get all reviews
  getAllReviews: async () => {
    try {
      const response = await fetch(`${API_URL}/api/reviews`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch reviews');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },
  
  // Get reviews for a specific seller
  getSellerReviews: async (sellerId) => {
    try {
      console.log(`Fetching reviews for seller: ${sellerId}`);
      const response = await fetch(`${API_URL}/api/reviews/seller/${sellerId}`);
      
      if (!response.ok) {
        console.error(`Error response from server: ${response.status} ${response.statusText}`);
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch seller reviews');
      }
      
      const reviews = await response.json();
      console.log(`Found ${reviews.length} reviews for seller ${sellerId}`);
      return reviews;
    } catch (error) {
      console.error('Error fetching seller reviews:', error);
      throw error;
    }
  },
  
  // Get reviews written by a specific user
  getReviewsByUser: async (reviewerId) => {
    try {
      console.log(`Fetching reviews written by: ${reviewerId}`);
      const response = await fetch(`${API_URL}/api/reviews/reviewer/${reviewerId}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch user reviews');
      }
      
      const reviews = await response.json();
      console.log(`Found ${reviews.length} reviews written by user ${reviewerId}`);
      return reviews;
    } catch (error) {
      console.error('Error fetching reviews by user:', error);
      throw error;
    }
  },
  
  // Get reviews for a specific listing
  getListingReviews: async (listingId) => {
    try {
      console.log(`Fetching reviews for listing: ${listingId}`);
      const response = await fetch(`${API_URL}/api/reviews/listing/${listingId}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch listing reviews');
      }
      
      const reviews = await response.json();
      console.log(`Found ${reviews.length} reviews for listing ${listingId}`);
      return reviews;
    } catch (error) {
      console.error('Error fetching listing reviews:', error);
      throw error;
    }
  },
  
  // Create a new review
  createReview: async (reviewData) => {
    try {
      console.log('Creating new review with data:', reviewData);
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(reviewData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create review');
      }
      
      const newReview = await response.json();
      console.log('Review created successfully:', newReview);
      return newReview;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },
  
  // Update an existing review
  updateReview: async (reviewId, reviewData) => {
    try {
      console.log(`Updating review ${reviewId} with data:`, reviewData);
      const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(reviewData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update review');
      }
      
      const updatedReview = await response.json();
      console.log('Review updated successfully:', updatedReview);
      return updatedReview;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },
  
  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      console.log(`Deleting review: ${reviewId}`);
      const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete review');
      }
      
      const result = await response.json();
      console.log('Review deleted successfully');
      return result;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
};

export default reviewService; 