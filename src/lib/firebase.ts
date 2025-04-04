import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Import Authentication and GoogleAuthProvider, signInWithPopup
import { getStorage } from "firebase/storage"; // Import Storage

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
const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app); // Initialize Authentication
const storage = getStorage(app); // Initialize Storage

// Function to log in with Google
const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider(); // Create a GoogleAuthProvider instance
  try {
    const result = await signInWithPopup(auth, provider); // Sign in with a popup
    const user = result.user; // Get the signed-in user information
    console.log("User signed in:", user);
    return user;
  } catch (error) {
    console.error("Error during Google login:", error);
    throw error;
  }
};

export { app, analytics, db, auth, storage, loginWithGoogle, getAuth }; // Export the loginWithGoogle function // Export the loginWithGoogle function