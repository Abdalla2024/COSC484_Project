import { useState } from 'react';
import ListingCard from '../components/ListingCard';

function Listing() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // This would normally come from your backend
  const mockListings = [
    {
      id: 1,
      title: "Computer Science Textbook",
      description: "Latest edition, barely used",
      price: 75.00,
      status: "active",
      imageUrl: "https://picsum.photos/seed/1/800/600",
      date: "2024-03-15",
      offers: 2
    },
    {
      id: 2,
      title: "Calculator TI-84",
      description: "Good condition",
      price: 45.00,
      status: "sold",
      imageUrl: "https://picsum.photos/seed/2/800/600",
      date: "2024-03-10",
      offers: 0
    },
  ];

  const filters = [
    { id: 'all', label: 'All Listings' },
    { id: 'active', label: 'Active' },
    { id: 'sold', label: 'Sold' },
    { id: 'offers', label: 'Has Offers' },
    { id: 'recent', label: 'Recently Added' }
  ];

  const filteredListings = mockListings.filter(listing => {
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
        return new Date(listing.date) > sevenDaysAgo;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
            <div className="flex space-x-2">
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
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Listings', value: mockListings.length },
              { label: 'Active Listings', value: mockListings.filter(l => l.status === 'active').length },
              { label: 'Items Sold', value: mockListings.filter(l => l.status === 'sold').length },
              { label: 'Active Offers', value: mockListings.reduce((acc, curr) => acc + curr.offers, 0) }
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
              <ListingCard key={listing.id} listing={listing} />
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
    </div>
  );
}

export default Listing; 