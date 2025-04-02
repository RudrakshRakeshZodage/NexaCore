
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UserFlow from "@/components/UserFlow";
import AuthSection from "@/components/AuthSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Images for parallax effect
  const images = [
    { 
      src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
      alt: "Woman using laptop",
      position: "top-20 -right-64 md:-right-20 lg:right-0 xl:right-20 w-[500px] opacity-20",
      rotate: "rotate-6",
      delay: "delay-100",
      opacityValue: "20"
    },
    { 
      src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80",
      alt: "Tech interface",
      position: "-bottom-20 -left-64 md:-left-20 lg:left-0 xl:left-20 w-[400px] opacity-10",
      rotate: "-rotate-12",
      delay: "delay-200",
      opacityValue: "10"
    },
    { 
      src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80",
      alt: "Woman with laptop",
      position: "top-40 -left-64 md:-left-20 lg:left-5 xl:left-32 w-[350px] opacity-10",
      rotate: "rotate-12",
      delay: "delay-300",
      opacityValue: "10"
    },
    { 
      src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80",
      alt: "Laptop on desk",
      position: "-bottom-40 -right-64 md:-right-20 lg:right-5 xl:right-32 w-[450px] opacity-20",
      rotate: "-rotate-6",
      delay: "delay-150",
      opacityValue: "20"
    },
    { 
      src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80",
      alt: "Person using MacBook Pro",
      position: "top-60 left-1/3 w-[380px] opacity-15 hidden lg:block",
      rotate: "rotate-3",
      delay: "delay-250",
      opacityValue: "15"
    },
    { 
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
      alt: "Laptop on glass table",
      position: "bottom-10 right-1/4 w-[320px] opacity-10 hidden lg:block",
      rotate: "-rotate-3",
      delay: "delay-200",
      opacityValue: "10"
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-nexacore-blue-dark overflow-hidden relative">
      {/* Decorative floating images */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {images.map((img, index) => (
          <div 
            key={index} 
            className={`absolute ${img.position} ${img.rotate} ${img.delay} transform transition-all duration-1000 ease-in-out`}
            style={{ 
              opacity: isLoaded ? Number("0." + img.opacityValue) : 0,
              transform: `${img.rotate} ${isLoaded ? 'translateY(0)' : 'translateY(20px)'}`,
            }}
          >
            <img 
              src={img.src} 
              alt={img.alt} 
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        ))}
      </div>
      
      {/* Animated gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-nexacore-blue-dark/90 via-nexacore-blue-dark/70 to-nexacore-blue-dark/90 z-0"></div>
      
      {/* Main content */}
      <div className={`relative z-10 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar />
        <Hero />
        <Features />
        <UserFlow />
        <AuthSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
