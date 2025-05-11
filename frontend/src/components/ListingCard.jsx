import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'timeago.js';
import { FaEdit } from 'react-icons/fa';

function ListingCard({ listing, onEdit, showEditButton = false }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/listing/${listing._id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent the card click event
    onEdit(listing);
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMonths = (now.getFullYear() - date.getFullYear()) * 12 +
      (now.getMonth() - date.getMonth());

    if (diffMonths >= 12) {
      const years = Math.floor(diffMonths / 12);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (diffMonths >= 3) {
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    } else {
      return format(date);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col"
      onClick={handleClick}
    >
      <div className="w-full aspect-[4/3] relative">
        <img
          src={listing.images?.[0] || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'}
          alt={listing.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
          }}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {showEditButton && (
            <button
              onClick={handleEditClick}
              className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
              title="Edit listing"
            >
              <FaEdit className="w-4 h-4 text-gray-600" />
            </button>
          )}
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
        <div className="mt-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {listing.condition}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded ml-2">
            {listing.category}
          </span>
        </div>
        <div className="mt-auto">
          <div className="flex justify-between items-center">
            <span className="text-gray-900 font-bold">${listing.price}</span>
            <span className="text-sm text-gray-500">
              {formatDate(listing.createdAt)}
            </span>
          </div>
          {listing.bids?.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              {listing.bids.length} bid{listing.bids.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListingCard; 