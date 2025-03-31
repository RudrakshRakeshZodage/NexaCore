
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Heart, 
  DollarSign, 
  FileText, 
  User, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Home, 
  ChevronDown
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-nexacore-blue-dark flex">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-64 flex-col bg-gradient-to-b from-nexacore-blue to-nexacore-blue-dark border-r border-white/10">
        <div className="p-6 mb-6">
          <h1 className="text-2xl font-bold text-gradient">NexaCore</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <Button
            variant={activeSection === "overview" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeSection === "overview" 
                ? "bg-nexacore-teal/20 text-nexacore-teal hover:bg-nexacore-teal/30" 
                : "text-white/70 hover:bg-white/10"
            }`}
            onClick={() => setActiveSection("overview")}
          >
            <Home className="mr-2" size={18} />
            Overview
          </Button>
          
          <Button
            variant={activeSection === "education" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeSection === "education" 
                ? "bg-nexacore-teal/20 text-nexacore-teal hover:bg-nexacore-teal/30" 
                : "text-white/70 hover:bg-white/10"
            }`}
            onClick={() => setActiveSection("education")}
          >
            <BookOpen className="mr-2" size={18} />
            Education
          </Button>
          
          <Button
            variant={activeSection === "health" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeSection === "health" 
                ? "bg-nexacore-teal/20 text-nexacore-teal hover:bg-nexacore-teal/30" 
                : "text-white/70 hover:bg-white/10"
            }`}
            onClick={() => setActiveSection("health")}
          >
            <Heart className="mr-2" size={18} />
            Health
          </Button>
          
          <Button
            variant={activeSection === "finance" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeSection === "finance" 
                ? "bg-nexacore-teal/20 text-nexacore-teal hover:bg-nexacore-teal/30" 
                : "text-white/70 hover:bg-white/10"
            }`}
            onClick={() => setActiveSection("finance")}
          >
            <DollarSign className="mr-2" size={18} />
            Finance
          </Button>
          
          <Button
            variant={activeSection === "reports" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeSection === "reports" 
                ? "bg-nexacore-teal/20 text-nexacore-teal hover:bg-nexacore-teal/30" 
                : "text-white/70 hover:bg-white/10"
            }`}
            onClick={() => setActiveSection("reports")}
          >
            <FileText className="mr-2" size={18} />
            Reports
          </Button>
          
          <div className="h-px bg-white/10 my-4"></div>
          
          <Button
            variant={activeSection === "profile" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeSection === "profile" 
                ? "bg-nexacore-teal/20 text-nexacore-teal hover:bg-nexacore-teal/30" 
                : "text-white/70 hover:bg-white/10"
            }`}
            onClick={() => setActiveSection("profile")}
          >
            <User className="mr-2" size={18} />
            Profile
          </Button>
          
          <Button
            variant={activeSection === "settings" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeSection === "settings" 
                ? "bg-nexacore-teal/20 text-nexacore-teal hover:bg-nexacore-teal/30" 
                : "text-white/70 hover:bg-white/10"
            }`}
            onClick={() => setActiveSection("settings")}
          >
            <Settings className="mr-2" size={18} />
            Settings
          </Button>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-nexacore-teal/20 flex items-center justify-center mr-3">
              <span className="text-nexacore-teal font-semibold">{user?.name?.charAt(0)}</span>
            </div>
            <div>
              <p className="font-medium text-white">{user?.name}</p>
              <p className="text-xs text-white/50">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full border-white/20 text-white/70 hover:bg-white/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2" size={16} />
            Sign Out
          </Button>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-nexacore-blue-dark border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-gradient">NexaCore</h1>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <ChevronDown size={20} />
          </Button>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="p-4 bg-nexacore-blue border-b border-white/10">
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeSection === "overview" ? "text-nexacore-teal" : "text-white/70"}`}
                onClick={() => {
                  setActiveSection("overview");
                  setIsMobileMenuOpen(false);
                }}
              >
                <Home className="mr-2" size={18} />
                Overview
              </Button>
              
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeSection === "education" ? "text-nexacore-teal" : "text-white/70"}`}
                onClick={() => {
                  setActiveSection("education");
                  setIsMobileMenuOpen(false);
                }}
              >
                <BookOpen className="mr-2" size={18} />
                Education
              </Button>
              
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeSection === "health" ? "text-nexacore-teal" : "text-white/70"}`}
                onClick={() => {
                  setActiveSection("health");
                  setIsMobileMenuOpen(false);
                }}
              >
                <Heart className="mr-2" size={18} />
                Health
              </Button>
              
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeSection === "finance" ? "text-nexacore-teal" : "text-white/70"}`}
                onClick={() => {
                  setActiveSection("finance");
                  setIsMobileMenuOpen(false);
                }}
              >
                <DollarSign className="mr-2" size={18} />
                Finance
              </Button>
              
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeSection === "reports" ? "text-nexacore-teal" : "text-white/70"}`}
                onClick={() => {
                  setActiveSection("reports");
                  setIsMobileMenuOpen(false);
                }}
              >
                <FileText className="mr-2" size={18} />
                Reports
              </Button>
              
              <div className="h-px bg-white/10 my-2"></div>
              
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeSection === "profile" ? "text-nexacore-teal" : "text-white/70"}`}
                onClick={() => {
                  setActiveSection("profile");
                  setIsMobileMenuOpen(false);
                }}
              >
                <User className="mr-2" size={18} />
                Profile
              </Button>
              
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeSection === "settings" ? "text-nexacore-teal" : "text-white/70"}`}
                onClick={() => {
                  setActiveSection("settings");
                  setIsMobileMenuOpen(false);
                }}
              >
                <Settings className="mr-2" size={18} />
                Settings
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-white/20 text-white/70"
                onClick={handleLogout}
              >
                <LogOut className="mr-2" size={16} />
                Sign Out
              </Button>
            </nav>
          </div>
        )}
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 md:ml-0 mt-16 md:mt-0 overflow-y-auto">
        <div className="p-6 md:p-8">
          {/* Content Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white">
              {activeSection === "overview" && "Dashboard Overview"}
              {activeSection === "education" && "Education"}
              {activeSection === "health" && "Health"}
              {activeSection === "finance" && "Finance"}
              {activeSection === "reports" && "Reports"}
              {activeSection === "profile" && "Profile"}
              {activeSection === "settings" && "Settings"}
            </h1>
            <p className="text-white/70 mt-1">
              {activeSection === "overview" && "Your personalized insights at a glance"}
              {activeSection === "education" && "Your educational journey and recommendations"}
              {activeSection === "health" && "Monitor and improve your health metrics"}
              {activeSection === "finance" && "Manage your finances and investments"}
              {activeSection === "reports" && "Generate and view your comprehensive reports"}
              {activeSection === "profile" && "Manage your personal information"}
              {activeSection === "settings" && "Customize your app preferences"}
            </p>
          </div>

          {/* Placeholder Content */}
          <div className="glass-card p-6 mb-6">
            <h2 className="text-xl font-medium text-white mb-4">
              {activeSection === "overview" && "Your Dashboard"}
              {activeSection === "education" && "Educational Insights"}
              {activeSection === "health" && "Health Analytics"}
              {activeSection === "finance" && "Financial Summary"}
              {activeSection === "reports" && "Available Reports"}
              {activeSection === "profile" && "Personal Information"}
              {activeSection === "settings" && "Application Settings"}
            </h2>
            <p className="text-white/70 mb-4">
              This content would be populated with real data and functionalities based on the selected section.
              For now, this is a placeholder to showcase the dashboard layout.
            </p>
            
            <div className="flex items-center">
              <Button className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal-light">
                Explore {activeSection}
                <ChevronRight className="ml-2" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
