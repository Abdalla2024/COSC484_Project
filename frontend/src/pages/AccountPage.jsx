import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// Mock user data
const mockUser = {
  _id: '123',
  username: 'JohnDoe',
  profileImage: 'https://via.placeholder.com/100',
  rating: 4.5,
  listings: [
    {
      _id: '1',
      title: 'Used Textbook',
      price: 25.99,
      condition: 'Good',
      category: 'Books',
      images: ['https://via.placeholder.com/400x300'],
      createdAt: new Date().toISOString(),
      status: 'active'
    },
    {
      _id: '2',
      title: 'Coffee Maker',
      price: 45.00,
      condition: 'Like New',
      category: 'Appliances',
      images: ['https://via.placeholder.com/400x300'],
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      status: 'active'
    }
  ]
};

function AccountPage() {
  const { userId } = useParams();
  const [user] = useState(mockUser); // Using mock data instead of API call

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-6">
          <img
            src={user.profileImage}
            alt={user.username}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                <span className="text-[#FFB800]">★</span>
                <span className="ml-1">{user.rating.toFixed(1)}</span>
              </div>
              <Link 
                to={`/reviews/${userId}`}
                className="text-blue-600 hover:underline"
              >
                View Reviews
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* User's Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {user.listings.map(listing => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
}

export default AccountPage; 