'use client';

import { useState } from 'react';

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

    return (
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
            color: '#3b82f6',
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
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <span style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            transition: 'color 0.2s'
          }}>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            transition: 'color 0.2s'
          }}>
            {selectedAnswers.filter(answer => answer !== -1).length} answered
          </span>
        </div>
        <div style={{
          width: '100%',
          backgroundColor: 'var(--border-color)',
          borderRadius: '9999px',
          height: '0.5rem',
          transition: 'background-color 0.2s'
        }}>
          <div
            style={{
              backgroundColor: '#3b82f6',
              height: '0.5rem',
              borderRadius: '9999px',
              transition: 'width 0.3s',
              width: `${((currentQuestion + 1) / questions.length) * 100}%`
            }}
          ></div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        transition: 'background-color 0.2s'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            transition: 'color 0.2s'
          }}>
            {question.question}
          </h3>
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
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {question.options.map((option, index) => {
            let buttonStyle: React.CSSProperties = {
              width: '100%',
              textAlign: 'left',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color)',
              backgroundColor: 'transparent',
              cursor: showResults ? 'default' : 'pointer',
              transition: 'all 0.2s',
              color: 'var(--text-primary)'
            };

            if (selectedAnswer === index) {
              if (showResults) {
                if (index === question.correctAnswer) {
                  buttonStyle = {
                    ...buttonStyle,
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderColor: '#22c55e',
                    color: '#22c55e'
                  };
                } else {
                  buttonStyle = {
                    ...buttonStyle,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderColor: '#ef4444',
                    color: '#ef4444'
                  };
                }
              } else {
                buttonStyle = {
                  ...buttonStyle,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderColor: '#3b82f6',
                  color: '#3b82f6'
                };
              }
            } else if (showResults && index === question.correctAnswer) {
              buttonStyle = {
                ...buttonStyle,
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: '#22c55e',
                color: '#22c55e'
              };
            } else {
              buttonStyle = {
                ...buttonStyle,
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              };
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResults}
                style={buttonStyle}
                onMouseEnter={(e) => {
                  if (!showResults && selectedAnswer !== index) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showResults && selectedAnswer !== index) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                  }
                }}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== -1 && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                style={{
                  padding: '0.5rem 1rem',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentQuestion === 0 ? 0.5 : 1,
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (currentQuestion !== 0) {
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
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
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 