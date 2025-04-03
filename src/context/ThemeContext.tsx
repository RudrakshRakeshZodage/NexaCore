
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeContextType = {
  theme: "dark",
  setTheme: () => null,
};

const ThemeContext = createContext<ThemeContextType>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "nexacore-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  // Apply theme changes to the DOM
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes first
    root.classList.remove("light", "dark");
    
    // Apply the appropriate theme class
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      
      // Set body styles for consistent theme application
      applyBodyStyles(systemTheme);
    } else {
      root.classList.add(theme);
      
      // Set body styles for consistent theme application
      applyBodyStyles(theme);
    }

    // Update color meta tags for mobile browsers
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (!metaThemeColor) {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = theme === "dark" ? "#10151c" : "#ffffff";
      document.head.appendChild(meta);
    } else {
      metaThemeColor.setAttribute("content", theme === "dark" ? "#10151c" : "#ffffff");
    }
  }, [theme]);

  // Function to consistently apply body styles
  const applyBodyStyles = (currentTheme: string) => {
    if (currentTheme === 'dark') {
      document.body.style.backgroundColor = 'hsl(222, 47%, 11%)';
      document.body.style.color = 'hsl(210, 40%, 98%)';
      
      // Apply dark mode to specific elements
      document.querySelectorAll('[data-theme-aware="true"]').forEach(el => {
        (el as HTMLElement).classList.add('dark-theme');
        (el as HTMLElement).classList.remove('light-theme');
      });
    } else {
      document.body.style.backgroundColor = 'hsl(0, 0%, 100%)';
      document.body.style.color = 'hsl(222, 47%, 11%)';
      
      // Apply light mode to specific elements
      document.querySelectorAll('[data-theme-aware="true"]').forEach(el => {
        (el as HTMLElement).classList.add('light-theme');
        (el as HTMLElement).classList.remove('dark-theme');
      });
    }
  };

  // Listen for changes to preferred color scheme from the system
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
      const handleChange = () => {
        const root = window.document.documentElement;
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        
        root.classList.remove("light", "dark");
        root.classList.add(systemTheme);
        
        // Update body styles too
        applyBodyStyles(systemTheme);
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
};
