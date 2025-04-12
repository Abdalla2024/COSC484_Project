import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../auth/firebaseconfig';
import { fetchMessages, sendMessage, markMessagesAsRead, getUnreadMessageCount } from '../services/apiService';
import User from '../models/User';

function Messages() {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    if (user) {
      // Fetch conversations and unread counts
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedUser) {
      // Fetch messages with selected user
      fetchMessages();
      // Mark messages as read
      markMessagesAsRead(user.uid, selectedUser._id);
    }
  }, [selectedUser]);

  const fetchConversations = async () => {
    try {
      // Get all users (this would be replaced with actual conversation partners)
      const users = await User.find({ _id: { $ne: user.uid } });
      setConversations(users);

      // Get unread counts for each conversation
      const counts = {};
      for (const otherUser of users) {
        counts[otherUser._id] = await getUnreadMessageCount(user.uid, otherUser._id);
      }
      setUnreadCounts(counts);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const messages = await fetchMessages(user.uid, selectedUser._id);
      setMessages(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await sendMessage(user.uid, selectedUser._id, newMessage.trim());
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversations List */}
      <div className="w-1/4 border-r border-gray-200">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Conversations</h2>
          <div className="space-y-2">
            {conversations.map((otherUser) => (
              <div
                key={otherUser._id}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  selectedUser?._id === otherUser._id ? 'bg-gray-100' : ''
                }`}
                onClick={() => setSelectedUser(otherUser)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{otherUser.displayName}</span>
                  {unreadCounts[otherUser._id] > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                      {unreadCounts[otherUser._id]}
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
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">{selectedUser.displayName}</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.sender === user.uid ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.sender === user.uid
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
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