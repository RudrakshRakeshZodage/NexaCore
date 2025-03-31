
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UserFlow from "@/components/UserFlow";
import AuthSection from "@/components/AuthSection";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const Index = () => {
  // Add framer-motion to smooth scroll to sections when navigating
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    // Handle hash on initial page load
    if (window.location.hash) {
      setTimeout(handleHashChange, 100);
    }

    // Add event listener for hash changes
    window.addEventListener("hashchange", handleHashChange);
    
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-nexacore-blue-dark">
      <Navbar />
      <Hero />
      <Features />
      <UserFlow />
      <AuthSection />
      <Footer />
    </div>
  );
};

export default Index;
