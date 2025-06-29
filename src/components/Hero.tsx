
import { Button } from "@/components/ui/button";
import { Mic, Search, MicOff } from "lucide-react";
import { useState } from "react";
import LoginDialog from "./LoginDialog";
import useVoiceRecognition from "@/hooks/useVoiceRecognition";

const Hero = () => {
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [textInput, setTextInput] = useState('');
  const { isListening, transcript, startListening, stopListening, isSupported } = useVoiceRecognition();

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      if (isSupported) {
        startListening();
      } else {
        alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      }
    }
  };

  const handleTextSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && textInput.trim()) {
      alert(`You asked: "${textInput}"\nAI response would appear here!`);
      setTextInput('');
    }
  };

  const handleWatchDemo = () => {
    // Scroll to demo section
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-purple-900/5"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-fade-in">
              Explore the World
            </span>
            <br />
            <span className="text-white">with AI Guidance</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your intelligent travel companion that speaks your language. Get personalized recommendations, 
            cultural insights, and study abroad guidance through voice or text.
          </p>
        </div>

        {/* Interactive Demo - Updated */}
        <div className="mb-12">
          <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 max-w-2xl mx-auto border border-gray-800">
            <div className="flex items-center justify-center mb-6">
              <Button
                variant={isVoiceMode ? "default" : "outline"}
                onClick={() => setIsVoiceMode(true)}
                className={`mr-4 ${isVoiceMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'border-gray-600'}`}
              >
                <Mic className="w-4 h-4 mr-2" />
                Voice
              </Button>
              <Button
                variant={!isVoiceMode ? "default" : "outline"}
                onClick={() => setIsVoiceMode(false)}
                className={`${!isVoiceMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'border-gray-600'}`}
              >
                <Search className="w-4 h-4 mr-2" />
                Text
              </Button>
            </div>

            {isVoiceMode ? (
              <div className="text-center">
                <div 
                  onClick={handleVoiceToggle}
                  className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-110'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </div>
                <p className="text-gray-300 mb-2">
                  {isListening ? 'Listening... Click to stop' : 'Click microphone to start'}
                </p>
                {transcript && (
                  <div className="bg-black/50 p-3 rounded-lg mb-4">
                    <p className="text-green-400 text-sm">You said:</p>
                    <p className="text-white">{transcript}</p>
                  </div>
                )}
                <p className="text-blue-400 font-medium">"Tell me about Tokyo's food scene"</p>
              </div>
            ) : (
              <div className="text-center">
                <input
                  type="text"
                  placeholder="Ask me about any destination..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={handleTextSubmit}
                  className="w-full p-4 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <p className="text-gray-400 mt-2 text-sm">Press Enter to explore</p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Buttons - Updated */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <LoginDialog>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
              Start Exploring
            </Button>
          </LoginDialog>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={handleWatchDemo}
            className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-8 py-4 text-lg"
          >
            Watch Demo
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-400 mb-2">195+</div>
            <div className="text-gray-400">Countries Covered</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
            <div className="text-gray-400">Languages</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400 mb-2">10K+</div>
            <div className="text-gray-400">Happy Travelers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400 mb-2">1000+</div>
            <div className="text-gray-400">Universities</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
