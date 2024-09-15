import React, { useEffect } from 'react';
import '../Messages/MessageUI.css'; // Assuming your existing CSS file path
import { db } from '../../firebase'; // Import Firestore instance
import { collection, addDoc } from 'firebase/firestore';

function MessageUI() {
    useEffect(() => {
        const initializeFirestore = async () => {
            try {
                // Add a sample message to Firestore
                await addDoc(collection(db, 'messages'), {
                    text: 'Hello from Firestore!',
                    sender: 'InitialSetup', // Replace with actual sender ID later
                    timestamp: new Date()
                });
                console.log('Message added to Firestore!');
            } catch (error) {
                console.error('Error adding message to Firestore:', error);
            }
        };

        // Initialize Firestore when component mounts
        initializeFirestore();
    }, []); // Empty dependency array ensures it runs only once on mount

    return (
        <>
            <div className="header">
                <h1 className="Title">Messages</h1>
            </div>

            <div className="container">
                <div className="dms">
                    <div className="search"></div>
                    <div className="groupDm"></div>
                    <div className="personalDm"></div>
                </div>
                <div className="currMessage"></div>
            </div>
        </>
    );
}

export default MessageUI;
