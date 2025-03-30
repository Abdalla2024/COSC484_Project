import { useEffect } from "react";
import { db } from "../auth/firebaseconfig";
import { addDoc, getDocs, updateDoc, doc, collection, serverTimestamp} from "firebase/firestore";
import { use } from "react";
import { useNavigate } from "react-router-dom";

// useEffect(() => {
  //   const testChat = async () => {
  //     const buyerID = "fLBkkGbRB2fFotuWDr7kY3T6zMl2";
  //     const sellerID = "qHLMPvtbE3ejruB3yPWSXryLiDe2";
      
  //     try {
  //       const chatID = await createChat(buyerID, sellerID);
  //       console.log("Successfully created chat:", chatID);
  //     } catch (error) {
  //       console.error("Chat creation failed:", {
  //         error: error.message,
  //         stack: error.stack,
  //         firebaseErrorCode: error.code
  //       });
  //     }
  //   };
  
  //   // testChat();
  //   getChats();
  // }, []);

const mockChats = [
    { id: "1", text: "Hey, how's it going?", chatName: "Pau", timestamp: "53 mins ago" },
    { id: "2", text: "I am interested in this listing", chatName: "Tyler", timestamp: "2 mins ago" },
    { id: "3", text: "20$ offer we ca meet rn?.", chatName: "Dominick", timestamp:"1hr ago" },
    { id: "4", text: "Can we meet up?", chatName: "Abdullah", timestamp: "10 min ago"},
    { id: "5", text: "YOOOOOO", chatName: "Rasheeed" , timestamp: "23hr ago" },
  ];
  
  
//Create chat collection in which we store metadata (users chatting, timestamp, lastMessage)
  const createChat = async (buyerID, sellerID) => {
    try {
     
      const collectionRef = collection(db, "chats");
      const chatRef = await addDoc(collectionRef, {
        users: [buyerID, sellerID],
        lastMessage: '',
        timestamp: serverTimestamp()
      });
      console.log("Chat created with ID:", chatRef.id);
      //Use this chat ID to make a messages collection
      // return chatRef.id;
    } catch (error) {
      console.error("Error creating chat:", error);
      throw error;
    }
  };
  
  //Get all messages
  const getChats = async () => {
    const querySnapshot = await getDocs(collection(db, "chats"));
    // querySnapshot.forEach((doc) => {
    //   console.log(`${doc.id} =>`, doc.data());
    // });
    return querySnapshot;
  };

function chats(){

    const navigate = useNavigate()

    const handleClick = (chatID) => {
        console.log(chatID)
        navigate(`/messages/${chatID}`);
      };

    return (
        <div className="absolute inset-0 bg-gray-50 pt-20">
          <div className="w-full max-w-4xl mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
    
              {/* Chat List */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
              <div className="space-y-4">
                {mockChats.map((chat) => (
                    // <Link to={`/messages/${chat.id}`} key={chat.id}>
                  <div
                    key={chat.id}
                    onClick={ () => handleClick(chat.id)}
                    className="flex items-center p-4 bg-gray-100 rounded-lg border-b border-gray-300 hover:bg-gray-200 cursor-pointer"
                  >
                    {/* Default Avatar */}
                    <img
                      src="/default-profile.png"
                      alt="Default Avatar"
                      className="h-12 w-12 rounded-full object-cover mr-4"
                    />
                    {/* Chat Info */}
                    <div className="flex-1">
                    <p className="font-bold text-gray-900">{chat.chatName}</p>
                    <p className="text-sm text-gray-600 truncate">{chat.text}</p>
                    </div>
                    {/* Timestamp */}
                    <span className="text-gray-400 text-sm">{chat.timestamp}</span>
                  </div>
                // </Link>
                ))}
              </div>
    
            </div>
          </div>
        </div>
        </div>
      );
    }
    
    export default chats; 
