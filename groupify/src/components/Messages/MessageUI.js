import React, { useState, useEffect } from 'react';
import '../Messages/MessageUI.css'; // Assuming your existing CSS file path
import { db } from '../../firebase'; // Import Firestore instance
import { collection, query, where, getDocs } from 'firebase/firestore';

function MessageUI() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const initializeFirestore = async () => {
            try {
                // Add a sample message to Firestore (optional, for initial setup)
                // await addDoc(collection(db, 'messages'), {
                //     text: 'Hello from Firestore!',
                //     sender: 'InitialSetup', // Replace with actual sender ID later
                //     timestamp: new Date()
                // });
                // console.log('Message added to Firestore!');
            } catch (error) {
                console.error('Error initializing Firestore:', error);
            }
        };

        // Initialize Firestore when component mounts
        initializeFirestore();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            // Query Firestore for users that match the search query
            const userQuery = query(collection(db, 'users'), where('email', '==', searchQuery));
            const querySnapshot = await getDocs(userQuery);

            const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching for users:', error);
        }
    };

    return (
        <>
            <div className="header">
                <h1 className="Title">Messages</h1>
            </div>

            <div className="container">
                <div className="dms">
                    <div className="search">
                        <form onSubmit={handleSearch} className="search-form">
                            <input
                                type="text"
                                placeholder="Search for users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            <button type="submit" className="search-button">Search</button>
                        </form>
                        <div className="search-results">
                            {searchResults.length > 0 ? (
                                <ul>
                                    {searchResults.map(user => (
                                        <li key={user.id}>{user.email}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No users found</p>
                            )}
                        </div>
                    </div>
                    <div className="groupDm"></div>
                    <div className="personalDm"></div>
                </div>
                <div className="currMessage"></div>
            </div>
        </>
    );
}

export default MessageUI;
