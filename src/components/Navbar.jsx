import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white shadow-md p-2 fixed top-0 left-0 right-0 z-50 overflow-x-auto">
      <div className="w-full flex justify-between items-center min-w-[1200px]">
        {/* Logo */}
        <Link to="/" className="h-20 ml-16">
          <img 
            src="/towson-logo.png" 
            alt="Towson University Logo" 
            className="h-full object-contain"
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

        {/* Profile Icon */}
        <Link to="/profile" className="flex items-center mr-32">
          <div className="w-14 h-14 overflow-hidden rounded-full border-2 border-gray-300">
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