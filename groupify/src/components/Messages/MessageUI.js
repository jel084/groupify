import React, { useState, useEffect, useRef } from "react";
import "../Messages/MessageUI.css"; // Assuming your existing CSS file path
import { db } from "../../firebase"; // Import Firestore instance
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  addDoc,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function MessageUI() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userId, setUserId] = useState(""); // State to store user ID
  const [loading, setLoading] = useState(true);
  const [messageContent, setMessageContent] = useState(""); // State for message content
  const [selectedRecipientId, setSelectedRecipientId] = useState(null); // State for selected recipient ID
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null); // Ref for scrolling

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(user.uid);
        setUserId(user.uid);
        await loadSelectedUsers(user.uid);
      } else {
        console.error("No user is currently logged in.");
        setUserId(""); // Clear userId if no user is logged in
        setSelectedUsers([]); // Optionally clear selected users
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const loadSelectedUsers = async (userId) => {
    setLoading(true); // Start loading
    try {
      const docSnap = await getDoc(doc(db, "userChats", userId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Loaded data:", data); // Debugging log
        setSelectedUsers(data.selectedUsers || []);
      } else {
        console.log("No data found for user");
        setSelectedUsers([]);
      }
    } catch (error) {
      console.error("Error loading selected users:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const saveSelectedUsers = async (newSelectedUsers) => {
    if (userId && !loading) {
      // Ensure not to save during loading
      try {
        await setDoc(doc(db, "userChats", userId), {
          selectedUsers: newSelectedUsers,
        });
        console.log("Selected users saved:", newSelectedUsers);
      } catch (error) {
        console.error("Error saving selected users:", error);
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", searchQuery)
      );
      const querySnapshot = await getDocs(userQuery);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching for users:", error);
    }
  };

  const handleUserClick = async (user) => {
    if (!selectedUsers.some((selectedUser) => selectedUser.id === user.id)) {
      const updatedSelectedUsers = [...selectedUsers, user];
      console.log("Updating selected users:", updatedSelectedUsers);
      setSelectedUsers(updatedSelectedUsers);
      await saveSelectedUsers(updatedSelectedUsers);
    }

    setSelectedRecipientId(user.id);
    loadMessages(user.id); // Load messages for the selected user
  };

  const sendMessage = async (recipientID, messageContent) => {
    if (!messageContent || !recipientID) {
      console.error("Recipient ID or message content missing.");
      return;
    }
    try {
      console.log("Sending message to:", recipientID);
      console.log("Message content:", messageContent);

      // Grabs the document reference for the current user's chat
      const chatDocRef = doc(db, "userChats", userId);
      const chatDocRef2 = doc(db, "userChats", recipientID);

      // References the 'messages' subcollection within the userChats document
      const messagesRef = collection(chatDocRef, selectedRecipientId);
      const messageRef2 = collection(chatDocRef2, userId);

      await Promise.all([
        addDoc(messagesRef, {
          senderID: userId,
          recipientID,
          content: messageContent,
          timestamp: serverTimestamp(),
        }),
        addDoc(messageRef2, {
          senderID: userId,
          recipientID,
          content: messageContent,
          timestamp: serverTimestamp(),
        }),
      ]);

      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const loadMessages = (recipientID) => {
    if (!userId || !recipientID) return; // Ensure userId is set

    const chatDocRef = doc(db, "userChats", userId);
    const messagesRef = collection(chatDocRef, recipientID);
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

    // Set up a listener for real-time updates
    const unsubscribe = onSnapshot(
      messagesQuery,
      (querySnapshot) => {
        const loadedMessages = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Capture the document ID if needed
          ...doc.data(),
        }));
        setMessages(loadedMessages); // Update state with loaded messages
        scrollToBottom();
      },
      (error) => {
        console.error("Error listening for messages:", error);
      }
    );
    return unsubscribe; // Return the unsubscribe function
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="absolute bottom-0 -left-4 w-2/5 h-1/3 bg-[#329D9C] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob drop-shadow-md"></div>
      <div className="absolute bottom-0 -right-4 w-2/5 h-1/3 bg-[#bdf2c1] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob animation-delay-4000 drop-shadow-md"></div>
      <div className="absolute bottom-0 -right-200 w-2/5 h-1/3 bg-[#b2d7d9] rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob animation-delay-2000 drop-shadow-md"></div>
      <div className="header">
        <h1 className="Title">Messages</h1>
      </div>
      <div className="container">
        <div className="dms">
          <div className="search relative text-gray-600">
            <input
              type="search"
              name="search"
              placeholder="Search"
              className="relative bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%" }}
            />
            <button
              type="button"
              className="absolute right-0 top-0 mt-3 mr-4"
              onClick={handleSearch}
            >
              <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                id="Capa_1"
                x="0px"
                y="0px"
                viewBox="0 0 56.966 56.966"
                style={{ enableBackground: "new 0 0 56.966 56.966" }}
                xmlSpace="preserve"
                width="512px"
                height="512px"
              >
                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
              </svg>
            </button>
          </div>
          <div className="search-results mt-4">
            {searchResults.length > 0 ? (
              <ul>
                {searchResults.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => handleUserClick(user)}
                    className="search-result-item cursor-pointer hover:bg-gray-100"
                  >
                    {user.email}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No results</p>
            )}
          </div>
          <div className="groupDm">

          </div>
          <div className="personalDm">
            <h2>Your Chats</h2>
            {/* unordered list of chats - basically creates a list based on userID 
            and when you click it */}
            <ul>
              {selectedUsers.length > 0 ? (
                selectedUsers.map((user) => (
                  <li key={user.id} className="chat-preview">
                    <button
                      onClick={() => handleUserClick(user)} // Load messages for the selected user
                      className="w-full text-left px-4 py-2 bg-gray-200 hover:bg-gray-400"
                    >
                      {user.email}
                    </button>
                  </li>
                ))
              ) : (
                <p>No chats available</p>
              )}
            </ul>
          </div>
        </div>

        <div className="min-w-[70%] max-w-[45vw] h-[80vh] max-h-[91%] bg-green shadow-lg rounded-lg relative mx-auto mt-4 flex flex-col">
          <div className="flex-1 overflow-auto p-4 flex flex-col-reverse">
            <ul className="space-y-4">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <li
                    key={index}
                    className={`flex items-start ${
                      msg.senderID === userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className={`flex flex-col max-w-xs`}>
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          msg.senderID === userId
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p>{msg.content}</p>
                      </div>
                      <span
                        className={`text-xs text-gray-800 mt-1 ${
                          msg.senderID === userId ? "text-right" : "text-left"
                        }`}
                      >
                        {msg.timestamp && msg.timestamp.seconds
                          ? new Date(
                              msg.timestamp.seconds * 1000
                            ).toLocaleTimeString()
                          : "Timestamp not available"}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center">No messages</p>
              )}
            </ul>
          </div>

          <div className="p-4 border-t border-gray-200 bg-white flex items-center">
            {/* <input
              type="text"
              placeholder="Type a message"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-lg"
            /> */}
            <textarea
              placeholder="Type a message"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={1} // Starting with one row
              onInput={(e) => {
                e.target.style.height = "auto"; // Reset height to auto
                e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height based on content
              }}
              className="flex-grow p-2 border border-gray-300 rounded-lg resize-none max-w-[calc(100%-64px)]" // Prevents resizing horizontally and limits max width
              style={{ minHeight: "40px", minWidth: "50px" }} // Set a minimum height if you want
            />
            <button
              onClick={async () => {
                await sendMessage(selectedRecipientId, messageContent);
                await loadMessages(selectedRecipientId); // Ensure messages are loaded after sending
                setMessageContent(""); // Optionally clear the message input after sending
              }}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MessageUI;
