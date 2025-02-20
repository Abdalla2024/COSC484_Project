import { useParams } from 'react-router-dom';

function Listing() {
  const { id } = useParams();

  // This is placeholder data - you'll want to fetch the actual listing data based on the id
  const listing = {
    image: `https://picsum.photos/seed/${id}/800/600`,
    title: `Sample Product ${id}`,
    description: "This is a detailed description of the product. It includes information about the condition, usage, and any other relevant details that the seller wants to share.",
    price: (Math.random() * 100).toFixed(2)
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-[400px] object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {listing.title}
            </h1>
            <p className="text-2xl font-bold text-yellow-600 mb-4">
              ${listing.price}
            </p>
            <p className="text-gray-700 text-lg">
              {listing.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Listing; 