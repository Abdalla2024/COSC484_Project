// Use environment variable for API URL
const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'http://localhost:3000';
console.log('Using API_URL:', API_URL);

export const listingService = {
  // Get all listings
  getAllListings: async () => {
    try {
      console.log('Fetching listings from:', `${API_URL}/api/listing`);
      const response = await fetch(`${API_URL}/api/listing`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch listings');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  },

  // Create a new listing
  createListing: async (listingData) => {
    try {
      // Log the data being sent
      console.log('Sending listing data:', listingData);

      const response = await fetch(`${API_URL}/api/listing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create listing');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  },

  uploadImages: async (images) => {
    // For now, we'll just return URLs of the images
    // In a production environment, you'd want to upload these to a storage service
    return images.map(image => URL.createObjectURL(image));
  },

  getListingById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/listing/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch listing');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching listing:', error);
      throw error;
    }
  }
};

export default listingService; 