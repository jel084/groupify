import React, { useState, useEffect} from "react";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from "../../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const ProfilePicture = () =>{
    //variables
    const[imageURL, setImageURL] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    // const[imageFile, setImageFile] = useState(null);

    //functions
    //sets file url to actually be displayed
    useEffect(() => { //we use useEffect bc the effect is display the image on the screen from FB storage
        fetchProfilePicture();

        async function fetchProfilePicture() {
            try{
                const storageRef = ref(storage, 'profile_pictures/default.png'); //makes a reference to the image
                const url = await getDownloadURL(storageRef); //gets the url
                setImageURL(url);
            } catch (error) {
                console.error('Error fetching profile picture:', error);
            }
        }
    }, []);


    //when user uploads new image file and actually TRIGGERS the process
    const handleFileChange = (e) =>{
        const file = e.target.files[0]; //first file that usr inputs
        if(file){
            uploadImage(file); //calls function below to upload image to firebase
        }
    };

    //upload images to FB and update pfp url to new image
    const uploadImage = async (file) =>{
        const storageRef = ref(storage,`profile_pictures/${file.name}`);
        try{
            await uploadBytes(storageRef, file); //upload image to fb
            const downloadURL = await getDownloadURL(storageRef); //var to get URL
            setImageURL(downloadURL); //set image URL
            console.log('Image uploaded succesfully:',downloadURL);
        } catch(error){
            console.error('Error uploading image:',error);
        }  
    };

    return (
        <div className="flex items-center justify-center mt-4">
            <label 
                htmlFor="file-input" 
                className="relative cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    className="w-36 h-36 rounded-full bg-cover bg-center hover:opacity-80"
                    style={{ backgroundImage: `url(${imageURL})` }}
                ></div>
                {isHovered && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                        <FontAwesomeIcon icon={faPen} className="text-white text-2xl" />
                    </div>
                )}
            </label>
            <input
                id = "file-input"
                type = "file"
                className = 'hidden'
                accept = "image/*"
                onChange = {handleFileChange}
            />
        </div>
    );
};

export default ProfilePicture;