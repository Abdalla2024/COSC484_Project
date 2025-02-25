import { useState } from 'react';

function Sell() {
  const categories = ['Textbooks', 'Electronics', 'Furniture', 'Clothing', 'School Supplies', 'Dorm Essentials', 
    'Sports Equipment', 'Musical Instruments', 'Art Supplies', 'Lab Equipment'];

  const [productData, setProductData] = useState({
    category: '',
    title: '',
    description: '',
    price: '0',
    notes: '',
    images: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceChange = (e) => {
    const value = Math.max(0, Number(e.target.value));
    setProductData(prev => ({
      ...prev,
      price: value.toString()
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(productData);
    // Add your submission logic here
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">List Your Item</h2>
            <p className="mt-2 text-sm text-gray-600">Fill in the details below to list your item for sale</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={productData.category}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={productData.title}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                required
                placeholder="Enter the title of your item"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                required
                placeholder="Describe your item"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    name="price"
                    min="0"
                    max="1000"
                    value={productData.price}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    name="price"
                    value={productData.price}
                    onChange={handlePriceChange}
                    className="w-24 rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                    min="0"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  Price: ${Number(productData.price).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={productData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                placeholder="Any additional information (optional)"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#FFB800] text-white py-2 px-4 rounded-md hover:bg-[#E5A600] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB800]"
              >
                List Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Sell; 