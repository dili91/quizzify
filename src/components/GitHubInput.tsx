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
    <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label htmlFor="github-url" style={{
            display: 'block',
            fontSize: '1rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            marginBottom: '0.5rem',
            transition: 'color 0.2s'
          }}>
            GitHub Repository URL
          </label>
          <input
            type="url"
            id="github-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            style={{
              width: '100%',
              padding: '1rem',
              border: '1px solid var(--border-color)',
              borderRadius: '0.75rem',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '1.25rem',
              transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
              marginBottom: '0.5rem',
              outline: 'none',
              boxSizing: 'border-box',
              fontWeight: 400
            }}
            disabled={isLoading}
            autoComplete="off"
            // Custom placeholder color
            onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
          />
          <style>{`
            #github-url::placeholder {
              color: var(--text-secondary);
              opacity: 1;
              font-size: 1.25rem;
            }
          `}</style>
        </div>
        {error && (
          <p style={{ color: '#ef4444', fontSize: '1rem', marginTop: '-1rem' }}>{error}</p>
        )}
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '1.5rem',
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--border-color)',
            fontWeight: 500,
            cursor: isLoading || !url.trim() ? 'not-allowed' : 'pointer',
            opacity: isLoading || !url.trim() ? 0.5 : 1,
            transition: 'background-color 0.2s, color 0.2s, border-color 0.2s'
          }}
          onMouseEnter={e => {
            if (!(isLoading || !url.trim())) {
              e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
          }}
        >
          {isLoading ? 'Generating Quiz...' : 'Generate Quiz'}
        </button>
      </form>
    </div>
  );
} 