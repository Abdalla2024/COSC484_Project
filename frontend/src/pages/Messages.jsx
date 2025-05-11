import { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../auth/firebaseconfig';
import { useNavigate } from 'react-router-dom';

// Use environment variable for API URL
const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'http://localhost:3000';
console.log('Using API_URL in Messages:', API_URL);

function Messages() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = Math.floor((now - messageTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found, redirecting to sign in...');
      navigate('/signin');
      return;
    }

    if (user) {
      console.log('Current user:', user);
      console.log('Current user UID:', user.uid);
      // Create or get MongoDB user when Firebase user logs in
      const syncUser = async () => {
        try {
          console.log('Syncing user with MongoDB...');
          const response = await fetch(`${API_URL}/api/users/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
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
      const messagesResponse = await fetch(`${API_URL}/api/messages/user/${user.uid}`);
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
          const userResponse = await fetch(`${API_URL}/api/users/${userId}`);
          const userData = await userResponse.json();
          console.log(`User details for ${userId}:`, userData);
          
          // Get unread count
          const countResponse = await fetch(`${API_URL}/api/messages/unread/${user.uid}/${userId}`);
          const count = await countResponse.json();
          console.log(`Unread count for ${userId}:`, count);
          
          conversations.push({
            firebaseId: userId,
            displayName: userData.displayName || 'Unknown User',
            email: userData.email || '',
            photoURL: userData.photoURL || '',
            lastMessage: allMessages.find(m => m.senderId === userId || m.receiverId === userId)
          });
          counts[userId] = count;
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          // Add user with default values if not found
          conversations.push({
            firebaseId: userId,
            displayName: 'Unknown User',
            email: '',
            photoURL: '',
            lastMessage: null
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
      const response = await fetch(`${API_URL}/api/messages/${user.uid}/${selectedUser.firebaseId}`);
      const messages = await response.json();
      console.log('Fetched messages:', messages);
      setMessages(messages);
      
      // Mark messages as read
      await fetch(`${API_URL}/api/messages/read/${user.uid}/${selectedUser.firebaseId}`, {
        method: 'PUT'
      });
      
      fetchConversations(); // Refresh unread counts
      
      // Scroll to bottom after messages are loaded
      setTimeout(scrollToBottom, 100);
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
      await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchMessages();
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  // Add effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] mt-16 w-full">
      {/* Conversations List */}
      <div className="w-1/4 border-r border-gray-200 bg-white">
        <div className="p-4 pt-6">
          <h2 className="text-xl font-bold text-center mb-4 text-black">Conversations</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            {conversations.map((convo) => (
              <div
                key={convo.firebaseId}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  selectedUser?.firebaseId === convo.firebaseId ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleSelectUser(convo)}
              >
                <div className="flex items-center space-x-3">
                  {convo.photoURL ? (
                    <img
                      src={convo.photoURL}
                      alt={convo.displayName}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">
                        {convo.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold truncate text-black">{convo.displayName}</h3>
                        {unreadCounts[convo.firebaseId]?.count > 0 && (
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {convo.lastMessage ? formatTimeAgo(convo.lastMessage.timestamp) : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {convo.lastMessage ? convo.lastMessage.content : 'No messages yet'}
                    </p>
                  </div>
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
                      {selectedUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="text-center mt-2">
                  <h2 className="text-lg font-semibold text-black">{selectedUser.displayName}</h2>
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
              <div ref={messagesEndRef} />
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