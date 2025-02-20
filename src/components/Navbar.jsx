import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="h-12">
          <img 
            src="/towson-logo.png" 
            alt="Towson University Logo" 
            className="h-full"
          />
        </Link>

        {/* Profile Icon */}
        <Link to="/profile" className="w-10 h-10">
          <img 
            src="/default-profile.png" 
            alt="Profile" 
            className="rounded-full w-full h-full object-cover border-2 border-gray-200"
          />
        </Link>
      </div>
    </nav>
  )
}

export default Navbar 