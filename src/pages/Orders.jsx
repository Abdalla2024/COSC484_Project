import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function Orders() {
  const { orderId } = useParams();
  const [isConfirmingDelivery, setIsConfirmingDelivery] = useState(false);

  // Mock orders data - in real app, this would come from an API for the logged-in buyer
  const mockOrders = [
    {
      id: "1",
      status: 'pending',
      createdAt: '2024-02-20',
      paymentType: 'escrow',
      escrowStatus: 'waiting_confirmation',
      total: 75.00,
      listing: {
        id: "listing123",
        title: "Computer Science Textbook",
        image: `https://picsum.photos/seed/1/800/600`,
        description: "Latest edition, barely used. Perfect condition with no markings or highlights."
      },
      seller: {
        name: "John Doe",
      },
      meetupLocation: "Starbucks on Main St"
    },
    {
      id: "2",
      status: 'completed',
      createdAt: '2024-02-18',
      paymentType: 'direct',
      total: 50.00,
      listing: {
        id: "listing456",
        title: "Calculus Textbook",
        image: `https://picsum.photos/seed/2/800/600`,
        description: "Third edition, good condition."
      },
      seller: {
        name: "Jane Smith",
      },
      meetupLocation: "University Library"
    }
  ];

  const handleConfirmDelivery = (orderId) => {
    setIsConfirmingDelivery(true);
    // Add API call to confirm delivery
    setTimeout(() => {
      setIsConfirmingDelivery(false);
    }, 2000);
  };

  const handleReportIssue = (orderId) => {
    // Add navigation to report form or modal
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {/* Orders List */}
        <div className="space-y-6">
          {mockOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                  <p className="text-gray-500">Placed on {order.createdAt}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#FFB800]">${order.total.toFixed(2)}</p>
                  <p className="text-gray-500">via {order.paymentType}</p>
                </div>
              </div>

              {/* Item Details */}
              <div className="flex gap-6 mb-6">
                <img 
                  src={order.listing.image}
                  alt={order.listing.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{order.listing.title}</h3>
                  <p className="text-gray-600 mb-2">{order.listing.description}</p>
                  <p className="text-gray-600">Seller: {order.seller.name}</p>
                  
                  {/* View Details Button */}
                  <Link 
                    to={`/listing/${order.listing.id}`}
                    className="inline-block mt-3 text-[#FFB800] hover:text-[#FFB800]/80 font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>

              {/* Meetup Location */}
              <div className="flex items-center gap-2 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-600">Meetup Location: {order.meetupLocation}</p>
              </div>

              {/* Escrow Status */}
              {order.paymentType === 'escrow' && order.status !== 'completed' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800">
                    Waiting for you to confirm delivery
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {order.status !== 'completed' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleConfirmDelivery(order.id)}
                    disabled={isConfirmingDelivery}
                    className="flex-1 bg-[#FFBB00] text-black py-3 px-6 rounded-lg hover:bg-[#FFBB00]/90 transition-colors disabled:opacity-50"
                  >
                    {isConfirmingDelivery ? 'Confirming...' : 'Confirm Delivery'}
                  </button>
                  <button
                    onClick={() => handleReportIssue(order.id)}
                    className="flex-1 bg-white text-red-600 border border-red-600 py-3 px-6 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Report Issue
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders; 