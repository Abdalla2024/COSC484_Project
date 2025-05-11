import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

function EditListingModal({ isOpen, onClose, listing, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: '',
    category: '',
    status: ''
  });

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        price: listing.price || '',
        condition: listing.condition || '',
        category: listing.category || '',
        status: listing.status || 'active'
      });
    }
  }, [listing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Edit Listing</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border-2 border-[#FFBB00] rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFBB00] focus:border-[#FFBB00] transition-colors text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 bg-white border-2 border-[#FFBB00] rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFBB00] focus:border-[#FFBB00] transition-colors text-black"
                  required
                />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full pl-7 pr-3 py-2 bg-white border-2 border-[#FFBB00] rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFBB00] focus:border-[#FFBB00] transition-colors text-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border-2 border-[#FFBB00] rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFBB00] focus:border-[#FFBB00] transition-colors text-black"
                  required
                >
                  <option value="">Select condition</option>
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border-2 border-[#FFBB00] rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFBB00] focus:border-[#FFBB00] transition-colors text-black"
                  required
                >
                  <option value="">Select category</option>
                  <option value="textbooks">Textbooks</option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Furniture</option>
                  <option value="clothing">Clothing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border-2 border-[#FFBB00] rounded-lg shadow-sm focus:ring-2 focus:ring-[#FFBB00] focus:border-[#FFBB00] transition-colors text-black"
                  required
                >
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 py-4 mt-6">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border-2 border-red-500 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 hover:border-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border-2 border-[#FFBB00] rounded-lg shadow-sm text-sm font-medium text-white bg-[#FFBB00] hover:bg-[#E6A800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFBB00] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditListingModal; 