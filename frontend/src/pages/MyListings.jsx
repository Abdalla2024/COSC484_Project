import { useState, useEffect } from 'react';
import ListingCard from '../components/ListingCard';
import EditListingModal from '../components/EditListingModal';
import listingService from '../services/listingService';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../auth/firebaseconfig';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';

function MyListings() {
  const [user, loading] = useAuthState(auth);
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  // Fetch Listings for user
  useEffect(() => {
    if (user) {
      getListingByUserID();
    }
  }, [user]);

  const getListingByUserID = async () => {
    try {
      setLoadingListings(true);
      setError(null);
      console.log("Attempting to fetch listing for user", user.uid);
      const listingData = await userService.getUserListings(user.uid);
      setListings(listingData);
    } catch (error) {
      console.error("Error fetching user listings:", error);
      setError(error.message || "Failed to fetch listings");
    } finally {
      setLoadingListings(false);
    }
  };

  const filters = [
    { id: 'all', label: 'All Listings' },
    { id: 'active', label: 'Active' },
    { id: 'sold', label: 'Sold' },
    { id: 'offers', label: 'Has Offers' },
    { id: 'recent', label: 'Recently Added' }
  ];

  const handleEdit = (listing) => {
    setSelectedListing(listing);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      console.log('Selected listing:', selectedListing);
      console.log('Form data being sent:', updatedData);
      
      if (!selectedListing || !selectedListing._id) {
        throw new Error('No listing selected or missing ID');
      }

      // Convert price to number if it's a string
      const dataToSend = {
        ...updatedData,
        price: Number(updatedData.price)
      };
      
      console.log('Data being sent to API:', dataToSend);
      console.log('Listing ID:', selectedListing._id);
      
      const updated = await listingService.updateListing(selectedListing._id, dataToSend);
      console.log('Response from API:', updated);
      
      // Update the listings array with the updated listing
      setListings(prevListings => 
        prevListings.map(listing => 
          listing._id === updated._id ? { ...listing, ...updated } : listing
        )
      );
      
      setIsEditModalOpen(false);
      setSelectedListing(null);
    } catch (error) {
      console.error('Error updating listing:', error);
      setError(error.message || "Failed to update listing");
    }
  };

  const handleDelete = (listingId) => {
    // Remove the deleted listing from the state
    setListings(prevListings => prevListings.filter(listing => listing._id !== listingId));
  };

  const filteredListings = listings.filter(listing => {
    switch (activeFilter) {
      case 'active':
        return listing.status === 'active';
      case 'sold':
        return listing.status === 'sold';
      case 'offers':
        return listing.offers > 0;
      case 'recent':
        // Filter listings from last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return new Date(listing.createdAt) > sevenDaysAgo;
      default:
        return true;
    }
  });

  if (loading || loadingListings) {
    return (
      <div className="absolute inset-0 bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading listings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-gray-50 pt-20">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${activeFilter === filter.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Listings', value: listings.length },
              { label: 'Active Listings', value: listings.filter(l => l.status === 'active').length },
              { label: 'Items Sold', value: listings.filter(l => l.status === 'sold').length },
              { label: 'Active Offers', value: listings.reduce((acc, curr) => acc + (curr.offers || 0), 0) }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-500">{stat.label}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map(listing => (
              <ListingCard 
                key={listing._id} 
                listing={listing} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                showEditButton={true}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No listings found for this filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditListingModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedListing(null);
        }}
        listing={selectedListing}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export default MyListings; 
