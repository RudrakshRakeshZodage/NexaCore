
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

const Hero = () => {
  const { theme } = useTheme();
  
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${theme === 'dark' 
        ? 'bg-gradient-to-b from-nexacore-blue-dark via-nexacore-blue to-nexacore-blue-dark' 
        : 'bg-gradient-to-b from-gray-50 via-white to-gray-100'}`}></div>
      
      {/* Animated Shapes */}
      <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-nexacore-teal/20 dark:bg-primary/20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-40 h-40 rounded-full bg-nexacore-orange/20 dark:bg-destructive/20 blur-3xl animate-pulse"></div>
      <div className="absolute top-2/3 left-1/3 w-24 h-24 rounded-full bg-nexacore-pink/20 dark:bg-accent/20 blur-3xl animate-pulse"></div>
      
      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Text Content */}
        <div className="text-left animate-fade-in-up">
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Welcome to <span className="text-gradient">NexaCore</span>
          </h1>
          <p className={`text-xl md:text-2xl mb-10 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>
            Your intelligent companion for education, health, and financial management with AI-powered insights
          </p>
          <div className="flex flex-col md:flex-row gap-4 mb-16">
            <Link to="/signup">
              <Button size="lg" className={theme === 'dark'
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-nexacore-teal text-white hover:bg-nexacore-teal/90'}>
                Get Started
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              className={theme === 'dark'
                ? 'border-primary text-white hover:bg-primary/20'
                : 'border-nexacore-teal text-nexacore-blue hover:bg-nexacore-teal/20'} 
              onClick={scrollToFeatures}
            >
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Right Side: Image */}
        <div className="relative h-[400px] md:h-[500px] animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <img 
            src="/lovable-uploads/067333f5-c8c6-49f4-94d9-e5c28cd8f5ff.png" 
            alt="NexaCore Dashboard" 
            className="w-full h-full object-contain rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-500"
          />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-nexacore-teal/30 dark:bg-primary/30 blur-xl -z-10"></div>
          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-nexacore-pink/30 dark:bg-accent/30 blur-xl -z-10"></div>
        </div>
      </div>
      
      {/* Scroll Down Button with enhanced animation */}
      <button 
        onClick={scrollToFeatures} 
        className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 ${
          theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-900'
        } flex flex-col items-center transition-all duration-300 animate-fade-in-up hover:scale-110`}
        style={{ animationDelay: "0.6s" }}
      >
        <span className="mb-2">Explore</span>
        <ChevronDown className="animate-bounce" />
      </button>
    </section>
  );
};

export default Hero;
