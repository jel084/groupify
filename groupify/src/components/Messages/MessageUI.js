import React, { useState, useEffect } from "react";
import "../Messages/MessageUI.css"; // Assuming your existing CSS file path
import { db } from "../../firebase"; // Import Firestore instance
import { collection, query, where, getDocs, doc, setDoc, getDoc, serverTimestamp, addDoc, orderBy, } from "firebase/firestore";
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
      saveSelectedUsers(updatedSelectedUsers);
    }

    setSelectedRecipientId(user.id);
    await loadMessages(); // Load messages for the selected user
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

      // References the 'messages' subcollection within the userChats document
      const messagesRef = collection(chatDocRef, "messages");

      // Adds a new document to the 'messages' subcollection
      await addDoc(messagesRef, {
        senderID: userId,
        recipientID,
        content: messageContent,
        timestamp: serverTimestamp(), // Adds a server timestamp
      });

      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const loadMessages = async () => {
    if (!userId) return; // Ensure userId is set

    const chatDocRef = doc(db, "userChats", userId);
    const messagesRef = collection(chatDocRef, "messages");
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

    try {
      const querySnapshot = await getDocs(messagesQuery);
      const loadedMessages = querySnapshot.docs.map((doc) => doc.data());
      console.log("Loaded messages:", loadedMessages);
      setMessages(loadedMessages); // Update state with loaded messages
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  return (
    <>
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
            <h2>Your Chats</h2>
            <ul>
              {selectedUsers.map((user) => (
                <li key={user.id} className="chat-preview">
                  {user.email}
                </li>
              ))}
            </ul>
          </div>
          <div className="personalDm">
            {/* Display messages for selected recipient here */}
          </div>
        </div>

        <div className="min-w-[70%] max-w-[45vw] h-[80vh] max-h-[84.4%] bg-white shadow-[5px_5px_15px_rgba(0,0,0,0.3)] relative mt-[5%] m-2.5 rounded-[10px] mt-4 mx-auto p-4 flex flex-col">
        <div className="overflow-auto flex flex-col-reverse items-end px-15">
        {messages.length > 0 ? (
          <ul>
            {messages.map((msg, index) => (
              <li
                key={index}
                className={`message max-w-xs ${
                  msg.senderID === userId ? "sent" : "received"
                }`}
              >
                <p>{msg.content}</p>
                <span>
                  {new Date(msg.timestamp.seconds * 1000).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No messages</p>
        )}
      </div>
          <div className="flex-grow mb-4">
            {/* Display messages here */}
          </div>
          <div className="flex items-center gap-2 ">
            <input
              type="text"
              placeholder="Type a message"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={async () => {
                await sendMessage(selectedRecipientId, messageContent);
                await loadMessages(); // Ensure messages are loaded after sending
                setMessageContent(""); // Optionally clear the message input after sending
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MessageUI;
