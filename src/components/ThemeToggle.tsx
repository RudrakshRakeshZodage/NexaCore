
import { useTheme } from "@/context/ThemeContext";
import { useEffect } from "react";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  
  // Force dark mode on component mount
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);
  
  // The button is now hidden as per requirements
  return null;
}
