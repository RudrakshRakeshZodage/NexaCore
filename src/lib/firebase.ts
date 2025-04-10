// firebase.ts (or firebase.js)
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAwurFYyoCiHtsJ2BIKp4oWbyPDFTCJj60",
  authDomain: "nexacore-88acc.firebaseapp.com",
  projectId: "nexacore-88acc",
  storageBucket: "nexacore-88acc.firebasestorage.app",
  messagingSenderId: "88717844514",
  appId: "1:88717844514:web:89f4118c298ff39f732a7b",
  measurementId: "G-1NVR6J90R5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Function to log in with Google
const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User signed in:", user);
    return user;
  } catch (error) {
    console.error("Error during Google login:", error);
    throw error;
  }
};



export { app, analytics, db, auth, storage, loginWithGoogle };