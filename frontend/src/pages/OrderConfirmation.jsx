import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaMapMarkerAlt, FaCreditCard, FaInfoCircle } from 'react-icons/fa';

function OrderConfirmation() {
  const { orderId } = useParams();

  // Mock order data - would come from API in real app
  const mockOrder = {
    id: orderId,
    createdAt: new Date().toLocaleDateString(),
    total: 75.00,
    paymentType: 'escrow', // or 'direct'
    listing: {
      title: "Computer Science Textbook",
      image: `https://picsum.photos/seed/${orderId}/400/300`,
      description: "Latest edition, barely used. Perfect condition with no markings or highlights."
    },
    seller: {
      name: "John Doe"
    },
    meetupLocation: "Starbucks on Main St"
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Thank you for your purchase!
          </h1>
          <p className="mt-2 text-gray-600">
            Order #{orderId}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-lg overflow-hidden">
              <img
                src={mockOrder.listing.image}
                alt={mockOrder.listing.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
                }}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{mockOrder.listing.title}</h2>
              <p className="text-2xl font-bold text-[#FFB800] mt-1">
                ${mockOrder.total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-4">
            {/* Seller Info */}
            <div className="flex items-center gap-2 text-gray-600">
              <FaInfoCircle className="h-5 w-5" />
              <span>Seller: {mockOrder.seller.name}</span>
            </div>

            {/* Meetup Location */}
            <div className="flex items-center gap-2 text-gray-600">
              <FaMapMarkerAlt className="h-5 w-5" />
              <span>Meetup at: {mockOrder.meetupLocation}</span>
            </div>

            {/* Payment Type */}
            <div className="flex items-center gap-2 text-gray-600">
              <FaCreditCard className="h-5 w-5" />
              <span>
                Payment via: {mockOrder.paymentType === 'escrow'
                  ? 'Escrow (Payment held until delivery confirmed)'
                  : 'Direct Payment'}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          <ol className="space-y-4">
            {mockOrder.paymentType === 'escrow' ? (
              <>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#FFB800] text-black rounded-full flex items-center justify-center text-sm">1</span>
                  <span className="text-gray-600">Meet with seller at {mockOrder.meetupLocation}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#FFB800] text-black rounded-full flex items-center justify-center text-sm">2</span>
                  <span className="text-gray-600">Inspect the item carefully</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#FFB800] text-black rounded-full flex items-center justify-center text-sm">3</span>
                  <span className="text-gray-600">Confirm delivery in your Orders page to release payment</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#FFB800] text-black rounded-full flex items-center justify-center text-sm">1</span>
                  <span className="text-gray-600">Meet with seller at {mockOrder.meetupLocation}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#FFB800] text-black rounded-full flex items-center justify-center text-sm">2</span>
                  <span className="text-gray-600">Payment has been sent to the seller</span>
                </li>
              </>
            )}
          </ol>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-center gap-4">
          <Link
            to="/my-orders"
            className="text-[#FFB800] hover:text-[#FFB800]/80 font-medium"
          >
            View My Orders
          </Link>
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation; 