import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Dispute() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    issueType: '',
    description: ''
  });

  // Mock order data - in real app, fetch based on orderId
  const mockOrder = {
    id: orderId,
    status: 'pending',
    disputeStatus: null, // null means no dispute exists yet
    total: 75.00,
    listing: {
      title: "Computer Science Textbook",
      image: `https://picsum.photos/seed/${orderId}/800/600`,
      description: "Latest edition, barely used."
    },
    seller: {
      name: "John Doe"
    }
  };

  const issueTypes = [
    { value: 'not_received', label: "Didn't receive item" },
    { value: 'not_as_described', label: "Item was not as described" },
    { value: 'suspicious', label: "Scam / suspicious activity" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/orders`); // Navigate back to orders after submission
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Report an Issue</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex gap-6">
            <img 
              src={mockOrder.listing.image}
              alt={mockOrder.listing.title}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-lg font-medium">{mockOrder.listing.title}</h3>
              <p className="text-gray-600 mb-2">{mockOrder.listing.description}</p>
              <p className="text-gray-600">Seller: {mockOrder.seller.name}</p>
              <p className="text-xl font-bold text-[#FFB800] mt-2">
                ${mockOrder.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Dispute Status - Show only if dispute exists */}
        {mockOrder.disputeStatus && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800">
              Dispute Status: {mockOrder.disputeStatus}
            </p>
          </div>
        )}

        {/* Dispute Form */}
        {!mockOrder.disputeStatus && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-6">
              {/* Issue Type Dropdown */}
              <div>
                <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Type
                </label>
                <select
                  id="issueType"
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                >
                  <option value="">Select an issue type</option>
                  {issueTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description Box */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                  placeholder="Please describe the issue in detail..."
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Proof (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-[#FFB800] hover:text-[#FFB800]/80"
                      >
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {selectedFiles.length} file(s) selected
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FFBB00] text-black py-3 px-6 rounded-lg hover:bg-[#FFBB00]/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Dispute; 