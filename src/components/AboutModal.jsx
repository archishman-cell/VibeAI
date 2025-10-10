import React, { useState, useEffect } from 'react';

const AboutModal = ({ isOpen, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      setAnimationClass('animate-fade-in-up');
    } else {
      setAnimationClass('animate-fade-out-down');
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!showModal) {
    return null;
  }
  const projectInfo = {
    title: "VibeAI",
    detailedDescription: [
      "VibeAI is a cutting-edge conversational AI application that leverages Google's powerful Gemini API to provide intelligent, context-aware responses to user queries.",
      "Built with modern React and Vite for optimal performance, the application features a sleek, intuitive interface that makes AI interaction seamless and enjoyable.",
      "The project demonstrates advanced state management, API integration, and real-time communication patterns while maintaining a responsive design across all devices.",
    ],
    features: [
      "Real-time AI conversations with Google Gemini API",
      "Real-time typing animations for enhanced user experience",
      "Automated prompt suggestions to guide user interactions",
      "Modular component architecture with custom hooks",
      "Comprehensive error handling with 60-second timeouts",
      "Mobile-first responsive design",
      "Sticky input components and auto-scroll functionality",
    ],
    tech: "React, Vite, Google Gemini API, Tailwind CSS, Custom Hooks, Service Architecture",
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col ${animationClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{projectInfo.title} - About</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
            {projectInfo.detailedDescription.map((paragraph, index) => (
              <p key={index} className="text-sm text-gray-600 leading-relaxed mb-3">
                {paragraph}
              </p>
            ))}
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Key Features</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              {projectInfo.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Technologies Used</h3>
            <p className="text-sm text-gray-600">{projectInfo.tech}</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Links</h3>
            <div className="flex items-center space-x-6">
              <a 
                href="https://github.com/archishman-cell" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 hover:underline transition-colors"
                aria-label="Developer's GitHub Profile"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.3 24 12 24 5.373 18.627 0 12 0z" clipRule="evenodd" />
                </svg>
                <span>Developer Profile</span>
              </a>
              <a 
                href="" 
                target="https://www.linkedin.com/in/archishman-kar-15131336b" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 hover:underline transition-colors"
                aria-label="Developer's LinkedIn Profile"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default AboutModal;