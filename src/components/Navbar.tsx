
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

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
          ? "bg-nexacore-blue-dark/80 backdrop-blur-md py-2 shadow-md"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-gradient">NexaCore</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-white hover:text-nexacore-teal transition">
            Home
          </Link>
          <Link to="#features" className="text-white hover:text-nexacore-teal transition">
            Features
          </Link>
          <Link to="#flow" className="text-white hover:text-nexacore-teal transition">
            User Flow
          </Link>
          <div className="flex gap-3">
            {isAuthenticated ? (
              <>
                <Button 
                  onClick={() => navigate("/dashboard")} 
                  className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal-light"
                >
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="border-nexacore-teal text-white hover:bg-nexacore-teal/20"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-nexacore-teal text-white hover:bg-nexacore-teal/20">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal-light">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-nexacore-blue-dark/95 backdrop-blur-md absolute top-full left-0 right-0 py-4">
          <div className="container mx-auto px-4 flex flex-col gap-4">
            <Link
              to="/"
              className="text-white hover:text-nexacore-teal transition py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="#features"
              className="text-white hover:text-nexacore-teal transition py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="#flow"
              className="text-white hover:text-nexacore-teal transition py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              User Flow
            </Link>
            <div className="flex flex-col gap-3 py-2">
              {isAuthenticated ? (
                <>
                  <Button 
                    onClick={() => {
                      navigate("/dashboard");
                      setIsMobileMenuOpen(false);
                    }} 
                    className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal-light"
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-nexacore-teal text-white hover:bg-nexacore-teal/20"
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
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-nexacore-teal text-white hover:bg-nexacore-teal/20">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal-light">
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
