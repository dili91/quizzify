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
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '2rem',
      textAlign: 'center',
      transition: 'background-color 0.2s'
    }}>
      {/* Animated Spinner */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <div style={{
          animation: 'spin 1s linear infinite',
          borderRadius: '50%',
          height: '4rem',
          width: '4rem',
          borderBottom: '2px solid #3b82f6',
          margin: '0 auto'
        }}></div>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}></div>
        </div>
      </div>

      {/* Dynamic Message */}
      <div style={{ minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--text-primary)',
          transition: 'opacity 0.3s, color 0.2s',
          opacity: isVisible ? 1 : 0
        }}>
          {loadingMessages[currentMessageIndex].text}
        </p>
      </div>

      {/* Progress Indicator */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{
          width: '100%',
          backgroundColor: 'var(--border-color)',
          borderRadius: '9999px',
          height: '0.5rem'
        }}>
          <div 
            style={{ 
              backgroundColor: '#3b82f6',
              height: '0.5rem',
              borderRadius: '9999px',
              transition: 'width 0.5s ease-out',
              width: `${((currentMessageIndex + 1) / loadingMessages.length) * 100}%` 
            }}
          ></div>
        </div>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          marginTop: '0.5rem',
          transition: 'color 0.2s'
        }}>
          Step {currentMessageIndex + 1} of {loadingMessages.length}
        </p>
      </div>

      {/* Estimated Time */}
      <div style={{
        marginTop: '1rem',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        transition: 'color 0.2s'
      }}>
        ⏱️ This usually takes <b>1-5 minutes</b> depending on repository size
      </div>
    </div>
  );
} 