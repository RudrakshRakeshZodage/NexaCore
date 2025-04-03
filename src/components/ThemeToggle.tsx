
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  
  // Hide toggle on index page and in dashboard settings
  const shouldHideToggle = 
    location.pathname === "/" || 
    location.pathname === "/index" || 
    location.pathname === "/settings";
  
  if (shouldHideToggle) {
    return null;
  }
  
  // Function to toggle between dark and light mode
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Effect to add a transition class to the body for smooth theme transitions
  useEffect(() => {
    document.body.classList.add('transition-colors', 'duration-300');
    
    return () => {
      document.body.classList.remove('transition-colors', 'duration-300');
    };
  }, []);

  // Effect to ensure correct theme application
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.style.backgroundColor = 'hsl(222, 47%, 11%)';
      document.body.style.color = 'hsl(210, 40%, 98%)';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      document.body.style.backgroundColor = 'hsl(0, 0%, 100%)';
      document.body.style.color = 'hsl(222, 47%, 11%)';
    }
  }, [theme]);
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={theme === 'dark' 
        ? "rounded-full bg-gray-800 hover:bg-gray-700" 
        : "rounded-full bg-gray-100 hover:bg-gray-200"}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-yellow-300" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-slate-700" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
