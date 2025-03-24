import React from 'react';
import { useNavigate } from 'react-router-dom';

function ListingCard({ listing }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/listing/${listing.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col"
      onClick={handleClick}
    >
      <div className="w-full aspect-[4/3] relative">
        <img
          src={listing.imageUrl || 'https://via.placeholder.com/400x300'}
          alt={listing.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            listing.status === 'sold' ? 'bg-red-100 text-red-800' :
            listing.status === 'active' ? 'bg-green-100 text-green-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {listing.status}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
        <p className="text-gray-600 text-sm mb-2 truncate">{listing.description}</p>
        <div className="mt-auto">
          <div className="flex justify-between items-center">
            <span className="text-gray-900 font-bold">${listing.price}</span>
            <span className="text-sm text-gray-500">{listing.date}</span>
          </div>
          {listing.offers > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              {listing.offers} offer{listing.offers > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListingCard; 