import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here (clear tokens, user state, etc.)
    
    // Navigate to sign in page
    navigate('/signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transform transition-transform hover:scale-105"
      >
        Log out
      </button>
    </div>
  );
}

export default Profile; 