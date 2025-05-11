import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ListingCard from '../components/ListingCard';

// Mock user data
const mockUser = {
  _id: 'user123',
  username: 'JohnDoe',
  profileImage: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
  rating: 4.8,
  listings: [
    {
      _id: '1',
      title: 'Computer Science Textbook',
      price: 75.00,
      condition: 'Like New',
      category: 'Textbooks',
      images: ['https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'],
      createdAt: new Date().toISOString(),
      status: 'active'
    }
  ]
};

function Profile() {
  const { userId } = useParams();
  const [user] = useState(mockUser);

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-6xl mx-auto p-4">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <img
              src={user.profileImage}
              alt={user.username}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#FFB800]"
              onError={(e) => {
                e.target.src = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
              }}
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xl font-semibold text-black">{user.username}</span>
            <div className="flex items-center">
              <span className="text-[#FFB800] text-xl">★</span>
              <span className="text-xl font-medium ml-1 text-black">{user.rating}</span>
            </div>
            <Link
              to={`/reviews/${user._id}`}
              className="text-blue-600 hover:underline"
            >
              See Reviews →
            </Link>
          </div>
        </div>

        {/* User's Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.listings.map(listing => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
          {user.listings.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No listings available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile; 