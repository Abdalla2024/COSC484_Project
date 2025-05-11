import { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../auth/firebaseconfig';
import { useNavigate, useParams } from 'react-router-dom';    // ← added useParams
import useDebounce from '../hooks/useDebounce';

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'http://localhost:3000';

export default function Messages() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const { otherUserId } = useParams();                          // ← grab optional param

  // Mongo _id of logged-in user
  const [currentUserId, setCurrentUserId] = useState(null);

  const [conversations, setConversations] = useState([]);
  const [unreadCounts , setUnreadCounts ] = useState({});
  const [selectedUser , setSelectedUser ] = useState(null);
  const [messages     , setMessages     ] = useState([]);
  const [newMessage   , setNewMessage   ] = useState('');

  // Search
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 500);

  const endRef = useRef(null);
  const scrollToBottom = () => endRef.current?.scrollIntoView({ behavior: 'smooth' });

  const fmtTimeAgo = ts => {
    const now = Date.now(), d = now - new Date(ts);
    if (d < 3600e3) return 'just now';
    if (d < 86400e3) return `${Math.floor(d/3600e3)}h ago`;
    return `${Math.floor(d/86400e3)}d ago`;
  };

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
          console.log("Current user ID for comparison:", currentUserId);
          console.log("Types - currentUserId:", typeof currentUserId);
          console.log("Types - first message senderId:", typeof allMsgs[0].senderId);
        }
        
        // Convert all IDs to strings for comparison
        const currentUserIdStr = currentUserId.toString();
        
        const partnerIds = Array.from(new Set(
          allMsgs.map(m => {
            const senderIdStr = m.senderId.toString();
            const receiverIdStr = m.receiverId.toString();
            
            console.log("Comparing:", {
              senderIdStr,
              receiverIdStr,
              currentUserIdStr,
              isSender: senderIdStr === currentUserIdStr
            });
            
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
          
          const lastMsg = thread[thread.length - 1];
          console.log("Last message:", lastMsg.content);

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
    if (!otherUserId || !conversations.length) return;
    const convo = conversations.find(c => c.id === otherUserId);
    if (convo) {
      setSelectedUser(convo);
    }
  }, [otherUserId, conversations]);

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
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading || !currentUserId) {
    return <div className="flex items-center justify-center h-screen">Loading…</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] mt-16 w-full">
      {/* ── Conversations Sidebar ── */}
      <div className="w-1/4 border-r bg-white p-4">
        <h2 className="text-xl font-bold mb-4 text-black">Conversations</h2>
        <input
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder="Search…"
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <div className="space-y-2 overflow-y-auto max-h-[70vh]">
          {conversations.map(c => (
            <div
              key={c.id}
              onClick={() => setSelectedUser(c)}
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                selectedUser?.id === c.id ? 'bg-gray-200' : ''
              }`}
            >
              <div className="flex justify-between">
                <span className="font-medium text-black">{c.displayName}</span>
                <span className="text-xs text-gray-500">
                  {fmtTimeAgo(c.last.timestamp)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="truncate text-sm text-black">{c.last.content}</p>
                {unreadCounts[c.id] > 0 && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b flex flex-col items-center">
              {selectedUser.photoURL
                ? <img src={selectedUser.photoURL} className="w-16 h-16 rounded-full" />
                : <div className="w-16 h-16 rounded-full bg-gray-200" />}
              <h2 className="mt-2 font-semibold text-black">{selectedUser.displayName}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(m => (
                <div
                  key={m._id}
                  className={`flex ${
                    m.senderId === currentUserId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`p-3 rounded-lg max-w-xs ${
                    m.senderId === currentUserId
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-black'
                  }`}>
                    <p className="text-sm">{m.content}</p>
                    <p className="text-xs mt-1 text-right opacity-75">
                      {new Date(m.timestamp).toLocaleTimeString([], {
                        hour:   '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t flex space-x-2">
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 px-3 py-2 border rounded text-black"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded">Send</button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-black">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}