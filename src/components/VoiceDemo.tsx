import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Headphones } from "lucide-react";
import { useState } from "react";

const VoiceDemo = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentDemo, setCurrentDemo] = useState(0);

  const demoConversations = [
    {
      question: "What should I eat in Bangkok?",
      response:
        "Bangkok is a street food paradise! Try Pad Thai from street vendors, Tom Yum soup for authentic flavors, and don't miss Mango Sticky Rice for dessert. Visit Chatuchak Market for the best variety!",
    },
    {
      question: "Tell me about studying in Germany",
      response:
        "Germany offers excellent free education at public universities! Popular cities include Berlin, Munich, and Hamburg. You'll need around €800-1000/month for living expenses. Many programs are taught in English.",
    },
    {
      question: "How do I greet people in Japan?",
      response:
        "In Japan, bow slightly and say 'Konnichiwa' (koh-nee-chee-wah) during the day. For formal situations, use 'Arigatou gozaimasu' (ah-ree-gah-toh goh-zah-ee-mahs) meaning 'thank you very much'.",
    },
  ];

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate advancing through demo conversations
      setTimeout(() => {
        setIsRecording(false);
        setCurrentDemo((prev) => (prev + 1) % demoConversations.length);
      }, 3000);
    }
  };

  return (
    <section id="demo" className="py-20 px-6 bg-gray-950/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Try Voice Demo
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Experience the power of voice-powered travel assistance
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Voice Interface */}
          <div className="text-center">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-800">
              <div className="mb-8">
                <Button
                  onClick={toggleRecording}
                  size="lg"
                  className={`w-24 h-24 rounded-full transition-all duration-300 ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : "bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-110"
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </Button>
              </div>

              <p className="text-gray-300 mb-4">
                {isRecording ? "Listening..." : "Tap to speak"}
              </p>

              <div className="flex justify-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full transition-all duration-300 ${
                      isRecording ? "animate-pulse" : "opacity-30"
                    }`}
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      height: isRecording
                        ? `${20 + Math.random() * 20}px`
                        : "8px",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Demo Conversation */}
          <div className="space-y-4">
            <Card className="bg-blue-900/20 border-blue-800/50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">You</span>
                  </div>
                  <p className="text-blue-200">
                    {demoConversations[currentDemo].question}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-900/20 border-purple-800/50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">AI</span>
                  </div>
                  <div>
                    <p className="text-purple-200 mb-2">
                      {demoConversations[currentDemo].response}
                    </p>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <Headphones className="w-4 h-4" />
                      <span>Voice response available</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentDemo(
                    (prev) => (prev + 1) % demoConversations.length
                  )
                }
                className="border-gray-600 text-black hover:text-black hover:border-gray-500 bg-white"
              >
                Try Another Example
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceDemo;
