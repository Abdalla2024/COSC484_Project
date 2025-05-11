import { useNavigate } from 'react-router-dom';

function AccountPFP({ user }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${user.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer flex items-center space-x-2 hover:opacity-80 transition-opacity"
    >
      <div className="relative">
        <img
          src={user.profilePicture || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'} // Default avatar if none provided
          alt={`${user.username}'s profile`}
          className="w-10 h-10 rounded-full object-cover border-2 border-[#FFBB00]"
        />
        {user.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="text-sm">
        <p className="font-medium text-gray-900">{user.username}</p>
        {user.rating && (
          <p className="text-gray-500 text-xs">⭐ {user.rating}</p>
        )}
      </div>
    </div>
  );
}

export default AccountPFP; 