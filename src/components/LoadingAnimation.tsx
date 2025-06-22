'use client';

import { useState, useEffect } from 'react';

interface LoadingMessage {
  text: string;
  duration: number;
}

const loadingMessages: LoadingMessage[] = [
  { text: "🔍 Analyzing repository structure...", duration: 2000 },
  { text: "📁 Exploring code directories...", duration: 2000 },
  { text: "📄 Reading source files...", duration: 2000 },
  { text: "🧠 Understanding code architecture...", duration: 2500 },
  { text: "🔧 Identifying key components...", duration: 2000 },
  { text: "💡 Generating intelligent questions...", duration: 2500 },
  { text: "🎯 Crafting challenging scenarios...", duration: 2000 },
  { text: "✨ Finalizing your quiz...", duration: 1500 },
];

export default function LoadingAnimation() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const message = loadingMessages[currentMessageIndex];
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentMessageIndex((prev) => 
          prev === loadingMessages.length - 1 ? 0 : prev + 1
        );
        setIsVisible(true);
      }, 300); // Fade out duration
    }, message.duration);

    return () => clearTimeout(timer);
  }, [currentMessageIndex]);

  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      {/* Animated Spinner */}
      <div className="relative mb-6">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Dynamic Message */}
      <div className="min-h-[60px] flex items-center justify-center">
        <p 
          className={`text-lg text-gray-700 transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {loadingMessages[currentMessageIndex].text}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${((currentMessageIndex + 1) / loadingMessages.length) * 100}%` 
            }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Step {currentMessageIndex + 1} of {loadingMessages.length}
        </p>
      </div>

      {/* Estimated Time */}
      <div className="mt-4 text-sm text-gray-500">
        ⏱️ This usually takes 10-30 seconds depending on repository size
      </div>
    </div>
  );
} 