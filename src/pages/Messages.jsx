import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../auth/firebaseconfig';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

function Messages() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found, redirecting to sign in...');
      navigate('/signin');
      return;
    }

    if (user) {
      console.log('Current user:', user);
      // Create or get MongoDB user when Firebase user logs in
      const syncUser = async () => {
        try {
          console.log('Syncing user with MongoDB...');
          const response = await fetch(`${API_URL}/users/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL
            })
          });
          const data = await response.json();
          console.log('User sync response:', data);
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      };
      syncUser();
      fetchConversations();
    }
  }, [user, loading, navigate]);

  const fetchConversations = async () => {
    try {
      console.log('Fetching conversations...');
      // Get all messages for the current user
      const messagesResponse = await fetch(`${API_URL}/messages/user/${user.uid}`, {
        credentials: 'include'
      });
      const allMessages = await messagesResponse.json();
      console.log('All messages:', allMessages);
      
      // Get unique user IDs from messages
      const uniqueUserIds = new Set();
      allMessages.forEach(message => {
        if (message.senderId === user.uid) {
          uniqueUserIds.add(message.receiverId);
        } else {
          uniqueUserIds.add(message.senderId);
        }
      });
      console.log('Unique user IDs:', Array.from(uniqueUserIds));
      
      // Get user details for each unique ID
      const conversations = [];
      const counts = {};
      
      for (const userId of uniqueUserIds) {
        try {
          console.log(`Fetching user details for ${userId}...`);
          const userResponse = await fetch(`${API_URL}/users/${userId}`, {
            credentials: 'include'
          });
          const userData = await userResponse.json();
          console.log(`User details for ${userId}:`, userData);
          
          // Get unread count
          const countResponse = await fetch(`${API_URL}/messages/unread/${user.uid}/${userId}`, {
            credentials: 'include'
          });
          const count = await countResponse.json();
          console.log(`Unread count for ${userId}:`, count);
          
          conversations.push({
            firebaseId: userId,
            displayName: userData.displayName || 'Unknown User',
            email: userData.email || '',
            photoURL: userData.photoURL || ''
          });
          counts[userId] = count;
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          // Add user with default values if not found
          conversations.push({
            firebaseId: userId,
            displayName: 'Unknown User',
            email: '',
            photoURL: ''
          });
          counts[userId] = 0;
        }
      }
      
      console.log('Final conversations:', conversations);
      console.log('Final unread counts:', counts);
      setConversations(conversations);
      setUnreadCounts(counts);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;
    try {
      console.log('Fetching messages between', user.uid, 'and', selectedUser.firebaseId);
      const response = await fetch(`${API_URL}/messages/${user.uid}/${selectedUser.firebaseId}`, {
        credentials: 'include'
      });
      const messages = await response.json();
      console.log('Fetched messages:', messages);
      setMessages(messages);
      
      // Mark messages as read
      await fetch(`${API_URL}/messages/read/${user.uid}/${selectedUser.firebaseId}`, {
        method: 'PUT',
        credentials: 'include'
      });
      
      fetchConversations(); // Refresh unread counts
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      console.log('Sending message:', {
        senderId: user.uid,
        receiverId: selectedUser.firebaseId,
        content: newMessage.trim()
      });
      await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          senderId: user.uid,
          receiverId: selectedUser.firebaseId,
          content: newMessage.trim()
        })
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] mt-16 w-full">
      {/* Conversations List */}
      <div className="w-1/4 border-r border-gray-200 bg-white">
        <div className="p-4 pt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Conversations</h2>
          <div className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto">
            {conversations.map((otherUser) => (
              <div
                key={otherUser.firebaseId}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedUser?.firebaseId === otherUser.firebaseId 
                    ? 'bg-blue-100 text-gray-800' 
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedUser(otherUser)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{otherUser.displayName}</span>
                  {unreadCounts[otherUser.firebaseId] > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                      {unreadCounts[otherUser.firebaseId]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 pt-8 border-b border-gray-200">
              <div className="flex flex-col items-center">
                {selectedUser.photoURL ? (
                  <img 
                    src={selectedUser.photoURL} 
                    alt={selectedUser.displayName}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-2xl">
                      {selectedUser.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="text-center -mt-5">
                  <h2 className="text-lg font-semibold">{selectedUser.displayName}</h2>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-16rem)]">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.senderId === user.uid ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.senderId === user.uid
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm text-left">{message.content}</p>
                    <p className="text-xs mt-1 opacity-80 text-right">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages; 