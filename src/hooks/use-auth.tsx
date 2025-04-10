import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase"; // Import your Firebase auth instance

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  const signUp = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Redirect after signup
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error; // Re-throw the error for component-level handling
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Redirect after signin
    } catch (error: any) {
      console.error("Signin error:", error);
      throw error; // Re-throw the error for component-level handling
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async (): Promise<void> => {
    setLoading(true);
    try {
      await signOut(auth);
      navigate("/login"); // Redirect after signout
    } catch (error: any) {
      console.error("Signout error:", error);
      throw error; // Re-throw the error for component-level handling
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    signUp,
    signIn,
    signOutUser,
    loading,     
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};