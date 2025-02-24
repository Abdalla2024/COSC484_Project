import { useState } from 'react';

function Sell() {
  const categories = ['Textbooks', 'Electronics', 'Furniture', 'Clothing', 'School Supplies', 'Dorm Essentials', 
    'Sports Equipment', 'Musical Instruments', 'Art Supplies', 'Lab Equipment'];

  const [productData, setProductData] = useState({
    category: '',
    title: '',
    description: '',
    price: '',
    priceType: 'fixed', // 'fixed' or 'negotiable'
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 3) {
      alert('Please upload at least 3 images');
      return;
    }
    setProductData(prev => ({
      ...prev,
      images: files
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', productData);
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
                <select
                  name="category"
                  value={productData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-1 focus:ring-gray-300"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Title
                <input
                  type="text"
                  name="title"
                  value={productData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  required
                />
              </label>
            </div>

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
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    name="price"
                    value={productData.price}
                    onChange={handleInputChange}
                    className="w-24 rounded-md border border-gray-300 bg-white py-2 px-3 text-black focus:outline-none focus:ring-1 focus:ring-gray-300"
                    min="0"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  Price: ${Number(productData.price).toFixed(2)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  required
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Additional Notes
                <textarea
                  name="notes"
                  value={productData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Images (minimum 3)
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-white file:text-gray-700
                    hover:file:bg-gray-50"
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Create Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Sell; 