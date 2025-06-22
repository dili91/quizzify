'use client';

import { useState } from 'react';
import GitHubInput from '@/components/GitHubInput';
import Quiz from '@/components/Quiz';
import LoadingAnimation from '@/components/LoadingAnimation';
import { QuizGenerationResponse } from '@/services/quizService';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizGenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Quizzify
          </h1>
          <p className="text-lg text-gray-600">
            Turn any GitHub repository into an interactive quiz
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!quizData ? (
            <div className="space-y-6">
              {/* GitHub Input */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Generate Quiz</h2>
                <GitHubInput onSubmit={handleGitHubSubmit} isLoading={isLoading} />
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {/* Loading Animation */}
              {isLoading && <LoadingAnimation />}

              {/* Example Repositories */}
              {!isLoading && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Try these example repositories:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleGitHubSubmit('https://github.com/facebook/react')}
                      disabled={isLoading}
                      className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <div className="font-medium text-blue-600">facebook/react</div>
                      <div className="text-sm text-gray-600">The library for web and native user interfaces</div>
                    </button>
                    <button
                      onClick={() => handleGitHubSubmit('https://github.com/vercel/next.js')}
                      disabled={isLoading}
                      className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <div className="font-medium text-blue-600">vercel/next.js</div>
                      <div className="text-sm text-gray-600">The React Framework for Production</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Display */
            <div className="space-y-6">
              {/* Repository Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{quizData.repositoryInfo.name}</h2>
                    <p className="text-gray-600">{quizData.repositoryInfo.description}</p>
                    <span className="inline-block bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded mt-2">
                      {quizData.repositoryInfo.language}
                    </span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
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
