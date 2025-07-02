import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Maximize2, Minimize2, X } from "lucide-react";

const neonBlue = "#3BD4E7";

const Chat = ({
  fullscreen: fullscreenProp = false,
  unlimited = false,
  onClose,
}) => {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Hi! I am WorldWise AI. Ask me about any place, food, phrase, or study abroad!",
    },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(fullscreenProp || unlimited);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [loginPrompt, setLoginPrompt] = useState(false);
  const maxFreeMessages = unlimited ? Infinity : 3;
  const CHAT_LIMIT_KEY = "wwai_user_message_count";
  // Store images for each AI message by index
  const [aiImages, setAiImages] = useState({});

  // Helper to get user message count from messages
  const getUserMessagesCount = (msgs) =>
    msgs.filter((m) => m.role === "user").length;
  const userMessagesCount = getUserMessagesCount(messages);

  // On mount, initialize user message count from localStorage
  React.useEffect(() => {
    const storedCount = parseInt(
      localStorage.getItem(CHAT_LIMIT_KEY) || "0",
      10
    );
    if (!isNaN(storedCount) && storedCount > 0) {
      const currentCount = getUserMessagesCount(messages);
      if (storedCount > currentCount) {
        setMessages((prev) => [
          ...prev,
          ...Array(storedCount - currentCount).fill({
            role: "user",
            content: "",
          }),
        ]);
      }
    }
    // eslint-disable-next-line
  }, []);

  // Update localStorage when a new user message is sent
  React.useEffect(() => {
    const count = getUserMessagesCount(messages);
    localStorage.setItem(CHAT_LIMIT_KEY, count.toString());
  }, [messages]);

  // TTS: Speak latest AI message when it arrives and not listening/muted
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (listening || muted) {
      window.speechSynthesis.cancel();
      return;
    }
    if (!messages.length) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== "ai" || !lastMsg.content) return;
    // Cancel any previous speech
    window.speechSynthesis.cancel();
    // Find a clear English voice
    const synth = window.speechSynthesis;
    let voices = synth.getVoices();
    // Some browsers load voices async
    if (!voices.length) {
      // Try to load voices and retry
      synth.onvoiceschanged = () => {
        voices = synth.getVoices();
        speakWithVoice();
      };
      return;
    }
    speakWithVoice();
    function speakWithVoice() {
      const utter = new window.SpeechSynthesisUtterance(lastMsg.content);
      // Prefer a clear English voice
      const enVoices = voices.filter(
        (v) => v.lang.startsWith("en") && v.localService
      );
      utter.voice =
        enVoices[0] || voices.find((v) => v.lang.startsWith("en")) || voices[0];
      utter.rate = 1;
      utter.pitch = 1;
      synth.speak(utter);
    }
  }, [messages, listening, muted]);

  // Fetch images after new AI message
  React.useEffect(() => {
    if (!messages.length) return;
    const lastIdx = messages.length - 1;
    const lastMsg = messages[lastIdx];
    // Only fetch if last message is AI, not already fetched, and not error message
    if (
      lastMsg.role === "ai" &&
      !aiImages[lastIdx] &&
      lastMsg.content &&
      lastMsg.content !== "Sorry, something went wrong."
    ) {
      // Find the most recent user message for context
      let userMsg = "";
      for (let i = lastIdx - 1; i >= 0; i--) {
        if (messages[i].role === "user") {
          userMsg = messages[i].content;
          break;
        }
      }
      if (!userMsg) return;
      fetch(`http://localhost:3001/images?q=${encodeURIComponent(userMsg)}`)
        .then((res) => res.json())
        .then((data) => {
          setAiImages((prev) => ({ ...prev, [lastIdx]: data.images || [] }));
        })
        .catch(() => {
          setAiImages((prev) => ({ ...prev, [lastIdx]: [] }));
        });
    }
  }, [messages]);

  function handleLoginClick() {
    if (typeof window !== "undefined") {
      const loginEvent = new CustomEvent("show-login-modal");
      window.dispatchEvent(loginEvent);
    }
    setLoginPrompt(false);
  }

  async function handleAsk(input) {
    if (!input.trim()) return;
    const currentCount = getUserMessagesCount(messages);
    if (currentCount >= maxFreeMessages) {
      setLoginPrompt(true);
      return;
    }
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setUserMessage("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => {
        const newMessages = [...prev, { role: "ai", content: data.reply }];
        // Store images for this AI message if any
        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
          setAiImages((prevImages) => ({ ...prevImages, [newMessages.length - 1]: data.images }));
        }
        return newMessages;
      });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleAsk(userMessage);
  }

  function startListening() {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window))
      return;
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    setListening(true);
    setUserMessage("");
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserMessage(transcript);
      setListening(false);
      handleAsk(transcript);
    };
    recognition.onerror = () => {
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
    };
    recognition.start();
  }

  const micSupported =
    typeof window !== "undefined" &&
    ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

  // Scroll to bottom on new message
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  // Scroll on new message
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    scrollToBottom();
  }, [messages, fullscreen]);

  return (
    <section
      className={`py-10 px-4 w-full flex justify-center items-end ${
        fullscreen
          ? "fixed inset-0 z-50 bg-black/90 flex items-center justify-center transition-all duration-500"
          : "max-w-xl mx-auto"
      }`}
      style={{ minHeight: fullscreen ? "100vh" : undefined }}
    >
      <Card
        className={`relative w-full ${
          fullscreen ? "h-[90vh] max-w-4xl" : ""
        } bg-gray-900/80 border border-gray-800 shadow-2xl transition-all duration-500`}
        style={{
          boxShadow: fullscreen
            ? `0 0 0 4px ${neonBlue}, 0 8px 32px #000`
            : undefined,
        }}
      >
        {/* Close X button for fullscreen/unlimited mode */}
        {(fullscreen || unlimited) && onClose && (
          <button
            className="absolute top-3 right-3 z-40 p-2 rounded-full bg-black/70 hover:bg-black/90 border border-gray-800 text-cyan-300 transition-colors"
            style={{ color: neonBlue }}
            onClick={onClose}
            aria-label="Close chat"
          >
            <X className="w-6 h-6" />
          </button>
        )}
        {/* Fullscreen toggle button (hide for unlimited/logged-in users) */}
        {!unlimited && (
          <button
            className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 hover:bg-black/80 border border-gray-800 text-cyan-300 transition-colors"
            style={{ color: neonBlue }}
            onClick={() => setFullscreen((f) => !f)}
            aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {fullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
        )}
        <CardContent className="flex flex-col h-full p-4">
            {/* Mute Button for TTS */}
            {typeof window !== "undefined" && window.speechSynthesis && (
              <button
                className={`absolute top-3 left-3 z-40 p-2 rounded-full bg-black/70 hover:bg-black/90 border border-gray-800 text-cyan-300 transition-colors ${muted ? 'opacity-70' : ''}`}
                style={{ color: neonBlue }}
                onClick={() => {
                  setMuted((m) => {
                    if (!m) window.speechSynthesis.cancel();
                    return !m;
                  });
                }}
                aria-label={muted ? "Unmute AI Voice" : "Mute AI Voice"}
                title={muted ? "Unmute AI Voice" : "Mute AI Voice"}
              >
                {muted ? (
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-volume-x"><polygon points="1 1 23 23"/><path d="M9 9v6h4l5 5V4l-5 5H9z"/><line x1="23" y1="1" x2="1" y2="23"/></svg>
                ) : (
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-volume-2"><polygon points="1 1 23 23"/><path d="M9 9v6h4l5 5V4l-5 5H9z"/><path d="M19 5a7 7 0 0 1 0 14"/><path d="M15 9a3 3 0 0 1 0 6"/></svg>
                )}
              </button>
            )}
          {/* Chat messages with scrollable area */}
          <div
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-gray-800 pr-2"
            style={{
              maxHeight: fullscreen ? "65vh" : "340px",
              minHeight: "180px",
              paddingRight: "0.5rem",
              scrollbarColor: `${neonBlue} #222`,
            }}
          >
            {listening && (
              <div className="flex items-end space-x-1 mb-2">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 rounded bg-gradient-to-t from-blue-400 to-cyan-400 animate-pulse"
                    style={{
                      height: `${18 + Math.random() * 18}px`,
                      animationDelay: `${i * 0.12}s`,
                      background: `linear-gradient(to top, #3BD4E7, #a78bfa)`,
                    }}
                  />
                ))}
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <Card className={`max-w-[80%] ${msg.role === "user" ? "bg-cyan-900/80 border-cyan-700 ml-auto" : "bg-purple-900/20 border-purple-800/50"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-cyan-700" : "bg-gradient-to-br from-purple-500 to-blue-500"}`}>
                        <span className="text-white text-xs">{msg.role === "user" ? "You" : "AI"}</span>
                      </div>
                      <div>
                        <p className={`mb-2 ${msg.role === "user" ? "text-cyan-200" : "text-purple-200"}`}>{msg.content}</p>
                        {/* Show images if present for this AI message */}
                        {msg.role === "ai" && aiImages[idx] && aiImages[idx].length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {aiImages[idx].slice(0, 3).map((img, imgIdx) => (
                              <img
                                key={imgIdx}
                                src={img}
                                alt="Related visual"
                                className="w-32 h-24 object-cover rounded-lg border border-purple-700 shadow"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Listening animation, bottom-center above input */}
          <div className="relative w-full">
            <div
              className={`pointer-events-none flex flex-col items-center justify-center absolute left-1/2 -translate-x-1/2 bottom-16 z-30 transition-opacity duration-300 ${
                listening ? "opacity-100" : "opacity-0"
              }`}
              style={{ minWidth: 200 }}
            >
              {listening && (
                <>
                  <div className="flex items-end space-x-1 mb-2">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 rounded bg-gradient-to-t from-blue-400 to-cyan-400 animate-pulse"
                        style={{
                          height: `${18 + Math.random() * 18}px`,
                          animationDelay: `${i * 0.12}s`,
                          background: `linear-gradient(to top, #3BD4E7, #a78bfa)`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-300 font-semibold text-lg animate-pulse">
                      Listening...
                    </span>
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: neonBlue }}
                    >
                      <span
                        className="block w-full h-full rounded-full animate-ping"
                        style={{ background: neonBlue, opacity: 0.5 }}
                      ></span>
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Input and controls */}
          <form
            onSubmit={handleSubmit}
            className="flex mt-4 space-x-2 items-center relative z-10"
          >
            <input
              type="text"
              className="flex-1 rounded-lg px-4 py-2 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder={
                loginPrompt || userMessagesCount >= maxFreeMessages
                  ? "Login to ask unlimited questions..."
                  : listening
                  ? "Listening..."
                  : "Type your message or question..."
              }
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              disabled={
                loading ||
                listening ||
                loginPrompt ||
                userMessagesCount >= maxFreeMessages
              }
              style={{ caretColor: neonBlue }}
            />
            <div className="relative flex items-center">
              <div
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer relative"
                onClick={!listening ? startListening : undefined}
                style={{ position: "relative" }}
              >
                {!listening && (
                  <Mic
                    className="w-8 h-8 text-white z-10"
                    style={{ display: listening ? "none" : "block" }}
                  />
                )}
                {listening && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    {/* animation code */}
                  </div>
                )}
              </div>
            </div>
            <Button
              type="submit"
              disabled={
                loading ||
                !userMessage.trim() ||
                listening ||
                loginPrompt ||
                userMessagesCount >= maxFreeMessages
              }
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold"
            >
              Send
            </Button>
          </form>
          {/* Login prompt overlay */}
          {loginPrompt || userMessagesCount >= maxFreeMessages ? (
            <div className="absolute left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-black/80 py-8 rounded-b-xl z-40 animate-fade-in">
              <p className="text-cyan-300 font-semibold mb-3 text-center">
                Login to ask unlimited questions.
              </p>
              <Button
                className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-6"
                onClick={handleLoginClick}
              >
                Login
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
};



export default Chat;
