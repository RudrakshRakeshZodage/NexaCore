
import { useTheme } from "@/context/ThemeContext";
import { useEffect } from "react";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  
  // Force dark mode on component mount and don't allow changes
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);
  
  // No button rendered - theme is forced to dark
  return null;
}
