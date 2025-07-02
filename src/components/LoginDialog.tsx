
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface LoginDialogProps {
  children: React.ReactNode;
}

const LoginDialog = ({ children }: LoginDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      alert("Google login functionality would be implemented here!");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to WorldWise AI
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-center text-gray-300">
            Sign in to unlock personalized travel recommendations and voice assistance
          </p>
          
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-100 text-black font-medium py-3"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>🔗</span>
                <span>Continue with Google</span>
              </div>
            )}
          </Button>
          
          <div className="text-center text-sm text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
