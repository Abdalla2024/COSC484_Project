import { Link, useNavigate } from 'react-router-dom'
import { FaCommentAlt, FaPlus, FaUserCircle } from 'react-icons/fa'

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/towson-logo.png"
              alt="Towson University"
              className="h-16 object-contain"
            />
          </Link>

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

          {/* Messages, Sell, and Profile Icons */}
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

            <Link 
              to="/profile" 
              className="text-gray-600 hover:text-yellow-500 transition-colors"
            >
              <FaUserCircle className="w-12 h-12" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 