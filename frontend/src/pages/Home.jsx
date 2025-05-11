import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import listingService from '../services/listingService';
import useDebounce from '../hooks/useDebounce';

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;


function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);


  const categories = ['Textbooks', 'Electronics', 'Furniture', 'Clothing', 'School Supplies', 'Dorm Essentials',
    'Sports Equipment', 'Musical Instruments', 'Art Supplies', 'Lab Equipment'];



  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await listingService.getAllListings();
        setListings(data);
      } catch (err) {
        setError('Failed to fetch listings');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();


  }, []);

  useEffect(() => {
    const searchListings = async () => {
      if (!debouncedValue) {
        try {
          const data = await listingService.getAllListings();
          setListings(data);
        } catch (err) {
          console.error('Error fetching all listings:', err);
        }
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/search/listings?q=${debouncedValue}`);
        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }
        const data = await response.json();
        setListings(data);
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    searchListings();
  }, [debouncedValue]);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const filteredListings = selectedCategory
    ? listings.filter(listing => listing.category === selectedCategory)
    : listings;

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading listings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 fixed left-0 top-20 bottom-0 bg-gray-50 overflow-y-auto">
          <div className="p-4 pt-8">
            <input
              type="text"
              placeholder="Search for items..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-500"
              value={searchValue}
              onChange={handleSearch}
            />
          </div>

          <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Categories
            </h2>
            <div className="flex flex-col gap-2">
              <button
                key="all"
                onClick={() => setSelectedCategory(null)}
                className={`text-left px-4 py-2 rounded-lg transition-colors ${!selectedCategory ? 'bg-yellow-500 text-white' : 'hover:bg-yellow-500 hover:text-white'
                  }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-left px-4 py-2 rounded-lg transition-colors ${selectedCategory === category ? 'bg-yellow-500 text-white' : 'hover:bg-yellow-500 hover:text-white'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pl-64">
          <div className="p-6 max-w-[calc(100vw-16rem)]">
            {filteredListings.length === 0 ? (
              <div className="text-center text-gray-600 mt-8">
                No listings found{selectedCategory ? ` in ${selectedCategory}` : ''}{searchValue ? ` for "${searchValue}"` : ''}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                {filteredListings.map(listing => (
                  <Link to={`/listing/${listing._id}`} key={listing._id} className="h-full">
                    <div className="h-full">
                      <ListingCard listing={listing} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 