import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import { formatDistanceToNow } from 'date-fns';
import AccountPFP from '../components/AccountPFP';

function Listing() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock listing with multiple images
  const mockListing = {
    id: id,
    title: "Computer Science Textbook",
    description: "Latest edition, barely used. Perfect condition with no markings or highlights. Includes online access code that hasn't been used. Great for CS101 and CS102 courses.",
    price: 75.00,
    status: "active",
    condition: "like_new",
    category: "Textbooks",
    images: [
      `https://picsum.photos/seed/${id}/800/600`,
      `https://picsum.photos/seed/${id + 1}/800/600`,
      `https://picsum.photos/seed/${id + 2}/800/600`,
      `https://picsum.photos/seed/${id + 3}/800/600`,
      `https://picsum.photos/seed/${id + 4}/800/600`,
    ],
    date: "2024-03-15",
    offers: 2,
    deliveryMethod: "both",
    meetupLocation: "Starbucks on Main St"
  };

  const mockUser = {
    id: "user123",
    username: "JohnDoe",
    profilePicture: "https://via.placeholder.com/40",
    isOnline: true,
    rating: 4.8
  };

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const deliveryOptions = [
    { value: 'Delivery', label: 'Delivery Only' },
    { value: 'meetup', label: 'Meetup Only' },
    { value: 'both', label: 'Shipping or Meetup' }
  ];

  const handleMessageClick = () => {
    navigate('/messaging');
  };

  const handleReviewsClick = () => {
    navigate(`/account-reviews/${mockUser.id}`);
  };

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  const handleBuyNow = () => {
    navigate(`/checkout/${id}`);
  };

  return (
    <div className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div 
              className="relative bg-white rounded-lg shadow-sm overflow-hidden cursor-zoom-in"
              onClick={handleImageClick}
            >
              <img
                src={mockListing.images[selectedImage]}
                alt={mockListing.title}
                className={`w-full h-[600px] object-contain transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-5 gap-3">
              {mockListing.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-[#FFBB00]' : 'ring-1 ring-gray-200'
                  } hover:opacity-90 transition-opacity`}
                >
                  <img
                    src={image}
                    alt={`${mockListing.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Listing Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {mockListing.title}
              </h1>
              <p className="text-2xl font-bold text-[#FFB800] mb-4">
                ${mockListing.price}
              </p>
              
              {/* Condition */}
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Condition:</span>
                <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-[#FFBB00] text-black">
                  {conditions.find(c => c.value === mockListing.condition)?.label}
                </span>
              </div>

              {/* Category */}
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Category:</span>
                <span className="ml-2 text-gray-600">{mockListing.category}</span>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  {mockListing.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Posted {formatDistanceToNow(new Date(mockListing.date), { addSuffix: true })}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    mockListing.status === 'sold' ? 'bg-red-100 text-red-800' :
                    mockListing.status === 'active' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {mockListing.status}
                  </span>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="mt-4">
                <span className="text-sm font-medium text-gray-700">Delivery Method:</span>
                <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-[#FFBB00] text-black">
                  {deliveryOptions.find(d => d.value === mockListing.deliveryMethod)?.label}
                </span>
                {mockListing.meetupLocation && (
                  <p className="mt-2 text-sm text-gray-600">
                    Meetup Location: {mockListing.meetupLocation}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                onClick={handleBuyNow}
                className="w-full bg-[#FFB800] text-black py-3 px-4 rounded-md hover:bg-[#FFB800]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB800] flex items-center justify-center"
              >
                Buy Now
              </button>

              <button
                onClick={handleMessageClick}
                className="w-full bg-white text-[#FFB800] border-2 border-[#FFB800] py-3 px-4 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB800] flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                Message Seller
              </button>

              {/* Seller Profile Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <AccountPFP user={mockUser} />
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={handleReviewsClick}
                      className="flex items-center space-x-2 text-sm text-[#FFB800] hover:text-[#FFB800]/80 bg-white px-4 py-2 rounded-full border border-[#FFB800] hover:bg-[#FFB800]/10 transition-all"
                    >
                      <span className="font-medium">⭐ {mockUser.rating}</span>
                      <span className="underline">See Reviews</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Listings Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((num) => (
              <ListingCard
                key={`similar-${num}`}
                listing={{
                  id: `similar-${num}`,
                  title: `Similar Item ${num}`,
                  description: "Another great item you might be interested in",
                  price: (Math.random() * 100).toFixed(2),
                  status: "active",
                  imageUrl: `https://picsum.photos/seed/${num + 10}/800/600`,
                  date: "2024-03-15",
                  offers: Math.floor(Math.random() * 5)
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative w-full h-full p-4 flex items-center justify-center">
            <img
              src={mockListing.images[selectedImage]}
              alt={mockListing.title}
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setIsZoomed(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Listing;