
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwurFYyoCiHtsJ2BIKp4oWbyPDFTCJj60",
  authDomain: "nexacore-88acc.firebaseapp.com",
  projectId: "nexacore-88acc",
  storageBucket: "nexacore-88acc.firebasestorage.app",
  messagingSenderId: "88717844514",
  appId: "1:88717844514:web:89f4118c298ff39f732a7b",
  measurementId: "G-1NVR6J90R5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
