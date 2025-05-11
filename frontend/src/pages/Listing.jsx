import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import { format } from 'timeago.js';
import AccountPFP from '../components/AccountPFP';
import listingService from '../services/listingService';

function Listing() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await listingService.getListingById(id);
        console.log('Fetched listing data:', data);
        console.log('Seller data:', data.seller);
        setListing(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const deliveryOptions = [
    { value: 'Shipping', label: 'Delivery Only' },
    { value: 'Meetup', label: 'Meetup Only' },
    { value: 'Both', label: 'Shipping or Meetup' }
  ];

  const handleMessageClick = () => {
    console.log('Message seller clicked');
    console.log('Listing data:', listing);
    console.log('Seller ID from listing.sellerId:', listing?.sellerId);
    
    if (listing?.sellerId) {
      console.log('Navigating to:', `/messages/${listing.sellerId}`);
      navigate(`/messages/${listing.sellerId}`);
    } else {
      console.error('Unable to navigate: sellerId is missing');
    }
  }

  const handleReviewsClick = () => {
    navigate(`/reviews/${listing?.sellerId}`);
  };

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  const handleBuyNow = () => {
    navigate(`/checkout/${id}`);
  };

  const handleSellerClick = () => {
    console.log('Seller clicked, navigating to:', `/profile/${listing?.sellerId}`);
    navigate(`/profile/${listing?.sellerId}`);
  };

  // Default profile picture URL
  const defaultPfp = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return format(new Date(dateString));
    } catch (err) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading listing...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-xl text-gray-600">Listing not found</div>
      </div>
    );
  }

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
                src={listing.images?.[selectedImage] || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'}
                alt={listing.title}
                className={`w-full h-[600px] object-contain transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
                }}
              />
            </div>

            {/* Thumbnail Gallery */}
            {listing.images && listing.images.length > 0 && (
              <div className="grid grid-cols-5 gap-3">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden ${selectedImage === index ? 'ring-2 ring-[#FFBB00]' : 'ring-1 ring-gray-200'
                      } hover:opacity-90 transition-opacity`}
                  >
                    <img
                      src={image}
                      alt={`${listing.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Listing Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {listing.title}
              </h1>
              <p className="text-2xl font-bold text-[#FFB800] mb-4">
                ${listing.price}
              </p>

              {/* Condition */}
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Condition:</span>
                <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-[#FFBB00] text-black">
                  {conditions.find(c => c.value === listing.condition)?.label}
                </span>
              </div>

              {/* Category */}
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Category:</span>
                <span className="ml-2 text-gray-600">{listing.category}</span>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  {listing.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Posted {formatDate(listing.createdAt)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${listing.status === 'sold' ? 'bg-red-100 text-red-800' :
                    listing.status === 'active' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {listing.status}
                  </span>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="mt-4">
                <span className="text-sm font-medium text-gray-700">Delivery Method:</span>
                <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-[#FFBB00] text-black">
                  {deliveryOptions.find(d => d.value === listing.deliveryMethod)?.label}
                </span>
                {listing.meetupLocation && (
                  <p className="mt-2 text-sm text-gray-600">
                    Meetup Location: {listing.meetupLocation}
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

              {/* Seller Info Section */}
              <div className="flex flex-col items-start gap-2 mb-6">
                <div
                  onClick={() => navigate(`/profile/${listing?.sellerId}`)}
                  className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors"
                >
                  <div className="relative">
                    <img
                      src={listing?.seller?.profileImage || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
                      alt={listing?.seller?.username}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
                      }}
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>

                  <span className="text-xl font-medium text-black">{listing?.seller?.username || 'Unknown User'}</span>
                </div>

                <div
                  onClick={() => navigate(`/reviews/${listing?.sellerId}`)}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  See Reviews →
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
              src={listing.images?.[selectedImage] || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'}
              alt={listing.title}
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