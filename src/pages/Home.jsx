import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';

function Home() {
  const categories = ['Textbooks', 'Electronics', 'Furniture', 'Clothing', 'School Supplies', 'Dorm Essentials', 
    'Sports Equipment', 'Musical Instruments', 'Art Supplies', 'Lab Equipment'];

  // Mock data for demonstration
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
      status: "active",
      imageUrl: "https://picsum.photos/seed/2/800/600",
      date: "2024-03-10",
      offers: 0
    },
    {
      id: 3,
      title: "Study Desk",
      description: "Perfect for dorm rooms",
      price: 120.00,
      status: "active",
      imageUrl: "https://picsum.photos/seed/3/800/600",
      date: "2024-03-18",
      offers: 1
    },
    {
      id: 4,
      title: "Physics Lab Manual",
      description: "2023 Edition",
      price: 25.00,
      status: "active",
      imageUrl: "https://picsum.photos/seed/4/800/600",
      date: "2024-03-14",
      offers: 0
    }
  ];

  return (
    <div className="flex bg-white w-full">
      {/* Sidebar */}
      <div className="w-64 fixed left-0 h-[calc(100vh-64px)] bg-gray-50" style={{ top: '84px' }}>
        <div className="h-full overflow-y-auto">
          {/* Search Bar */}
          <div className="p-4 pt-8">
            <input
              type="text"
              placeholder="Search for items..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-500"
            />
          </div>

          {/* Categories */}
          <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Categories
            </h2>
            <div className="flex flex-col gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="text-left px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-white transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-6 pt-24 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 pt-6">
          {mockListings.map(listing => (
            <Link to={`/listing/${listing.id}`} key={listing.id} className="h-full">
              <div className="h-full">
                <ListingCard listing={listing} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home; 