import { Link, useNavigate } from 'react-router-dom'
import { FaCommentAlt, FaPlus, FaUserCircle } from 'react-icons/fa'
import { useState } from 'react'

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = () => {
    // Add any logout logic here (clearing tokens, etc)
    setIsDropdownOpen(false);
    navigate('/signin');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/towson-logo.png"
                alt="Towson University"
                className="h-16 object-contain"
              />
            </Link>
          </div>

          {/* Marketplace Title with Icon */}
          <div className="flex items-center gap-4">
            <img 
              src="/market-icon.png"
              alt="Market Icon"
              className="h-12 w-12 object-contain"
            />
            <h1 className="text-5xl font-bold text-black">
              Marketplace
            </h1>
          </div>

          <div className="flex items-center gap-8">
            <Link 
              to="/messages" 
              className="text-gray-600 hover:text-yellow-500 transition-colors"
            >
              <FaCommentAlt className="w-8 h-8" />
            </Link>
            
            <Link 
              to="/sell" 
              className="text-gray-600 hover:text-yellow-500 transition-colors"
            >
              <FaPlus className="w-8 h-8" />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-gray-600 hover:text-yellow-500 transition-colors focus:outline-none p-0 border-none bg-transparent"
              >
                <FaUserCircle className="w-12 h-12" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                  <Link
                    to="/my-listings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Listings
                  </Link>
                  <Link
                    to="/account-settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Account Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-center px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 