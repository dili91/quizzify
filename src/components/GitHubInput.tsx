'use client';

import { useState } from 'react';

interface GitHubInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export default function GitHubInput({ onSubmit, isLoading = false }: GitHubInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateGitHubUrl = (url: string): boolean => {
    const githubRegex = /^https?:\/\/github\.com\/[^\/]+\/[^\/]+$/;
    return githubRegex.test(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    if (!validateGitHubUrl(url)) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)');
      return;
    }

    onSubmit(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="github-url" className="block text-sm font-medium text-gray-700 mb-2">
            GitHub Repository URL
          </label>
          <input
            type="url"
            id="github-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating Quiz...' : 'Generate Quiz'}
        </button>
      </form>
    </div>
  );
} 