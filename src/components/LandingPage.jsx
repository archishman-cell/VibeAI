import React from 'react';
import { Link } from 'react-router-dom';
import Silk from './BgAnimation';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen h-screen overflow-hidden flex items-center justify-center font-sans bg-transparent antialiased">
      {/* --- Animated Background (Untouched) --- */}
      <div className="absolute inset-0 -z-10">
        <Silk/>
      </div>

      {/* --- Central Content Container --- */}
      <div className="p-8 md:p-12 lg:p-16 bg-transparent rounded-3xl max-w-xl w-full text-center relative z-10 animate-fade-in">
        
        {/* Logo with Pebble-style Design */}
        <div className="w-32 h-32 mx-auto mb-10 relative flex items-center justify-center 
                        rounded-full border-2 border-white/30 backdrop-blur-sm 
                        bg-white/5 shadow-2xl overflow-hidden
                        transform transition-all duration-500 ease-in-out hover:scale-105">
          {/* Inner glowing effect or subtle gradient to mimic depth */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent animate-pulse-subtle"></div>
          <img 
            src="./assets/logo.png" 
            alt="VibeAI Logo" 
            className="w-20 h-20 filter drop-shadow-lg opacity-80" // Smaller image to fit within pebble, slight opacity
          />
        </div>
        
        {/* Main Title with modern typography and gradient overlay */}
        <h1 className="text-8xl font-extrabold mb-5 tracking-tighter leading-none text-white opacity-90 animate-slide-up">
          VibeAI
        </h1>

        {/* Subtitle with refined text and subtle animation */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light animate-fade-in-slow">
          Your intelligent companion for a smarter tomorrow.
        </p>

        {/* Buttons Container */}
        <div className="flex flex-col space-y-5 w-full md:flex-row md:space-x-5 md:space-y-0">
          
          {/* Get Started Button (Primary, unified hover animation) */}
          <Link
            to="/app"
            className="group relative w-full px-10 py-4 text-lg font-bold text-black bg-white rounded-full 
                       overflow-hidden shadow-lg transform transition-all duration-300 ease-out 
                       hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-opacity-75"
          >
            <span className="absolute inset-0 bg-gray-100 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
            <span className="relative z-10 group-hover:text-black transition-colors duration-300">
              Get Started
            </span>
          </Link>

          {/* Learn More Button (Secondary, unified hover animation) */}
          <Link
            to="/app"
            className="group relative w-full px-10 py-4 text-lg font-semibold text-white bg-transparent border-2 border-white rounded-full 
                       overflow-hidden transform transition-all duration-300 ease-out 
                       hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-opacity-75"
          >
            <span className="absolute inset-0 bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
            <span className="relative z-10 group-hover:text-black transition-colors duration-300">
              Learn More
            </span>
          </Link>
        </div>
      </div>

      {/* --- Footer --- */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-sm text-gray-600 z-10 opacity-70">
        © 2024 VibeAI. All rights reserved.
      </div>

      {/* Custom Keyframe Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-slow {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 0.9; transform: translateY(0); }
        }
        @keyframes pulse-subtle {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-fade-in-slow {
          animation: fade-in-slow 1.5s ease-out 0.5s forwards;
          opacity: 0; /* Ensures it's hidden before animation starts */
        }
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.2s forwards;
          opacity: 0; /* Ensures it's hidden before animation starts */
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;