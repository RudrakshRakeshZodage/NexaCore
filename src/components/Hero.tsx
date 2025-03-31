
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-nexacore-blue-dark overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/lovable-uploads/8963f8df-dd2d-4847-81fe-8ebbc1de127f.png')] bg-center bg-no-repeat bg-contain opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-nexacore-blue-dark via-nexacore-blue to-nexacore-blue-dark opacity-90"></div>
      
      {/* Animated Shapes */}
      <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-nexacore-teal/20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-40 h-40 rounded-full bg-nexacore-orange/20 blur-3xl animate-pulse"></div>
      <div className="absolute top-2/3 left-1/3 w-24 h-24 rounded-full bg-nexacore-pink/20 blur-3xl animate-pulse"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
          Welcome to <span className="text-gradient">NexaCore</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Your intelligent companion for education, health, and financial management with AI-powered insights
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-16 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Button size="lg" className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal-light">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="border-nexacore-teal text-white hover:bg-nexacore-teal/20">
            Learn More
          </Button>
        </div>
        
        {/* Scroll Down Button */}
        <button 
          onClick={scrollToFeatures} 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white/60 hover:text-white flex flex-col items-center transition-all animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <span className="mb-2">Explore</span>
          <ChevronDown className="animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
