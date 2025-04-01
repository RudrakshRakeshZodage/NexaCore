
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-nexacore-blue-dark flex flex-col items-center justify-center text-white p-4">
      <div className="glass-card max-w-md mx-auto p-8 text-center">
        <h1 className="text-6xl font-bold mb-4 text-gradient">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-white/70 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal-light">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
