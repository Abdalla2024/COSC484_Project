import { useParams } from 'react-router-dom';
import ListingCard from '../components/ListingCard';

function Listing() {
  const { id } = useParams();

  // This would normally come from your backend
  const mockListing = {
    id: id,
    title: "Computer Science Textbook",
    description: "Latest edition, barely used. Perfect condition with no markings or highlights. Includes online access code that hasn't been used. Great for CS101 and CS102 courses.",
    price: 75.00,
    status: "active",
    imageUrl: `https://picsum.photos/seed/${id}/800/600`,
    date: "2024-03-15",
    offers: 2
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Large Image */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src={mockListing.imageUrl}
              alt={mockListing.title}
              className="w-full h-[400px] object-cover"
            />
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
              <div className="space-y-4">
                <p className="text-gray-700">
                  {mockListing.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Listed on {mockListing.date}
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
            </div>

            {/* Contact Seller Button */}
            <button
              className="w-full bg-[#FFB800] text-white py-3 px-4 rounded-md hover:bg-[#E5A600] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB800]"
            >
              Contact Seller
            </button>

            {/* Make Offer Button */}
            <button
              className="w-full bg-white text-[#FFB800] border-2 border-[#FFB800] py-3 px-4 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB800]"
            >
              Make Offer
            </button>
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
    </div>
  );
}

export default Listing;