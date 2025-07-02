import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, Users, Map } from "lucide-react";

const StudyAbroad = () => {
  const destinations = [
    {
      country: "Germany",
      flag: "🇩🇪",
      universities: "400+",
      avgCost: "€800-1000/month",
      highlights: [
        "Free tuition",
        "Strong engineering programs",
        "English taught courses",
      ],
      popular: true,
    },
    {
      country: "Canada",
      flag: "🇨🇦",
      universities: "200+",
      avgCost: "CAD 1200-1800/month",
      highlights: [
        "Post-study work visa",
        "Multicultural environment",
        "Research opportunities",
      ],
      popular: true,
    },
    {
      country: "Netherlands",
      flag: "🇳🇱",
      universities: "120+",
      avgCost: "€900-1300/month",
      highlights: [
        "High English proficiency",
        "Innovative programs",
        "Central Europe location",
      ],
      popular: false,
    },
    {
      country: "Australia",
      flag: "🇦🇺",
      universities: "150+",
      avgCost: "AUD 1500-2500/month",
      highlights: [
        "Quality education",
        "Beautiful landscapes",
        "Student-friendly cities",
      ],
      popular: false,
    },
  ];

  return (
    <section id="study" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Study Abroad Guide
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Discover affordable universities and get personalized guidance for
            your international education journey
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge
              variant="outline"
              className="border-emerald-500 text-emerald-400"
            >
              <Book className="w-4 h-4 mr-1" />
              University Search
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              <Users className="w-4 h-4 mr-1" />
              Student Life
            </Badge>
            <Badge
              variant="outline"
              className="border-purple-500 text-purple-400"
            >
              <Map className="w-4 h-4 mr-1" />
              Visa Guidance
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {destinations.map((dest, index) => (
            <Card
              key={index}
              className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-105 group relative overflow-hidden"
            >
              {dest.popular && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs">
                    Popular
                  </Badge>
                </div>
              )}

              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{dest.flag}</div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {dest.country}
                  </h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Universities:</span>
                    <span className="text-emerald-400 font-medium">
                      {dest.universities}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg. Cost:</span>
                    <span className="text-blue-400 font-medium">
                      {dest.avgCost}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {dest.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-xs text-gray-300"
                    >
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                      {highlight}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Query Section */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4 text-white">
              Ask About Study Destinations
            </h3>
            <p className="text-gray-300">
              Get personalized recommendations based on your preferences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-900 hover:text-white hover:border-emerald-500 hover:bg-emerald-500/10 transition-all"
            >
              "Cheapest countries to study"
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-900 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all"
            >
              "Best engineering programs"
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-900 hover:text-white hover:border-purple-500 hover:bg-purple-500/10 transition-all"
            >
              "English-taught courses"
            </Button>
          </div>

          <div className="text-center">
            <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-8 py-3">
              Start Planning Your Journey
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudyAbroad;
