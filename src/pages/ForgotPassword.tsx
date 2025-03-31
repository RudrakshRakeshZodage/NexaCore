
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  return (
    <div className="min-h-screen bg-nexacore-blue-dark flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute top-1/4 right-10 w-64 h-64 rounded-full bg-nexacore-pink/10 blur-3xl"></div>
      <div className="absolute bottom-1/3 left-10 w-80 h-80 rounded-full bg-nexacore-teal/10 blur-3xl"></div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold text-gradient mb-2">NexaCore</h1>
          </Link>
          <p className="text-white/70">Password recovery</p>
        </div>
        
        <div className="glass-card p-8">
          {!isSubmitted ? (
            <>
              <h2 className="text-xl font-semibold mb-2 text-white">Forgot Password</h2>
              <p className="text-white/70 text-sm mb-6">
                Enter the email address associated with your account, and we'll email you a link to reset your password.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 bg-white/10 border-white/20 text-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal-light"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Reset Password"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="h-12 w-12 bg-nexacore-teal/20 text-nexacore-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-white">Check Your Email</h2>
              <p className="text-white/70 mb-6">
                We've sent a password reset link to <span className="text-white font-medium">{email}</span>
              </p>
              <p className="text-sm text-white/50 mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Link to="/login" className="text-nexacore-teal hover:underline inline-flex items-center">
              <ArrowLeft className="mr-2" size={16} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
