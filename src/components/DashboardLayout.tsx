
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  LayoutDashboard,
  BookOpen,
  Heart,
  PieChart,
  FileText,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sun,
  Moon,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  
  // Mount animation
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Education", path: "/education", icon: <BookOpen size={20} /> },
    { name: "Health", path: "/health", icon: <Heart size={20} /> },
    { name: "Finance", path: "/finance", icon: <PieChart size={20} /> },
    { name: "Reports", path: "/reports", icon: <FileText size={20} /> },
    { name: "Attendance", path: "/attendance", icon: <MapPin size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100' 
        : 'bg-gradient-to-b from-gray-50 to-white text-gray-900'
    } flex transition-colors duration-300`}>
      {/* Mobile sidebar toggle */}
      <button
        className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-md ${
          theme === 'dark'
            ? 'bg-gray-800/80 text-white'
            : 'bg-white/80 text-gray-900'
        }`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 transform backdrop-blur-lg w-64 z-40 transition-transform duration-300 ease-in-out md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          theme === 'dark'
            ? "bg-gray-900/95 border-gray-800"
            : "bg-white/95 border-gray-200",
          "border-r"
        )}
      >
        {/* Logo */}
        <div className={`p-4 border-b ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-primary/20' : 'bg-nexacore-teal/20'
            }`}>
              <span className={`font-bold ${
                theme === 'dark' ? 'text-primary' : 'text-nexacore-teal'
              }`}>N</span>
            </div>
            <h1 className="text-2xl font-bold text-gradient">NexaCore</h1>
          </Link>
        </div>

        {/* User info */}
        <div className={`p-4 border-b ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-primary/20' : 'bg-nexacore-teal/20'
            }`}>
              <User size={20} className={
                theme === 'dark' ? 'text-primary' : 'text-nexacore-teal'
              } />
            </div>
            <div>
              <p className="font-medium">{user?.name || "User"}</p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>{user?.email || "user@example.com"}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path} className={isMounted ? 'fade-in' : 'opacity-0'} style={{
                animationDelay: `${navItems.indexOf(item) * 50}ms`
              }}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-all duration-200",
                    location.pathname === item.path
                      ? theme === 'dark' 
                        ? "bg-primary text-background font-medium" 
                        : "bg-nexacore-teal text-white font-medium"
                      : theme === 'dark'
                        ? "hover:bg-gray-800" 
                        : "hover:bg-gray-100"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                  {location.pathname === item.path && (
                    <ChevronRight size={16} className="ml-auto" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Theme Toggle & Logout */}
        <div className={`absolute bottom-0 w-full p-4 border-t ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm">Theme</span>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className={`h-8 w-8 rounded-full ${
                theme === 'dark' 
                  ? 'border-gray-700 hover:bg-gray-800' 
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-yellow-300" />
              ) : (
                <Moon size={16} className="text-gray-700" />
              )}
            </Button>
          </div>
          <Button
            variant="outline"
            className={`w-full justify-start ${
              theme === 'dark' 
                ? 'border-gray-700 hover:bg-gray-800' 
                : 'border-gray-300 hover:bg-gray-100'
            }`}
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out overflow-auto pt-16 md:pt-0",
        isSidebarOpen ? "md:ml-64" : "ml-0"
      )}>
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
