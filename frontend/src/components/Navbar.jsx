import { Link, useNavigate } from 'react-router-dom'
import { FaCommentAlt, FaPlus, FaUserCircle, FaBars } from 'react-icons/fa'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../auth/firebaseconfig'

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/signin');
  };

  const getUserInitials = () => {
    if (!user?.displayName) return 'U';
    return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="w-full px-4">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/towson-logo.png"
                alt="Towson University"
                className="h-12 sm:h-16 object-contain"
              />
            </Link>
          </div>

          {/* Marketplace Title with Icon - Icon always visible, text hidden on very small screens */}
          <div className="flex items-center gap-2 md:gap-4">
            <img 
              src="/market-icon.png"
              alt="Market Icon"
              className="h-8 w-8 md:h-12 md:w-12 object-contain"
            />
            <h1 className="hidden sm:block text-3xl md:text-5xl font-bold text-black">
              Marketplace
            </h1>
          </div>



          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/chats" 
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <Link
                    to="/my-listings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Listings
                  </Link>
                  <Link
                    to="/my-orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/account-settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Account Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button - Visible only on mobile */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-600 hover:text-yellow-500 transition-colors focus:outline-none focus:ring-0 border-0 outline-none appearance-none bg-transparent p-0"
          >
            <FaBars className="w-8 h-8" />
          </button>
        </div>

        {/* Mobile Menu - Slides down when hamburger is clicked */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/chats"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-yellow-500 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Messages
              </Link>
              <Link
                to="/sell"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-yellow-500 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sell
              </Link>
              <Link
                to="/my-listings"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-yellow-500 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Listings
              </Link>
              <Link
                to="/account-settings"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-yellow-500 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Account Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 