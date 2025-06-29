
import { Card, CardContent } from "@/components/ui/card";
import { Map, Mic, Book, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Map,
      title: "Smart Destination Guide",
      description: "Get personalized recommendations for places to visit, hidden gems, and local experiences tailored to your interests.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Mic,
      title: "Voice-Powered Assistant",
      description: "Simply speak your questions and get instant, intelligent responses about any destination worldwide.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Book,
      title: "Cultural Intelligence",
      description: "Learn essential phrases, cultural etiquette, and local customs to connect authentically with communities.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: Users,
      title: "Study Abroad Support",
      description: "Discover affordable universities, scholarship opportunities, and student life insights for your academic journey.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Intelligent Features
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Powered by advanced AI to make your global exploration seamless and insightful
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-105 group"
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Feature Highlights */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🍜</span>
            </div>
            <h4 className="text-lg font-semibold mb-2 text-white">Local Cuisine Guide</h4>
            <p className="text-gray-400">Discover must-try dishes, dietary considerations, and authentic local restaurants.</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">💰</span>
            </div>
            <h4 className="text-lg font-semibold mb-2 text-white">Budget Planning</h4>
            <p className="text-gray-400">Get realistic cost estimates and money-saving tips for any destination.</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🌍</span>
            </div>
            <h4 className="text-lg font-semibold mb-2 text-white">Real-time Updates</h4>
            <p className="text-gray-400">Stay informed about local events, weather, and travel conditions.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
