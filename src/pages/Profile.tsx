import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, signOut } from "@/lib/supabase";
import { Map } from "lucide-react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const neonBlue = "#3BD4E7";

const Navbar = ({ user, onAvatarClick }) => (
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
      <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Chat</a>
      <a href="/profile" className="text-cyan-300 font-semibold transition-colors">Profile</a>
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt="avatar"
          className="w-9 h-9 rounded-full border-2 border-cyan-400 cursor-pointer object-cover"
          onClick={onAvatarClick}
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-cyan-900 flex items-center justify-center text-cyan-300 font-bold cursor-pointer" onClick={onAvatarClick}>
          {user?.full_name?.[0] || user?.email?.[0] || "U"}
        </div>
      )}
    </div>
  </nav>
);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]); // Placeholder for prompt history
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }
      // Get profile from 'profiles' table for avatar/full_name
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
      // TODO: Fetch prompt history from your backend or Supabase table
      setHistory([]); // Placeholder: [] means no activity
      setLoading(false);
    }
    fetchUser();
  }, [navigate]);

  async function handleLogout() {
    await signOut();
    navigate("/");
  }

  // Group history by date (placeholder logic)
  const groupedHistory = {};
  // Example: { 'Today': [{prompt, reply}, ...], 'Yesterday': [...] }
  // Fill groupedHistory if you have real data

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col">
      <Navbar user={user} />
      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-10 pb-20">
        <div className="w-full max-w-lg mx-auto">
          {/* User Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center mb-10 border border-cyan-900 relative">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="avatar" className="w-24 h-24 rounded-full border-4 border-cyan-400 object-cover mb-4" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-cyan-900 flex items-center justify-center text-4xl text-cyan-300 font-bold mb-4">
                {user?.full_name?.[0] || user?.email?.[0] || "U"}
              </div>
            )}
            <div className="text-2xl font-bold text-cyan-200 mb-1">{user?.full_name || user?.email}</div>
            <div className="text-gray-400 text-md mb-2">{user?.email}</div>
            <Button
              className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 text-sm font-semibold shadow"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>

          {/* Prompt History */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-cyan-300 mb-4">Prompt History</h2>
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : history.length === 0 ? (
              <div className="text-gray-500 italic text-center py-8">No activity yet!</div>
            ) : (
              Object.entries(groupedHistory).map(([date, prompts]) => (
                <div key={date} className="mb-6">
                  <div className="text-cyan-400 font-bold mb-2">{date}</div>
                  <div className="space-y-4">
                    {prompts.map((item, idx) => (
                      <div key={idx} className="bg-gray-800/80 rounded-xl p-4 border border-gray-700">
                        <div className="text-cyan-200 font-semibold mb-1">You: {item.prompt}</div>
                        <div className="text-purple-200">AI: {item.reply}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile; 