// Configuration file for Quizzify application
// This will be used for environment variables and API settings

export const config = {
  // Application settings
  app: {
    name: 'Quizzify',
    version: '1.0.0',
    description: 'Turn GitHub repositories into interactive quizzes',
  },

  // API endpoints
  api: {
    quiz: '/api/quiz',
    health: '/api/health',
  },

  // External services (for future use)
  services: {
    // LLM API settings
    llm: {
      provider: process.env.QUIZZIFY_LLM_PROVIDER || 'openai',
      apiKey: process.env.QUIZZIFY_OPENAI_API_KEY,
      model: process.env.QUIZZIFY_LLM_MODEL || 'gpt-4',
      maxTokens: parseInt(process.env.QUIZZIFY_LLM_MAX_TOKENS || '2000'),
    },

    // GitHub API settings
    github: {
      token: process.env.QUIZZIFY_GITHUB_TOKEN,
      baseUrl: 'https://api.github.com',
    },
  },

  // Quiz settings
  quiz: {
    defaultQuestionCount: 5,
    maxQuestionCount: 20,
    timeLimit: 300, // 5 minutes in seconds
  },

  // UI settings
  ui: {
    theme: {
      primary: '#3B82F6', // blue-600
      secondary: '#6B7280', // gray-500
      success: '#10B981', // emerald-500
      error: '#EF4444', // red-500
    },
  },
};

// Environment validation
export function validateEnvironment() {
  const requiredVars: string[] = [
    // Add required environment variables here when implementing LLM integration
    // 'QUIZZIFY_OPENAI_API_KEY',
    // 'QUIZZIFY_GITHUB_TOKEN',
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
    console.warn('Some features may not work without these variables.');
  }
}

// Export types for TypeScript
export type Config = typeof config; 