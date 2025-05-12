import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../auth/firebaseconfig';
import listingService from '../services/listingService';


const uploadImageToCloudinary = async (file) => {
  const url = `https://api.cloudinary.com/v1_1/dcg7xwnc6/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "preset");

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Upload failed");
    return data.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
};


function Sell() {
  const categories = ['Textbooks', 'Electronics', 'Furniture', 'Clothing', 'School Supplies', 'Dorm Essentials', 
    'Sports Equipment', 'Musical Instruments', 'Art Supplies', 'Lab Equipment'];

  const [user, loading] = useAuthState(auth);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [productData, setProductData] = useState({
    category: '',
    title: '',
    description: '',
    price: '0',
    notes: '',
  });

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState('');
  const [condition, setCondition] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [meetupLocation, setMeetupLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const navigate = useNavigate();

  // Get MongoDB user ID on load
  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
      return;
    }
    
    if (user) {
      const fetchUserMongoId = async () => {
        try {
          const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
          const API_URL = isDevelopment 
            ? 'http://localhost:3000' 
            : 'https://cosc484-project-api.vercel.app';
            
          console.log('Fetching user data from:', `${API_URL}/api/users/sync`, 'Environment:', isDevelopment ? 'development' : 'production');
          
          const res = await fetch(`${API_URL}/api/users/sync`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL
            })
          });
          
          if (!res.ok) {
            throw new Error(`Failed to sync user: ${res.status} ${res.statusText}`);
          }
          
          const userData = await res.json();
          console.log('Current user MongoDB ID:', userData._id);
          setCurrentUserId(userData._id);
        } catch (error) {
          console.error('Error fetching user MongoDB ID:', error);
          setError('Failed to authenticate user. Please try again.');
        }
      };
      
      fetchUserMongoId();
    }
  }, [user, loading, navigate]);

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const deliveryOptions = [
    { value: 'Shipping', label: 'Delivery Only' },
    { value: 'Meetup', label: 'Meetup Only' },
    { value: 'Both', label: 'Shipping or Meetup' }
  ];

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

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
  setImages(selectedFiles);

  const urls = selectedFiles.map((file) => URL.createObjectURL(file));
  setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (images.length < 3) {
      setError('Please upload at least 3 photos of your item');
      return;
    }
    
    if (!currentUserId) {
      setError('User authentication failed. Please sign in again.');
      return;
    }

    try {
      setError('Uploading images...');
      // 1. Upload all images to Firebase
      const uploadPromises = images.map((file) => uploadImageToCloudinary(file));
      const imageUrls = await Promise.all(uploadPromises);

      // 2. Prepare listing data
      const listingData = {
        title: productData.title,
        description: productData.description,
        price: parseFloat(productData.price),
        category: productData.category,
        condition: condition,
        images: imageUrls,
        deliveryMethod: deliveryMethod,
        meetupLocation: showLocationInput ? meetupLocation : undefined,
        status: 'active',
        sellerId: currentUserId
      };
      
      console.log('Creating listing with sellerId:', currentUserId);

      // 3. Send to backend
      await listingService.createListing(listingData);
      
      // Redirect to home page on success
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create listing. Please try again.');
      console.error('Error creating listing:', err);
    }
  };

  return (
    <div className="absolute inset-0 bg-gray-50 pt-20 overflow-y-auto">
      <div className="w-screen max-w-3xl mx-auto px-4 py-6">
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

            {/* Condition Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {conditions.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setCondition(item.value)}
                    className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                      condition === item.value
                        ? 'border-[#FFBB00] bg-[#FFBB00] text-black'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Method
              </label>
              <div className="space-y-2">
                {deliveryOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setDeliveryMethod(option.value);
                      setShowLocationInput(option.value === 'Meetup' || option.value === 'Both');
                    }}
                    className={`w-full p-3 border rounded-lg text-sm font-medium transition-colors ${
                      deliveryMethod === option.value
                        ? 'border-[#FFBB00] bg-[#FFBB00] text-black'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Meetup Location Input */}
              {showLocationInput && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meetup Location
                  </label>
                  <input
                    type="text"
                    value={meetupLocation}
                    onChange={(e) => setMeetupLocation(e.target.value)}
                    placeholder="Enter meetup location (e.g., Starbucks on Main St)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black placeholder-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Be specific about the meetup location for potential buyers
                  </p>
                </div>
              )}
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

            {/* Image Upload Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Upload Photos</h2>
              <p className="text-sm text-gray-500 mb-4">
                Add at least 3 photos of your item. You can upload up to 5 photos.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              {/* Image Preview Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <img 
                      src={url} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setPreviewUrls(prev => prev.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Upload Button */}
                {previewUrls.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-sm text-gray-500">Add Photo</span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              {/* Photo Count Indicator */}
              <div className="text-sm text-gray-500">
                {previewUrls.length} of 5 photos uploaded
                {previewUrls.length < 3 && (
                  <span className="text-red-500 ml-2">(Minimum 3 required)</span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit"
                className={`w-full py-3 px-6 rounded-lg ${
                  previewUrls.length < 3 || !condition || !deliveryMethod || 
                  (showLocationInput && !meetupLocation)
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#FFBB00] hover:bg-[#FFBB00]/90 text-black'
                }`}
                disabled={
                  previewUrls.length < 3 || 
                  !condition || 
                  !deliveryMethod || 
                  (showLocationInput && !meetupLocation)
                }
              >
                {previewUrls.length < 3 || !condition || !deliveryMethod || 
                  (showLocationInput && !meetupLocation)
                  ? 'Uploading...'
                  : 'List Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Sell; 