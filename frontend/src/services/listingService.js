// Use environment variable for API URL, fallback to localhost for development
const API_URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api`;

export const listingService = {
  // Get all listings
  getAllListings: async () => {
    try {
      console.log('Fetching listings from:', `${API_URL}/listing`);
      const response = await fetch(`${API_URL}/listing`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to fetch listings:', {
          status: response.status,
          statusText: response.statusText,
          error
        });
        throw new Error(error.error || 'Failed to fetch listings');
      }
      const data = await response.json();
      console.log('Successfully fetched listings:', data);
      return data;
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  },

  // Create a new listing
  createListing: async (listingData) => {
    try {
      console.log('Creating listing with data:', listingData);
      console.log('Sending request to:', `${API_URL}/listing`);

      const response = await fetch(`${API_URL}/listing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData)
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to create listing:', {
          status: response.status,
          statusText: response.statusText,
          error
        });
        throw new Error(error.error || 'Failed to create listing');
      }
      const data = await response.json();
      console.log('Successfully created listing:', data);
      return data;
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
      console.log('Fetching listing by ID:', id);
      const response = await fetch(`${API_URL}/listing/${id}`);
      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to fetch listing:', {
          status: response.status,
          statusText: response.statusText,
          error
        });
        throw new Error(error.error || 'Failed to fetch listing');
      }
      const data = await response.json();
      console.log('Successfully fetched listing:', data);
      return data;
    } catch (error) {
      console.error('Error fetching listing:', error);
      throw error;
    }
  }
};

export default listingService; 