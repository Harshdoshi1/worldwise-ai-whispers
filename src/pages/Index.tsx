
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Search, Map, Book, Users, Headphones } from "lucide-react";
import { useState } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import VoiceDemo from "@/components/VoiceDemo";
import StudyAbroad from "@/components/StudyAbroad";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 bg-black/50 backdrop-blur-md border-b border-purple-900/20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Map className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            WorldWise AI
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#demo" className="text-gray-300 hover:text-white transition-colors">Demo</a>
          <a href="#study" className="text-gray-300 hover:text-white transition-colors">Study Abroad</a>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Voice Demo Section */}
      <VoiceDemo />

      {/* Study Abroad Section */}
      <StudyAbroad />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
