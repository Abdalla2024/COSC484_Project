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
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to fetch listings: ${response.status}`);
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
        throw new Error(error.error || `Failed to create listing: ${response.status}`);
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
      console.log(`Fetching listing with ID: ${id} from URL: ${API_URL}/api/listing/${id}`);
      const response = await fetch(`${API_URL}/api/listing/${id}`);
      
      if (!response.ok) {
        console.error(`Error response from server: ${response.status} ${response.statusText}`);
        const error = await response.json();
        throw new Error(error.error || `Failed to fetch listing: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Full listing data received:', data);
      console.log('Seller data in response:', data.seller);
      return data;
    } catch (error) {
      console.error('Error fetching listing:', error);
      throw error;
    }
  },

  updateListing: async (id, updateData) => {
    try {
      console.log('Raw update data:', updateData);
      console.log('Data types:', {
        title: typeof updateData.title,
        description: typeof updateData.description,
        price: typeof updateData.price,
        condition: typeof updateData.condition,
        category: typeof updateData.category,
        status: typeof updateData.status,
        deliveryMethod: typeof updateData.deliveryMethod
      });

      // Ensure the ID is a string
      const listingId = id.toString();
      const url = `${API_URL}/api/listing/${listingId}`;
      console.log('Update URL:', url);

      // Log the exact data being sent
      const requestBody = JSON.stringify(updateData);
      console.log('Request body:', requestBody);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: requestBody
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || `Failed to update listing: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Update successful:', data);
      return data;
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  },

  deleteListing: async (id) => {
    try {
      console.log(`Deleting listing with ID: ${id}`);
      const response = await fetch(`${API_URL}/api/listing/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || `Failed to delete listing: ${response.status}`);
      }

      const data = await response.json();
      console.log('Delete successful:', data);
      return data;
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  }
};

export default listingService; 