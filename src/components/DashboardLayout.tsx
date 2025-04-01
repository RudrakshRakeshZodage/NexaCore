
import { useState } from "react";
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
  Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Education", path: "/education", icon: <BookOpen size={20} /> },
    { name: "Health", path: "/health", icon: <Heart size={20} /> },
    { name: "Finance", path: "/finance", icon: <PieChart size={20} /> },
    { name: "Reports", path: "/reports", icon: <FileText size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-nexacore-blue to-nexacore-blue-dark dark:from-background dark:to-background text-white dark:text-foreground flex">
      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-nexacore-blue-dark/80 dark:bg-background/80 p-2 rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 transform bg-nexacore-blue-dark/95 dark:bg-background/95 backdrop-blur-lg w-64 border-r border-white/10 dark:border-border z-40 transition-transform duration-300 ease-in-out md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-white/10 dark:border-border">
          <Link to="/dashboard">
            <h1 className="text-2xl font-bold text-gradient">NexaCore</h1>
          </Link>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-white/10 dark:border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-nexacore-teal/20 dark:bg-primary/20 flex items-center justify-center">
              <User size={20} className="text-nexacore-teal dark:text-primary" />
            </div>
            <div>
              <p className="font-medium">{user?.name || "User"}</p>
              <p className="text-sm text-white/60 dark:text-foreground/60">{user?.email || "user@example.com"}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background font-medium"
                      : "hover:bg-white/10 dark:hover:bg-foreground/10"
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
        <div className="absolute bottom-0 w-full p-4 border-t border-white/10 dark:border-border">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm">Theme</span>
            <ThemeToggle />
          </div>
          <Button
            variant="outline"
            className="w-full border-white/20 dark:border-foreground/20 hover:bg-white/10 dark:hover:bg-foreground/10 justify-start"
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
