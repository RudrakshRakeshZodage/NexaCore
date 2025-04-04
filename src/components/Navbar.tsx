
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-nexacore-blue-dark/80 dark:bg-background/80 backdrop-blur-md py-2 shadow-md"
          : "bg-transparent dark:bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-gradient">NexaCore</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-white dark:text-foreground hover:text-nexacore-teal dark:hover:text-primary transition">
            Home
          </Link>
          
          <ThemeToggle />
          
          <div className="flex gap-3">
            {isAuthenticated ? (
              <>
                <Button 
                  onClick={() => navigate("/dashboard")} 
                  className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                >
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="border-nexacore-teal dark:border-primary text-white dark:text-foreground hover:bg-nexacore-teal/20 dark:hover:bg-primary/20"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login-selection">
                  <Button variant="outline" className="border-nexacore-teal dark:border-primary text-white dark:text-foreground hover:bg-nexacore-teal/20 dark:hover:bg-primary/20">
                    Login
                  </Button>
                </Link>
                <Link to="/login-selection">
                  <Button className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="text-white dark:text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-nexacore-blue-dark/95 dark:bg-background/95 backdrop-blur-md absolute top-full left-0 right-0 py-4">
          <div className="container mx-auto px-4 flex flex-col gap-4">
            <Link
              to="/"
              className="text-white dark:text-foreground hover:text-nexacore-teal dark:hover:text-primary transition py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <div className="flex flex-col gap-3 py-2">
              {isAuthenticated ? (
                <>
                  <Button 
                    onClick={() => {
                      navigate("/dashboard");
                      setIsMobileMenuOpen(false);
                    }} 
                    className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-nexacore-teal dark:border-primary text-white dark:text-foreground hover:bg-nexacore-teal/20 dark:hover:bg-primary/20"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login-selection" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-nexacore-teal dark:border-primary text-white dark:text-foreground hover:bg-nexacore-teal/20 dark:hover:bg-primary/20">
                      Login
                    </Button>
                  </Link>
                  <Link to="/login-selection" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
