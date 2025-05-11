import { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../auth/firebaseconfig';
import { useNavigate, useParams } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce';

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'http://localhost:3000';

export default function Messages() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const { otherUserId } = useParams();

  // Mongo _id of logged-in user
  const [currentUserId, setCurrentUserId] = useState(null);

  const [conversations, setConversations] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Search
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 500);

  const endRef = useRef(null);
  const scrollToBottom = () => {
    setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // Small delay to ensure DOM is updated
  };

  // Get initials from display name
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const fmtTimeAgo = ts => {
    const now = Date.now(), d = now - new Date(ts);
    if (d < 3600e3) return 'just now';
    if (d < 86400e3) return `${Math.floor(d/3600e3)}h ago`;
    return `${Math.floor(d/86400e3)}d ago`;
  };

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // 1) Sync Firebase → get Mongo _id
  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
      return;
    }
    if (user) {
      (async () => {
        const res = await fetch(`${API_URL}/api/users/sync`, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          })
        });
        const me = await res.json();
        setCurrentUserId(me._id);
      })();
    }
  }, [user, loading]);

  // 2) Load conversations on login or search
  useEffect(() => {
    if (!currentUserId) return;
    (async () => {
      console.log("Loading conversations with MongoDB ID:", currentUserId);
      
      try {
        const url = debouncedSearch
          ? `${API_URL}/api/search/messages?q=${debouncedSearch}`
          : `${API_URL}/api/messages/user/${currentUserId}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.status}`);
        }
        
        const allMsgs = await response.json();
        console.log("Messages received from API:", allMsgs.length, "messages");
        
        if (allMsgs.length > 0) {
          console.log("First message sample:", {
            senderId: allMsgs[0].senderId,
            receiverId: allMsgs[0].receiverId,
            content: allMsgs[0].content
          });
        }
        
        // Convert all IDs to strings for comparison
        const currentUserIdStr = currentUserId.toString();
        
        const partnerIds = Array.from(new Set(
          allMsgs.map(m => {
            const senderIdStr = m.senderId.toString();
            const receiverIdStr = m.receiverId.toString();
            
            return senderIdStr === currentUserIdStr 
              ? receiverIdStr 
              : senderIdStr;
          })
        ));
        
        console.log("Partner IDs found:", partnerIds);

        const convos = [];
        const counts = {};

        for (const otherId of partnerIds) {
          console.log("Processing conversation with partner:", otherId);
          
          // Use string comparison for filtering thread messages
          const thread = allMsgs.filter(m => {
            const senderIdStr = m.senderId.toString();
            const receiverIdStr = m.receiverId.toString();
            return senderIdStr === otherId || receiverIdStr === otherId;
          });
          
          if (thread.length === 0) {
            console.log("No messages found for this partner, skipping");
            continue;
          }
          
          // Sort messages by timestamp to get the latest one
          thread.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          const lastMsg = thread[0]; // Now this is truly the latest message
          console.log("Latest message:", lastMsg.content);

          try {
            const userRes = await fetch(`${API_URL}/api/users/${otherId}`);
            if (!userRes.ok) {
              console.error(`Error fetching user ${otherId}: ${userRes.status}`);
              continue;
            }
            
            const userData = await userRes.json();
            console.log("User data retrieved:", userData.displayName);
            
            const unreadRes = await fetch(`${API_URL}/api/messages/unread/${currentUserId}/${otherId}`);
            if (!unreadRes.ok) {
              console.error(`Error fetching unread count: ${unreadRes.status}`);
              continue;
            }
            
            const { count } = await unreadRes.json();
            console.log("Unread messages:", count);

            convos.push({
              id: otherId,
              displayName: userData.displayName,
              photoURL: userData.photoURL,
              last: lastMsg
            });
            counts[otherId] = count;
          } catch (error) {
            console.error("Error processing conversation:", error);
          }
        }

        console.log("Final conversations:", convos.length);
        convos.sort((a, b) => new Date(b.last.timestamp) - new Date(a.last.timestamp));
        setConversations(convos);
        setUnreadCounts(counts);
      } catch (error) {
        console.error("Error loading conversations:", error);
      }
    })();
  }, [currentUserId, debouncedSearch]);

  // 2a) Auto-select if URL has otherUserId
  useEffect(() => {
    if (!otherUserId || !currentUserId) return;
    
    console.log('URL parameter otherUserId:', otherUserId);
    
    // First try to find in existing conversations
    const convo = conversations.find(c => c.id === otherUserId);
    if (convo) {
      console.log('Found existing conversation with:', convo.displayName);
      handleSelectUser(convo);
      return;
    }
    
    // If not found in existing conversations, fetch user data and create new conversation
    const fetchUserAndStartChat = async () => {
      try {
        console.log('Fetching user data for new conversation with ID:', otherUserId);
        const userRes = await fetch(`${API_URL}/api/users/${otherUserId}`);
        
        if (!userRes.ok) {
          console.error(`Error fetching user ${otherUserId}: ${userRes.status}`);
          return;
        }
        
        const userData = await userRes.json();
        console.log('User data retrieved for new chat:', userData);
        
        const newConvo = {
          id: otherUserId,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          last: null // No messages yet
        };
        
        console.log('Creating new conversation object:', newConvo);
        handleSelectUser(newConvo);
      } catch (error) {
        console.error('Error creating new conversation:', error);
      }
    };
    
    fetchUserAndStartChat();
  }, [otherUserId, conversations, currentUserId]);

  // Handle selecting a user and immediately clear unread status
  const handleSelectUser = (convo) => {
    setSelectedUser(convo);
    
    // Immediately clear unread indicator locally
    if (unreadCounts[convo.id] > 0) {
      setUnreadCounts(prev => ({
        ...prev,
        [convo.id]: 0
      }));
    }
  };

  // 3) Load a thread when selecting a user
  useEffect(() => {
    if (!selectedUser || !currentUserId) return;
    (async () => {
      console.log(`Loading messages between ${currentUserId} and ${selectedUser.id}`);
      
      try {
        const response = await fetch(
          `${API_URL}/api/messages/${currentUserId}/${selectedUser.id}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch thread: ${response.status}`);
        }
        
        const thread = await response.json();
        console.log(`Loaded ${thread.length} messages in thread`);
        
        setMessages(thread);
        
        // mark read
        await fetch(
          `${API_URL}/api/messages/read/${currentUserId}/${selectedUser.id}`,
          { method: 'PUT' }
        );
        
        scrollToBottom();
      } catch (error) {
        console.error("Error loading thread:", error);
      }
    })();
  }, [selectedUser, currentUserId]);

  // 4) Send a new message
  const sendMessage = async e => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    
    try {
      console.log(`Sending message from ${currentUserId} to ${selectedUser.id}`);
      
      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: selectedUser.id,
          content: newMessage.trim()
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }
      
      setNewMessage('');
      
      // refresh thread
      const threadResponse = await fetch(
        `${API_URL}/api/messages/${currentUserId}/${selectedUser.id}`
      );
      
      if (!threadResponse.ok) {
        throw new Error(`Failed to refresh thread: ${threadResponse.status}`);
      }
      
      const thread = await threadResponse.json();
      setMessages(thread);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading || !currentUserId) {
    return <div className="flex items-center justify-center h-screen">Loading…</div>;
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
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectUser(c)}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  selectedUser?.id === c.id ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {c.photoURL ? (
                    <img
                      src={c.photoURL}
                      alt={c.displayName}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-700 text-lg font-medium">
                        {getInitials(c.displayName)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold truncate text-black">{c.displayName}</h3>
                        {unreadCounts[c.id] > 0 && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {c.last ? fmtTimeAgo(c.last.timestamp) : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {c.last ? c.last.content : 'No messages yet'}
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
                  <span className="text-gray-700 text-2xl font-medium">
                    {getInitials(selectedUser.displayName)}
                  </span>
                </div>
              )}
              <h2 className="mt-2 text-lg font-semibold text-black">
                {selectedUser.displayName}
              </h2>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-16rem)]">
              {messages.map((m) => (
                <div
                  key={m._id}
                  className={`flex ${
                    m.senderId === currentUserId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`max-w-xs p-3 rounded-lg ${
                    m.senderId === currentUserId
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    <p className="text-sm text-left">{m.content}</p>
                    <p className="text-xs mt-1 opacity-80 text-right">
                      {new Date(m.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            
            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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