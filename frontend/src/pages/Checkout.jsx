import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_51R7L8iPKPGdvnNX7Q1z1VK2EszKUwsdiXL7fJedYyshWpvCeQy5cRkxUP9zoTM7BgzA5cWFEWsf9jmUF0VVe2E1H00vqWJfDGE");


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

    try {
      const response = await fetch('http://localhost:3000/api/checkout/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: mockListing.id,
          title: mockListing.title,
          price: mockListing.price
        })
      });

      const data = await response.json();
      console.log("Stripe Session Data: ", data);
      if (!data.id) {
        throw new Error("No session ID returned from stripe.")
      }

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
        console.error("Stripe Checkout Error: ", error);
        alert("An error occurred during checkout.");
        setIsLoading(false);
    }
    // setTimeout(() => {
    //   setIsLoading(false);
    //   navigate(`/order-confirmation/${listingId}`);
    // }, 2000);
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