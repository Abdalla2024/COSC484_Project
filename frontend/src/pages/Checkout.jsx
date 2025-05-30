import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import listingService from '../services/listingService';

// Use environment variable for API URL
const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'http://localhost:3000';

const stripePromise = loadStripe("pk_test_51R7L8iPKPGdvnNX7Q1z1VK2EszKUwsdiXL7fJedYyshWpvCeQy5cRkxUP9zoTM7BgzA5cWFEWsf9jmUF0VVe2E1H00vqWJfDGE");


function Checkout() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchListing = async () => {
        try {
          const data = await listingService.getListingById(id);
          setListing(data);
        } catch (err) {
          setError(err.message || 'Failed to fetch listing');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchListing();
    }, [id]);

  const handlePayment = async () => {

    try {
      const response = await fetch(`${API_URL}/api/checkout/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: listing._id,
          title: listing.title,
          price: listing.price,
          cancel_url: window.location.href
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
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-black">Checkout</h1>
        
        {isLoading ? (
          <p className="text-gray-500">Loading listing...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : listing ? (
          <>

        {/* Item Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-black">Item Summary</h2>
          <div className="flex gap-6">
            <img 
              src={listing.images?.[0] || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'} 
              alt={listing.title}
              className="w-48 h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
              }}
            />
            <div className="flex-1">
              <h3 className="text-xl font-medium mb-2 text-black">{listing.title}</h3>
              <p className="text-gray-600 mb-4">{listing.description}</p>
              <p className="text-3xl font-bold text-[#FFB800] mb-3">${listing.price.toFixed(2)}</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Sold by: {listing?.seller?.displayName || listing?.seller?.username}</p>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-500">
                    {listing.deliveryMethod === "Shipping" || !listing
                    ? "Delivery Only - no pickup location"
                    : `Meetup Location: ${listing.meetupLocation}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proceed to Payment Button */}
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full bg-[#FFBB00] text-black py-4 px-6 rounded-lg hover:bg-[#FFBB00]/90 transition-colors disabled:opacity-50 text-lg font-semibold"
        >
          {isLoading ? 'Processing...' : 'Proceed to Payment'}
        </button>
        </>
        ) : (
          <p className="text-gray-500">No listing data available.</p>
        )}
      </div>
    </div>
  );
}

export default Checkout; 