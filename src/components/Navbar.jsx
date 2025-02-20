import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="h-16">
          <img 
            src="/towson-logo.png" 
            alt="Towson University Logo" 
            className="h-full object-contain"
          />
        </Link>

        {/* Profile Icon */}
        <Link to="/profile" className="flex items-center mr-16">
          <div className="w-12 h-12 overflow-hidden rounded-full border-2 border-gray-300">
            <img 
              src="/default-profile.png" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar 