import { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../auth/firebaseconfig';
import { useNavigate } from 'react-router-dom';

// Use environment variable for API URL
const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'http://localhost:3000';

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
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
      return;
    }
    if (user) {
      const syncUser = async () => {
        await fetch(`${API_URL}/api/users/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          })
        });
      };
      syncUser();
      fetchConversations();
    }
  }, [user, loading, navigate]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/messages/user/${user.uid}`);
      const allMessages = await res.json();
      const uniqueUserIds = Array.from(
        new Set(allMessages.map(m => (m.senderId === user.uid ? m.receiverId : m.senderId)))
      );
      const convos = [];
      const counts = {};

      for (const otherId of uniqueUserIds) {
        const threadMsgs = allMessages.filter(
          m => m.senderId === otherId || m.receiverId === otherId
        );
        const lastMsg = threadMsgs.length ? threadMsgs[threadMsgs.length - 1] : null;
        const [userRes, countRes] = await Promise.all([
          fetch(`${API_URL}/api/users/${otherId}`),
          fetch(`${API_URL}/api/messages/unread/${user.uid}/${otherId}`)
        ]);
        const userData = await userRes.json();
        const { count } = await countRes.json();
        convos.push({
          firebaseId: otherId,
          displayName: userData.displayName || 'Unknown User',
          photoURL: userData.photoURL || '',
          lastMessage: lastMsg
        });
        counts[otherId] = count;
      }

      convos.sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
      });

      setConversations(convos);
      setUnreadCounts(counts);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(
        `${API_URL}/api/messages/${user.uid}/${selectedUser.firebaseId}`
      );
      const msgs = await res.json();
      setMessages(msgs);
      await fetch(
        `${API_URL}/api/messages/read/${user.uid}/${selectedUser.firebaseId}`,
        { method: 'PUT' }
      );
      fetchConversations();
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    await fetch(`${API_URL}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: user.uid,
        receiverId: selectedUser.firebaseId,
        content: newMessage.trim()
      })
    });
    setNewMessage('');
    fetchMessages();
  };

  const handleSelectUser = (convo) => setSelectedUser(convo);

  useEffect(() => {
    if (selectedUser) fetchMessages();
  }, [selectedUser]);

  useEffect(scrollToBottom, [messages]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="flex h-[calc(100vh-4rem)] mt-16 w-full">
      {/* Conversations List */}
      <div className="w-1/4 border-r border-gray-200 bg-white">
        <div className="p-4 pt-6">
          <h2 className="text-xl font-bold text-center mb-4 text-black">Conversations</h2>
          <div className="mb-4">{/* search input omitted */}</div>
          <div className="space-y-2">
            {conversations.map((convo) => (
              <div
                key={convo.firebaseId}
                onClick={() => handleSelectUser(convo)}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  selectedUser?.firebaseId === convo.firebaseId ? 'bg-gray-100' : ''
                }`}
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
                        {unreadCounts[convo.firebaseId] > 0 && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
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
          <div className="flex flex-col flex-1">
            {/* Header */}
            <div className="p-4 pt-8 border-b border-gray-200 flex flex-col items-center">
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
              <h2 className="mt-2 text-lg font-semibold text-black">
                {selectedUser.displayName}
              </h2>
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
                  <div className={`max-w-xs p-3 rounded-lg ${
                    message.senderId === user.uid
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    <p className="text-sm text-left">{message.content}</p>
                    <p className="text-xs mt-1 opacity-80 text-right">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {/* Input */}
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
          </div>
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
