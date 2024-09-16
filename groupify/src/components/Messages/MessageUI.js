import React, { useState, useEffect } from 'react';
import '../Messages/MessageUI.css'; // Assuming your existing CSS file path
import { db } from '../../firebase'; // Import Firestore instance
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function MessageUI() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userId, setUserId] = useState(''); // State to store user ID

    //This method checks for the user authentication. I dont know if its entirely necessary, however, chatgpt said it was.
    //in the first part of the if statement it logs the user id and then sets the user id to the userId variable.
    //After doing that, it loads the users that this user has started a chat with. the loadSelectedUsers method makes a little more sense later on.
    //The else part of the statement is just basically error checking, however, i dont think itll ever use that else statement.

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log(user.uid);
                setUserId(user.uid);
                await loadSelectedUsers(user.uid);
            } else {
                console.error('No user is currently logged in.');
                setUserId(''); // Clear userId if no user is logged in
                setSelectedUsers([]); // Optionally clear selected users
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);


    // This is the method that will load the users that the current user has started a chat with. it does this by going into the firestore collections and going into the 
    // 'userChats' collection (this is a new collection i had to make in order for this system to work). The userChats collection is structured like this: 
    // 'userChats' -> userID -> an array that stores the people this user has interacted with. after we get the 'userChats' data, it is stored inside of docSnap which
    // then goes through an if statement. If the data exists, assign the data to a variable called 'data' and then populate the selectedUsers array with the data.
    // If the user hasn't interacted with anyone, set an empty array for this user. 
    const loadSelectedUsers = async (userId) => {
        try {
            const docSnap = await getDoc(doc(db, 'userChats', userId));
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log('Loaded data:', data); // Debugging log
                setSelectedUsers(data.selectedUsers || []);
            } else {
                console.log('No data found for user');
                setSelectedUsers([]);
            }
        } catch (error) {
            console.error('Error loading selected users:', error);
        }
    };

    // This method will be used to save the users the current user has interacted with. it starts off with an if statement that checks if theres a userID present
    // and then goes into a try catch block. Inside the "try" the program will set the data into the 'userChats' collection using the setDoc method. To explain it a little more,
    // its going into the 'userChats' collection and then going into the current user's ID and then setting the data that was obtained when the user tried to interact with another person. 

    useEffect(() => {
        const saveSelectedUsers = async () => {
            if (userId) {
                try {
                    await setDoc(doc(db, 'userChats', userId), { selectedUsers });
                    console.log('Selected users saved');
                } catch (error) {
                    console.error('Error saving selected users:', error);
                }
            }
        };
        saveSelectedUsers();
    }, [selectedUsers, userId]);

    // This method is still a bit iffy for me, however, the important part of it is that it handles the search function. I understand the userQuery line, however, the lines after that I need to research
    // a bit more. If you wanna look into it and teach me that would be amazing, however, if you'd wanna look at it together thats completely fine as well.

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const userQuery = query(collection(db, 'users'), where('email', '==', searchQuery));
            const querySnapshot = await getDocs(userQuery);
            const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching for users:', error);
        }
    };

    // This is probably one of the most important methods of this whole file. After we search for a user and their email appears on the website, this method will add the user into the persons chats within
    // the 'userChats' collection. In case a sounded a bit confusing, this method makes it so when you click the person you wanna talk with, that email is put into the people you are talking to. You can check
    // this in firestore under the collections. Whenever you search for someone, say meronpoop@gmail.com, their name will appear under the search. When you click the name, youll see it pop up under 'Your Chats'.
    // When you go into firestore, if you go into the 'userChats' collection and look for your userID, youll see that under the selectedUsers array 'meronpoop@gmail.com' will be stored.

    const handleUserClick = (user) => {
        if (!selectedUsers.some(selectedUser => selectedUser.id === user.id)) {
            const updatedSelectedUsers = [...selectedUsers, user];
            console.log('Updating selected users:', updatedSelectedUsers); // Log the updated array
            setSelectedUsers(updatedSelectedUsers);
        }
    };

    // This is all styling things that are still really confusing to me, we can look at this later if you'd like.

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
                            style={{ width: '100%' }}
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
                                style={{ enableBackground: 'new 0 0 56.966 56.966' }}
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
                                {searchResults.map(user => (
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
                            <p>No users found</p>
                        )}
                    </div>
                    <div className="groupDm">
                        <h2>Your Chats</h2>
                        <ul>
                            {selectedUsers.map(user => (
                                <li key={user.id} className="chat-preview">
                                    {user.email}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="personalDm"></div>
                </div>
                <div className="currMessage"></div>
            </div>
        </>
    );
}

export default MessageUI;


