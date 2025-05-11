import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import userService from '../services/userService';
import { FaStar } from 'react-icons/fa';

function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Profile component rendering with userId:", userId);
  console.log("Current route:", window.location.pathname);

  useEffect(() => {
    document.title = `Profile - User ${userId}`;
    
    const fetchUserData = async () => {
      console.log("Fetching user data for ID:", userId);
      try {
        setLoading(true);
        
        // Fetch user profile
        console.log("Requesting user profile from API...");
        const userData = await userService.getUserById(userId);
        console.log("User data received:", userData);
        setUser(userData);
        
        // Fetch user's listings
        console.log("Requesting user listings from API...");
        const userListings = await userService.getUserListings(userId);
        console.log("User listings received:", userListings);
        setListings(userListings);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const StarRating = ({ rating = 0 }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          className={index < Math.floor(rating) ? "text-[#FFB800]" : "text-gray-300"}
          size={18}
        />
      ))}
      <span className="ml-1 text-xl font-medium text-black">{rating.toFixed(1)}</span>
    </div>
  );

  console.log("Component state:", { loading, error, user, listingsCount: listings.length });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading user profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-lg w-full text-center">
          <div className="text-red-500 text-5xl mb-4">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-gray-500 mb-4">User ID: {userId}</p>
          <Link to="/" className="inline-block bg-[#FFB800] text-black py-2 px-6 rounded-lg hover:bg-[#FFB800]/90">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-lg w-full text-center">
          <div className="text-gray-400 text-5xl mb-4">
            <i className="fas fa-user-slash"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the user you're looking for.</p>
          <p className="text-gray-500 mb-4">ID: {userId}</p>
          <Link to="/" className="inline-block bg-[#FFB800] text-black py-2 px-6 rounded-lg hover:bg-[#FFB800]/90">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Get user display name or username
  const displayName = user.displayName || user.username || (user.email ? user.email.split('@')[0] : 'Unknown User');
  
  // Get first letter of name for avatar fallback
  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto p-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#FFB800]"
                  onError={(e) => {
                    e.target.src = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
                  }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#FFB800] flex items-center justify-center text-white font-bold text-2xl">
                  {getInitials(displayName)}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-black">{displayName}</h1>
              <div className="text-gray-500">{user.email}</div>
              <div className="mt-2 flex items-center gap-4">
                <StarRating rating={user.rating || 0} />
                <Link
                  to={`/reviews/${user._id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  See Reviews →
                </Link>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Listings ({listings.length})</h2>
        </div>

        {/* User's Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
          {listings.length === 0 && (
            <div className="col-span-full text-center py-10 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No listings available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile; 