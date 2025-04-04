import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, getDocs } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwurFYyoCiHtsJ2BIKp4oWbyPDFTCJj60",
  authDomain: "nexacore-88acc.firebaseapp.com",
  projectId: "nexacore-88acc",
  storageBucket: "nexacore-88acc.firebasestorage.app",
  messagingSenderId: "88717844514",
  appId: "1:88717844514:web:89f4118c298ff39f732a7b",
  measurementId: "G-1NVR6J90R5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface EducationData {
  id?: string; // Firestore document ID
  degree: string;
  institution: string;
  year: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  addEducation: (education: EducationData) => Promise<void>;
  getEducation: () => Promise<EducationData[]>;
  updateEducation: (id: string, education: EducationData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;

        setUser({
          id: firebaseUser.uid,
          name: userData?.name || firebaseUser.displayName || firebaseUser.email!.split('@')[0],
          email: firebaseUser.email!,
          avatar: userData?.avatar || firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email!.split('@')[0]}&background=random`,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Success",
        description: "You have successfully logged in",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL,
      }, { merge: true });

      toast({
        title: "Success",
        description: "You have successfully logged in with Google",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login with Google",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update user profile with the name
      await updateProfile(firebaseUser, { displayName: name });

      // Save user data to Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
      });

      toast({
        title: "Success",
        description: "Account created successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password reset email sent",
        description: "Please check your inbox for further instructions",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Add education data to Firestore
  const addEducation = async (education: EducationData) => {
    if (!user) throw new Error("User not authenticated");
    const educationRef = collection(db, "users", user.id, "education");
    await addDoc(educationRef, education);
    toast({
      title: "Success",
      description: "Education data added successfully",
      variant: "default",
    });
  };

  // Fetch education data from Firestore
  const getEducation = async (): Promise<EducationData[]> => {
    if (!user) throw new Error("User not authenticated");
    const educationRef = collection(db, "users", user.id, "education");
    const snapshot = await getDocs(educationRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as EducationData));
  };

  // Update education data in Firestore
  const updateEducation = async (id: string, education: EducationData) => {
    if (!user) throw new Error("User not authenticated");
    const educationDocRef = doc(db, "users", user.id, "education", id);
    await updateDoc(educationDocRef, { ...education });
    toast({
      title: "Success",
      description: "Education data updated successfully",
      variant: "default",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        signup,
        logout,
        forgotPassword,
        addEducation,
        getEducation,
        updateEducation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { getAuth, auth, db };