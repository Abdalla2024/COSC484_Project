// Use environment variable for API URL
const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'http://localhost:3000';
console.log('Using API_URL in userService:', API_URL);

export const userService = {
  // Get user profile by ID
  getUserById: async (userId) => {
    try {
      console.log(`Fetching user with ID: ${userId} from ${API_URL}/api/users/${userId}`);
      const response = await fetch(`${API_URL}/api/users/${userId}`);
      
      if (!response.ok) {
        console.error(`Error response from server: ${response.status} ${response.statusText}`);
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          console.error('Could not parse error response as JSON:', e);
        }
        
        if (response.status === 404) {
          throw new Error('User not found');
        } else {
          throw new Error(errorData.error || `API error: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log('User data received:', data);
      
      // If data is empty or not what we expect, throw an error
      if (!data || !data._id) {
        throw new Error('Invalid user data received from server');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
  
  // Get user's listings by user ID
  getUserListings: async (userId) => {
    try {
      console.log(`Fetching listings for user: ${userId}`);
      const response = await fetch(`${API_URL}/api/listing/user/${userId}`);
      
      if (!response.ok) {
        console.error(`Error response from server: ${response.status} ${response.statusText}`);
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch user listings');
      }
      
      const listings = await response.json();
      console.log(`Found ${listings.length} listings for user ${userId}`);
      return listings;
    } catch (error) {
      console.error('Error fetching user listings:', error);
      throw error;
    }
  },
  
  // Sync user (create or update) from Firebase to MongoDB
  syncUser: async (firebaseUser) => {
    try {
      console.log('Syncing user:', firebaseUser);
      const response = await fetch(`${API_URL}/api/users/sync`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || ''
        })
      });
      
      if (!response.ok) {
        console.error(`Error response from server: ${response.status} ${response.statusText}`);
        const error = await response.json();
        throw new Error(error.error || 'Failed to sync user');
      }
      
      const userData = await response.json();
      console.log('User synced successfully:', userData);
      return userData;
    } catch (error) {
      console.error('Error syncing user:', error);
      throw error;
    }
  }
};

export default userService; 