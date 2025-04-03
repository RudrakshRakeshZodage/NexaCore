
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import ChatbotScript from "./ChatbotScript";
import { motion } from "framer-motion";

const Hero = () => {
  const { theme } = useTheme();
  
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
      <div className="container mx-auto px-4 relative z-10 items-center">
        {/* Text Content */}
        <motion.div 
          className="text-center animate-fade-in-up"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-center gap-6 mb-6">
            <h1 className={`text-5xl md:text-7xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Welcome to <span className="text-gradient">NexaCore</span>
            </h1>
          </div>
          <p className={`text-xl md:text-2xl mb-10 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>
            Your intelligent companion for education, health, and financial management with AI-powered insights
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-16">
            <Link to="/signup">
              <Button size="lg" className={theme === 'dark'
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-nexacore-teal text-white hover:bg-nexacore-teal/90'}>
                Get Started
              </Button>
            </Link>
          </div>
        </motion.div>
        
        {/* Featured Image */}
        <motion.div 
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <img 
            src="/lovable-uploads/5a800046-950c-4d85-bcc4-6569b72ebeba.png" 
            alt="Workspace setup with laptop, notebook, coffee and phone" 
            className="w-full max-w-3xl rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-500"
          />
        </motion.div>
      </div>
      
      {/* Add Chatbot */}
      <ChatbotScript />
    </section>
  );
};

export default Hero;
