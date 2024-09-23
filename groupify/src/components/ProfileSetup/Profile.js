import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from "../../firebase";
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Firestore imports
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import getAuth and onAuthStateChanged
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import CSE_Banner from '../../pictures/CSE_Banner.jpg';

const Profile = () => {
    const [imageURL, setImageURL] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [aboutMe, setAboutMe] = useState('');
    const [courses, setCourses] = useState('');
    const [preferences, setPreferences] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true); // Track loading state
    const [userId, setUserId] = useState(null); // Track the user's ID once Firebase Auth is initialized

    // UseEffect to initialize Firebase Auth and fetch user data
    useEffect(() => {
        const auth = getAuth();

        // Wait for Firebase Auth to initialize
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userId = user.uid;
                setUserId(userId);
                fetchProfilePicture(userId);
                fetchUserProfile(userId);
            } else {
                console.log("No user is signed in");
            }
            setLoading(false); // Set loading to false when done
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Function to fetch profile picture from Firebase Storage
    const fetchProfilePicture = async (userId) => {
        try {
            const storageRef = ref(storage, `profile_pictures/${userId}.png`);
            const url = await getDownloadURL(storageRef);
            setImageURL(url);
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
    };

    // Function to fetch user profile from Firestore
    const fetchUserProfile = async (userId) => {
        try {
            const docRef = doc(db, "users", userId); // Reference to the user's document in Firestore
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                setName(userData.name || ''); // Set profile data
                setUsername(userData.username || '');
                setAboutMe(userData.aboutMe || '');
                setCourses(userData.courses || []);
                setPreferences(userData.preferences || []);
                setImageURL(userData.profilePicture || ''); // Retrieve and set profile picture URL
            } else {
                console.log("No user profile found");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    // Function to handle profile picture upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImage(file);
        }
    };

    // Upload image to Firebase Storage and update the profile picture URL in Firestore
    const uploadImage = async (file) => {
        const storageRef = ref(storage, `profile_pictures/${userId}.png`); // Save image under the user's UID
        try {
            await uploadBytes(storageRef, file); // Upload the image to Firebase Storage
            const downloadURL = await getDownloadURL(storageRef); // Get the download URL of the uploaded image
            setImageURL(downloadURL); // Set the image URL in state

            // Now store the image URL in Firestore in the user's profile document
            await setDoc(doc(db, "users", userId), {
                profilePicture: downloadURL, // Save the image URL under profilePicture field
            }, { merge: true }); // merge: true ensures it doesn’t overwrite other fields
            console.log('Profile picture URL successfully saved to Firestore');
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    // Function to update the user profile in Firestore
    const saveProfile = async () => {
        try {
            await setDoc(doc(db, "users", userId), { // Use the current user's ID
                name,
                username,
                aboutMe,
                courses,
                preferences
            }, { merge: true }); // Use merge: true to avoid overwriting other fields
            console.log("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while fetching data
    }

    return (
        <div className="flex items-center justify-center">
            <div className="w-11/12 h-3/4 bg-[#D9D9D9] rounded-lg shadow-lg overflow-hidden relative">
                <div className="h-1/4 w-full">
                    <img
                        src={CSE_Banner}
                        alt="Banner"
                        className="object-cover h-full w-full"
                    />
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-md">
                    <div className="flex items-center justify-center mt-4">
                        <label
                            htmlFor="file-input"
                            className="relative cursor-pointer"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <div
                                className="w-36 h-36 rounded-full bg-cover bg-center hover:opacity-80"
                                style={{ backgroundImage: `url(${imageURL})` }} // Display the image URL from Firestore
                            ></div>
                            {isHovered && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                                    <FontAwesomeIcon icon={faPen} className="text-white text-2xl" />
                                </div>
                            )}
                        </label>
                        <input
                            id="file-input"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                {/* Profile Information Section */}
                <div className="flex flex-col items-center mt-20">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Name"
                        className="text-center font-bold"
                    />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter Username"
                        className="text-center text-gray-600"
                    />
                </div>

                <div className="p-6">
                    {/* About Me Section */}
                    <div>
                        <h3>About Me:</h3>
                        <textarea
                            value={aboutMe}
                            onChange={(e) => setAboutMe(e.target.value)}
                            className="w-full border rounded"
                            placeholder="Tell us about yourself"
                        ></textarea>
                    </div>

                    {/* Courses Section */}
                    <div>
                        <h3>Courses:</h3>
                        <input
                            type="text"
                            value={courses}
                            onChange={(e) => setCourses(e.target.value)}
                            className="w-full border rounded"
                            placeholder="List relevant courses"
                        />
                    </div>

                    {/* Preferences Section */}
                    <div>
                        <h3>Preferences:</h3>
                        <input
                            type="text"
                            value={preferences}
                            onChange={(e) => setPreferences(e.target.value)}
                            className="w-full border rounded"
                            placeholder="Enter your study preferences"
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={saveProfile}
                        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
                    >
                        Save Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
