import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../auth/firebaseconfig';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'http://localhost:3000';

function AccountSettings() {
  const [user, loading] = useAuthState(auth);
  const [mongoUser, setMongoUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  // Fetch MongoDB user data
  useEffect(() => {
    if (user) {
      fetchMongoUser();
    }
  }, [user]);

  const fetchMongoUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/sync`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error syncing user: ${response.status}`);
      }
      
      const userData = await response.json();
      setMongoUser(userData);
    } catch (error) {
      console.error("Error fetching MongoDB user data:", error);
    }
  };

  const getUserInitials = () => {
    if (!user?.displayName) return 'U';
    return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  console.log("user-information", user);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-24 h-24 rounded-full mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <span className="text-gray-500 text-3xl font-semibold">
                {getUserInitials()}
              </span>
            </div>
          )}
          <h2 className="text-xl font-semibold text-black">{user?.displayName || 'User'}</h2>
        </div>

        {/* Account Information */}
        <div className="space-y-4">
          <div className="border-b pb-4 text-center">
            <h2 className="text-lg font-semibold mb-2 text-black">Email</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          <div className="border-b pb-4 text-center">
            <h2 className="text-lg font-semibold mb-2 text-black">Firebase User ID</h2>
            <p className="text-gray-600 break-all">{user?.uid}</p>
          </div>

          <div className="border-b pb-4 text-center">
            <h2 className="text-lg font-semibold mb-2 text-black">MongoDB ObjectID</h2>
            <p className="text-gray-600 break-all">{mongoUser?._id || 'Loading...'}</p>
          </div>

          <div className="border-b pb-4 text-center">
            <h2 className="text-lg font-semibold mb-2 text-black">Display Name</h2>
            <p className="text-gray-600">{user?.displayName || 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings; 