'use client';

import { useState, useEffect } from 'react';
import GitHubInput from '@/components/GitHubInput';
import Quiz from '@/components/Quiz';
import LoadingAnimation from '@/components/LoadingAnimation';
import ThemeToggle from '@/components/ThemeToggle';
import { QuizGenerationResponse } from '@/services/quizService';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizGenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [randomDemoRepos, setRandomDemoRepos] = useState<Array<{url: string, name: string, desc: string}>>([]);

  // List of 10 demo repositories
  const demoRepos = [
    {
      url: 'https://github.com/axios/axios',
      name: 'axios/axios',
      desc: 'Promise based HTTP client for the browser and node.js',
    },
    {
      url: 'https://github.com/lodash/lodash',
      name: 'lodash/lodash',
      desc: 'A modern JavaScript utility library delivering modularity',
    },
    {
      url: 'https://github.com/vercel/swr',
      name: 'vercel/swr',
      desc: 'React Hooks for data fetching',
    },
    {
      url: 'https://github.com/dili91/testvox',
      name: 'dili91/testvox',
      desc: 'Turns test reports into human readable summaries, to be shared on common messaging apps.',
    },
    {
      url: 'https://github.com/truelayer/truelayer-java',
      name: 'truelayer/truelayer-java',
      desc: 'Java SDK for TrueLayer APIs',
    },
    {
      url: 'https://github.com/sindresorhus/ky',
      name: 'sindresorhus/ky',
      desc: 'Tiny & elegant HTTP client based on window.fetch',
    },
    {
      url: 'https://github.com/vercel/og-image',
      name: 'vercel/og-image',
      desc: 'Dynamic social card image generator',
    },
    {
      url: 'https://github.com/withastro/astro',
      name: 'withastro/astro',
      desc: 'The web framework for building fast, content-focused websites',
    },
    {
      url: 'https://github.com/pmndrs/zustand',
      name: 'pmndrs/zustand',
      desc: '🐻 Bear necessities for state management in React',
    },
    {
      url: 'https://github.com/vercel/pkg',
      name: 'vercel/pkg',
      desc: 'Package your Node.js project into an executable',
    },
  ];

  // Pick 2 random unique demo repos after component mounts
  useEffect(() => {
    setMounted(true);
    const arr = [...demoRepos];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setRandomDemoRepos(arr.slice(0, 2));
  }, []);

  const handleGitHubSubmit = async (githubUrl: string) => {
    setIsLoading(true);
    setError(null);
    setQuizData(null);

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ githubUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const quiz = await response.json();
      setQuizData(quiz);
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
      console.error('Quiz generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    console.log(`Quiz completed! Score: ${score}/${total}`);
  };

  const handleReset = () => {
    setQuizData(null);
    setError(null);
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-primary)', 
      padding: '2rem 0',
      transition: 'background-color 0.2s'
    }}>
      <ThemeToggle />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 'bold', 
            color: 'var(--text-primary)', 
            marginBottom: '0.5rem',
            transition: 'color 0.2s'
          }}>
            Quizzify
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: 'var(--text-secondary)',
            transition: 'color 0.2s'
          }}>
            Turn any GitHub repository into an interactive quiz
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!quizData ? (
            <div className="space-y-6">
              {/* GitHub Input */}
              <div style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                borderRadius: '0.5rem', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                padding: '1.5rem',
                transition: 'background-color 0.2s'
              }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem',
                  color: 'var(--text-primary)',
                  transition: 'color 0.2s'
                }}>
                  Generate Quiz
                </h2>
                <GitHubInput onSubmit={handleGitHubSubmit} isLoading={isLoading} />
              </div>

              {/* Error Display */}
              {error && (
                <div style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid #fca5a5', 
                  borderRadius: '0.5rem', 
                  padding: '1rem'
                }}>
                  <p style={{ color: '#dc2626' }}>{error}</p>
                </div>
              )}

              {/* Loading Animation */}
              {isLoading && <LoadingAnimation />}

              {/* Example Repositories */}
              {!isLoading && mounted && (
                <div style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  borderRadius: '0.5rem', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                  padding: '1.5rem',
                  transition: 'background-color 0.2s'
                }}>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    marginBottom: '1rem',
                    color: 'var(--text-primary)',
                    transition: 'color 0.2s'
                  }}>
                    Try these example repositories (2 random each time):
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {randomDemoRepos.map((repo) => (
                      <button
                        key={repo.url}
                        onClick={() => handleGitHubSubmit(repo.url)}
                        disabled={isLoading}
                        style={{
                          textAlign: 'left',
                          padding: '1rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: '0.5rem',
                          backgroundColor: 'transparent',
                          transition: 'all 0.2s',
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          opacity: isLoading ? 0.5 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!isLoading) {
                            e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{ 
                          fontWeight: '500', 
                          color: '#3b82f6',
                          marginBottom: '0.25rem'
                        }}>
                          {repo.name}
                        </div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: 'var(--text-secondary)'
                        }}>
                          {repo.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Display */
            <div className="space-y-6">
              {/* Repository Info */}
              <div style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                borderRadius: '0.5rem', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                padding: '1.5rem',
                transition: 'background-color 0.2s'
              }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      transition: 'color 0.2s'
                    }}>
                      {quizData.repositoryInfo.name}
                    </h2>
                    <p style={{ 
                      color: 'var(--text-secondary)',
                      transition: 'color 0.2s'
                    }}>
                      {quizData.repositoryInfo.description}
                    </p>
                    <span style={{ 
                      display: 'inline-block',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      marginTop: '0.5rem',
                      transition: 'all 0.2s'
                    }}>
                      {quizData.repositoryInfo.language}
                    </span>
                  </div>
                  <button
                    onClick={handleReset}
                    style={{
                      color: 'var(--text-secondary)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Quiz Component */}
              <Quiz questions={quizData.questions} onComplete={handleQuizComplete} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
