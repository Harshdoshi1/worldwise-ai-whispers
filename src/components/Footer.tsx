
import { Map } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Map className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                WorldWise AI
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Your intelligent travel companion for exploring the world with confidence.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Voice Assistant</li>
              <li className="hover:text-white transition-colors cursor-pointer">Travel Planning</li>
              <li className="hover:text-white transition-colors cursor-pointer">Cultural Guide</li>
              <li className="hover:text-white transition-colors cursor-pointer">Study Abroad</li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-white font-semibold mb-4">Popular Destinations</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Japan</li>
              <li className="hover:text-white transition-colors cursor-pointer">Germany</li>
              <li className="hover:text-white transition-colors cursor-pointer">Thailand</li>
              <li className="hover:text-white transition-colors cursor-pointer">Canada</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
              <li className="hover:text-white transition-colors cursor-pointer">Contact Us</li>
              <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 WorldWise AI. All rights reserved.
          </p>
          
          <div className="flex space-x-6 text-sm text-gray-400">
            <span className="hover:text-white transition-colors cursor-pointer">🌍 Available in 50+ languages</span>
            <span className="hover:text-white transition-colors cursor-pointer">🤖 Powered by Advanced AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
