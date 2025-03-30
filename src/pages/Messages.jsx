import { useEffect,useState } from "react";
import { db } from "../auth/firebaseconfig";
import { addDoc, getDocs, updateDoc, doc, collection, serverTimestamp} from "firebase/firestore";
import { use } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const mockMessages = {
  "1":  [
    { id: "1", text: "Hey! How's it going?", sender: "Pau" },
    { id: "2", text: "Not bad! You?", sender: "You" }
  ],
  "2": [
    { id: "1", text: "I'm interested in this listing", sender: "Tyler" },
    { id: "2", text: "Great! When can you view it?", sender: "You" }
  ],
  "3": [
    { id: "1", text: "$20 offer we can meet now?", sender: "Dominick" },
    { id: "2", text: "Let's meet at the cafe", sender: "You" }
  ],
  "4": [
    { id: "1", text: "Can we meet up?", sender: "Abdullah" },
    { id: "2", text: "For sure!", sender: "You" }
  ],
  "5": [
    { id: "1", text: "YOOOOOO", sender: "Rasheed" },
    { id: "2", text: "What's good?", sender: "You" }
  ]
};

const sendMessage = async (chatId, senderId, text) => {
  try {
    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId,
      text,
      timestamp: serverTimestamp(),
    });
    console.log("Message sent!");
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const chatNames = 

{
  "1" : "Pau",
  "2" : "Tyler",
  "3" : "Dominick",
  "4" : "Abdullah",
  "5" : "Rasheed"
}

function Messages() {

  const { chatId } = useParams();
  const [messages, setMessages] = useState(mockMessages[chatId] || []);
  const [newMessage, setNewMessage] = useState("");
  
  console.log(chatId)


  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "You"
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  return (
    <div className="absolute inset-0 bg-gray-50 pt-20">
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-[600px]">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b">
            <Link to="/chats" className="text-blue-500">&larr; Back</Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {chatNames[chatId] || "Unknown"}
            </h1>
            <div className="w-6"></div> {/* Spacer */}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 p-4">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
              >
                <div className={`p-3 rounded-lg max-w-xs ${
                  msg.sender === "You" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-200 text-gray-900"
                }`}>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="mt-4 flex items-center border-t pt-4">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg focus:outline-none"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button 
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;