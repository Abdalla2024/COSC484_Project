import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../auth/firebaseconfig';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function AccountSettings() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-2">Email</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
          
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-2">User ID</h2>
            <p className="text-gray-600 break-all">{user?.uid}</p>
          </div>
          
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-2">Display Name</h2>
            <p className="text-gray-600">{user?.displayName || 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings; 