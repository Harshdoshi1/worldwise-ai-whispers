import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signInWithGoogle, supabase } from "@/lib/supabase";
import { useState } from "react";

const LoginModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
      // The user will be redirected, so the rest is for SSR or popup mode
    } catch (err) {
      alert("Google login failed");
    } finally {
      setLoading(false);
    }
  }

  // Listen for auth state changes and upsert profile
  // (This is a simple example, you may want to move this to a global context)
  // Only runs client-side
  if (typeof window !== "undefined") {
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user = session.user;
        await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email,
          avatar_url: user.user_metadata?.avatar_url || null,
        });
        if (onClose) onClose();
        window.location.assign("/dashboard");
      }
    });
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-sm p-6 bg-gray-900 border border-purple-800">
        <CardContent className="flex flex-col items-center space-y-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Sign in to WorldWise AI
          </h2>
          <p className="text-gray-300 text-center mb-4">
            Continue with your Google account to get started.
          </p>
          <Button
            className="w-full bg-white text-black font-semibold hover:bg-gray-100"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-2 inline-block align-text-bottom"
                  viewBox="0 0 48 48"
                >
                  <g>
                    <path
                      fill="#4285F4"
                      d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.36 30.74 0 24 0 14.82 0 6.71 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"
                    />
                    <path
                      fill="#34A853"
                      d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.67 28.09a14.5 14.5 0 0 1 0-8.18l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.69 10.29l7.98-6.2z"
                    />
                    <path
                      fill="#EA4335"
                      d="M24 48c6.48 0 11.93-2.15 15.9-5.85l-7.19-5.6c-2.01 1.35-4.6 2.15-8.71 2.15-6.38 0-11.87-3.63-14.33-8.94l-7.98 6.2C6.71 42.52 14.82 48 24 48z"
                    />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </g>
                </svg>
                Login with Google
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-gray-400 mt-2"
            onClick={onClose}
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginModal;
