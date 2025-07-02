import { Button } from "@/components/ui/button";
import { Mic, Search, MicOff, Send } from "lucide-react";
import { useState, useRef } from "react";
import React from "react";

const Hero = () => {
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  function startListening() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    setListening(true);
    setTranscript("");
    recognition.onresult = (event: any) => {
      const t = event.results[0][0].transcript;
      setTranscript(t);
      setListening(false);
    };
    recognition.onerror = () => {
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
    };
    recognition.start();
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      setListening(false);
    }
  }

  function sendToAI() {
    window.dispatchEvent(
      new CustomEvent("send-to-chat", { detail: transcript })
    );
    const chatSection = document.getElementById("chat");
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: "smooth" });
    }
    setTranscript("");
  }

  React.useEffect(() => {
    function handleSendToChat(e: any) {
      const chatInput = document.querySelector(
        '#chat input[type="text"]'
      ) as HTMLInputElement;
      if (chatInput) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )!.set;
        nativeInputValueSetter!.call(chatInput, e.detail);
        chatInput.dispatchEvent(new Event("input", { bubbles: true }));
        setTimeout(() => {
          const sendBtn = document.querySelector(
            '#chat button[type="submit"]'
          ) as HTMLButtonElement;
          if (sendBtn) sendBtn.click();
        }, 100);
      }
    }
    window.addEventListener("send-to-chat", handleSendToChat);
    return () => window.removeEventListener("send-to-chat", handleSendToChat);
  }, []);

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
            Your intelligent travel companion that speaks your language. Get
            personalized recommendations, cultural insights, and study abroad
            guidance through voice or text.
          </p>
        </div>

        {/* Interactive Demo - Updated */}
        <div className="mb-12">
          <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 max-w-2xl mx-auto border border-gray-800">
            <div className="text-center">
              <div className="mb-8 flex flex-col items-center">
                <Button
                  onClick={listening ? stopListening : startListening}
                  size="lg"
                  className={`w-20 h-20 rounded-full transition-all duration-300 mb-2 ${
                    listening
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : "bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-110"
                  }`}
                >
                  {listening ? (
                    <MicOff className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </Button>
                <p className="text-gray-300 mb-2">
                  {listening ? "Listening..." : "Tap to speak"}
                </p>
                {transcript && (
                  <div className="bg-black/50 p-3 rounded-lg mb-2">
                    <p className="text-green-400 text-sm">You said:</p>
                    <p className="text-white text-sm">{transcript}</p>
                  </div>
                )}
                <div className="flex justify-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full transition-all duration-300 ${
                        listening ? "animate-pulse" : "opacity-30"
                      }`}
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height: listening
                          ? `${20 + Math.random() * 20}px`
                          : "8px",
                      }}
                    />
                  ))}
                </div>
                {transcript && !listening && (
                  <Button
                    size="icon"
                    className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full w-12 h-12 flex items-center justify-center"
                    onClick={sendToAI}
                    aria-label="Send to AI"
                  >
                    <Send className="w-6 h-6" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons - Updated */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
            onClick={() => {
              const featuresSection = document.getElementById("features");
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Start Exploring
          </Button>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            onClick={() => {
              const chatSection = document.getElementById("chat");
              if (chatSection) {
                chatSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Ask AI
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
