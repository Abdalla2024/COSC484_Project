import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Checkout() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState('direct');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app, this would come from an API call
  const mockListing = {
    id: listingId,
    title: "Computer Science Textbook",
    price: 75.00,
    description: "Latest edition, barely used. Perfect condition with no markings or highlights.",
    image: `https://picsum.photos/seed/${listingId}/800/600`,
    seller: "John Doe",
    meetupLocation: "Starbucks on Main St"
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/success');
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {/* Item Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Item Summary</h2>
          <div className="flex gap-6">
            <img 
              src={mockListing.image} 
              alt={mockListing.title}
              className="w-48 h-48 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-medium mb-2">{mockListing.title}</h3>
              <p className="text-gray-600 mb-4">{mockListing.description}</p>
              <p className="text-3xl font-bold text-[#FFB800] mb-3">${mockListing.price.toFixed(2)}</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Sold by: {mockListing.seller}</p>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-500">Meetup Location: {mockListing.meetupLocation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Type Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Choose Payment Type</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="paymentType"
                value="direct"
                checked={paymentType === 'direct'}
                onChange={(e) => setPaymentType(e.target.value)}
                className="h-4 w-4 text-[#FFB800] focus:ring-[#FFB800]"
              />
              <span className="text-gray-700">
                Pay Now (funds go directly to seller)
              </span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="paymentType"
                value="escrow"
                checked={paymentType === 'escrow'}
                onChange={(e) => setPaymentType(e.target.value)}
                className="h-4 w-4 text-[#FFB800] focus:ring-[#FFB800]"
              />
              <span className="text-gray-700">
                Escrow (buyer confirms delivery before funds release)
              </span>
            </label>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
          <div className="space-y-4">
            {/* Stripe Elements would go here */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">Stripe Payment Form will be integrated here</p>
            </div>
          </div>
        </div>

        {/* Proceed Button */}
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full bg-[#FFBB00] text-black py-4 px-6 rounded-lg hover:bg-[#FFBB00]/90 transition-colors disabled:opacity-50 text-lg font-semibold"
        >
          {isLoading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </div>
    </div>
  );
}

export default Checkout; 