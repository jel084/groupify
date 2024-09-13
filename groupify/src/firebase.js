// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBX8IuTfxWkh2j2f5GGJR-ANP24KyjdHq0",
  authDomain: "groupify-665dc.firebaseapp.com",
  projectId: "groupify-665dc",
  storageBucket: "groupify-665dc.appspot.com",
  messagingSenderId: "717492919601",
  appId: "1:717492919601:web:0a4fd703f63c20fd606410",
  measurementId: "G-2J39RL0YN6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app); //idk if i need this
export const auth = getAuth(app);
const db = getFirestore(app);


export {app, storage, db};//idk if i need this
