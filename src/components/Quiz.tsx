'use client';

import { useState, useEffect } from 'react';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: 'domain' | 'code' | 'general';
}

interface QuizProps {
  questions: Question[];
  onComplete: (score: number, total: number) => void;
}

function ConfettiAnimation() {
  const [emojis, setEmojis] = useState<Array<{id: number, emoji: string, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    const partyEmojis = ['🎉', '🎊', '🎈', '🎂', '🎁', '⭐', '🌟', '💫', '✨', '🎆', '🎇', '🎪', '🎨', '🎭', '🎪'];
    const newEmojis = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      emoji: partyEmojis[Math.floor(Math.random() * partyEmojis.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setEmojis(newEmojis);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {emojis.map((item) => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: '2rem',
            animation: `fallAndBounce 3s ease-in ${item.delay}s infinite`,
            transform: 'translateY(-100vh)',
            opacity: 0
          }}
        >
          {item.emoji}
        </div>
      ))}
      <style jsx>{`
        @keyframes fallAndBounce {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function SadAnimation() {
  const [emojis, setEmojis] = useState<Array<{id: number, emoji: string, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    const sadEmojis = ['😢', '😭', '😔', '😞', '😟', '😕', '☹️', '😣', '😖', '😩', '😫', '😤', '😡', '💔', '💧'];
    const newEmojis = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      emoji: sadEmojis[Math.floor(Math.random() * sadEmojis.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setEmojis(newEmojis);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {emojis.map((item) => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: '1.5rem',
            animation: `floatAndFade 4s ease-in-out ${item.delay}s infinite`,
            opacity: 0
          }}
        >
          {item.emoji}
        </div>
      ))}
      <style jsx>{`
        @keyframes floatAndFade {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(-50px) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default function Quiz({ questions, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResults) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      const score = selectedAnswers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correctAnswer ? 1 : 0);
      }, 0);
      onComplete(score, questions.length);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const question = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  if (showResults) {
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 60;

    return (
      <>
        {passed ? <ConfettiAnimation /> : <SadAnimation />}
        <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            transition: 'color 0.2s'
          }}>
            Quiz Complete!
          </h2>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            transition: 'background-color 0.2s'
          }}>
            <p style={{
              fontSize: '1.125rem',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
              transition: 'color 0.2s'
            }}>
              Your Score: {score}/{questions.length}
            </p>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: passed ? '#10b981' : '#ef4444',
              transition: 'color 0.2s'
            }}>
              {percentage}%
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }}
          >
            Take Another Quiz
          </button>
        </div>
      </>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto' }}>
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        transition: 'background-color 0.2s'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1rem',
          color: 'var(--text-primary)',
          transition: 'color 0.2s'
        }}>
          Question {currentQuestion + 1} of {questions.length}
        </h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-primary)',
            transition: 'color 0.2s',
            margin: 0
          }}>
            {question.question}
          </p>
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '500',
            backgroundColor: question.category === 'domain' 
              ? 'rgba(147, 51, 234, 0.1)' 
              : question.category === 'code' 
              ? 'rgba(59, 130, 246, 0.1)' 
              : 'rgba(34, 197, 94, 0.1)',
            color: question.category === 'domain' 
              ? '#a855f7' 
              : question.category === 'code' 
              ? '#3b82f6' 
              : '#22c55e',
            transition: 'all 0.2s'
          }}>
            {question.category === 'domain' ? 'Domain' : 
             question.category === 'code' ? 'Code' : 'General'}
          </span>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswerSelect(idx)}
              disabled={showResults}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '0.75rem 1rem',
                marginBottom: '0.5rem',
                borderRadius: '0.5rem',
                border: selectedAnswer === idx ? '2px solid #3b82f6' : '1px solid var(--border-color)',
                backgroundColor: selectedAnswer === idx ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                color: 'var(--text-primary)',
                fontWeight: selectedAnswer === idx ? '600' : '400',
                cursor: showResults ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                if (!showResults && selectedAnswer !== idx) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                }
              }}
              onMouseLeave={e => {
                if (!showResults && selectedAnswer !== idx) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {option}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color)',
              cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
              opacity: currentQuestion === 0 ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              if (currentQuestion !== 0) {
                e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
              }
            }}
            onMouseLeave={e => {
              if (currentQuestion !== 0) {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              }
            }}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={selectedAnswer === -1}
            style={{
              backgroundColor: selectedAnswer !== -1 ? '#3b82f6' : 'var(--bg-secondary)',
              color: selectedAnswer !== -1 ? 'white' : 'var(--text-secondary)',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: selectedAnswer === -1 ? 'not-allowed' : 'pointer',
              opacity: selectedAnswer === -1 ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              if (selectedAnswer !== -1) {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }
            }}
            onMouseLeave={e => {
              if (selectedAnswer !== -1) {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }
            }}
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
} 