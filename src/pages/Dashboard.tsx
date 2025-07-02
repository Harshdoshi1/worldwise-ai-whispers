import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "@/components/Chat";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Footer from "@/components/Footer";

const neonBlue = "#3BD4E7";

const Navbar = ({ onChatClick, onProfileClick, user }) => (
  <nav className="relative z-50 flex items-center justify-between p-6 bg-black/50 backdrop-blur-md border-b border-purple-900/20">
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <Map className="w-4 h-4 text-white" />
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        WorldWise AI
      </span>
    </div>
    <div className="flex items-center space-x-6">
      <button
        type="button"
        onClick={onChatClick}
        className="text-gray-300 hover:text-white transition-colors bg-transparent border-none outline-none cursor-pointer"
        style={{ background: "none" }}
      >
        Chat
      </button>
      <button
        type="button"
        onClick={onProfileClick}
        className="flex items-center text-cyan-300 font-semibold transition-colors bg-transparent border-none outline-none cursor-pointer"
        style={{ background: "none" }}
      >
        Profile
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt="avatar"
            className="w-7 h-7 rounded-full border-2 border-cyan-400 ml-2 object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-cyan-900 flex items-center justify-center text-cyan-300 font-bold ml-2">
            {user?.full_name?.[0] || user?.email?.[0] || "U"}
          </div>
        )}
      </button>
    </div>
  </nav>
);

const Dashboard = () => {
  const [showChat, setShowChat] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, email")
        .eq("id", user.id)
        .single();
      setUser({
        full_name: profile?.full_name || user.user_metadata?.full_name || user.email,
        avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || null,
        email: profile?.email || user.email,
      });
    }
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col">
      <Navbar
        onChatClick={() => setShowChat(true)}
        onProfileClick={() => navigate("/profile")}
        user={user}
      />
      <main className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4">
        {!showChat ? (
          <div className="max-w-2xl w-full text-center mt-20 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome to WorldWise AI
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-4">
              WorldWise AI is an intelligent travel and study assistant that
              helps users explore any place on Earth using voice or text.
            </p>
            <p className="text-md text-cyan-300 mb-8">
              Ask things like:{" "}
              <span className="italic">
                "What are the must-try foods in Italy?"
              </span>{" "}
              or{" "}
              <span className="italic">
                "Suggest budget colleges for computer science in Germany."
              </span>
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-lg animate-pulse"
              onClick={() => setShowChat(true)}
              style={{ boxShadow: `0 0 16px 2px ${neonBlue}` }}
            >
              Try Now
            </Button>
          </div>
        ) : (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              <Chat fullscreen unlimited onClose={() => setShowChat(false)} />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
