import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

function UserProfile() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' or 'reviews'

  // Mock user data - would come from API
  const mockUser = {
    id: userId,
    username: "JohnDoe",
    joinedDate: "January 2024",
    rating: 4.8,
    totalReviews: 47,
    profileImage: `https://picsum.photos/seed/${userId}/150/150`,
    listings: [
      {
        id: '1',
        title: "Computer Science Textbook",
        price: 75.00,
        image: `https://picsum.photos/seed/1/400/300`,
        condition: "Like New",
        status: "active"
      },
      {
        id: '2',
        title: "Calculus Textbook",
        price: 50.00,
        image: `https://picsum.photos/seed/2/400/300`,
        condition: "Good",
        status: "sold"
      },
      // Add more mock listings as needed
    ]
  };

  const StarRating = ({ rating }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          className={index < Math.floor(rating) ? "text-[#FFB800]" : "text-gray-300"}
        />
      ))}
      <span className="ml-2 text-lg font-semibold">{rating}</span>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={mockUser.profileImage}
                alt={mockUser.username}
                className="w-24 h-24 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
                }}
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{mockUser.username}</h1>
              <p className="text-gray-600">Member since {mockUser.joinedDate}</p>
              <div className="mt-2">
                <StarRating rating={mockUser.rating} />
                <Link
                  to={`/reviews/${userId}`}
                  className="text-[#FFB800] hover:text-[#FFB800]/80 text-sm"
                >
                  {mockUser.totalReviews} reviews
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'listings'
                ? 'bg-[#FFB800] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            Listings
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'reviews'
                ? 'bg-[#FFB800] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            Reviews
          </button>
        </div>

        {/* Listings Grid */}
        {activeTab === 'listings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockUser.listings.map(listing => (
              <Link
                to={`/listing/${listing.id}`}
                key={listing.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  {listing.status === 'sold' && (
                    <div className="absolute top-2 right-2 bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm">
                      Sold
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-[#FFB800] font-bold">
                      ${listing.price.toFixed(2)}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {listing.condition}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Reviews Tab Content */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <Link
              to={`/reviews/${userId}`}
              className="block text-center text-[#FFB800] hover:text-[#FFB800]/80"
            >
              View All Reviews
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile; 