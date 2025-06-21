import { Question } from '@/components/Quiz';
import { llmService } from './llmService';
import { githubService } from './githubService';

export interface QuizGenerationRequest {
  githubUrl: string;
  questionCount?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  focus?: string[];
}

export interface QuizGenerationResponse {
  questions: Question[];
  repositoryInfo: {
    name: string;
    description: string;
    language: string;
  };
}

// Hardcoded quiz data for demonstration (fallback)
const hardcodedQuizzes: Record<string, QuizGenerationResponse> = {
  'https://github.com/facebook/react': {
    questions: [
      {
        id: 1,
        question: 'What is React primarily used for?',
        options: [
          'Building user interfaces',
          'Server-side rendering only',
          'Database management',
          'Mobile app development only'
        ],
        correctAnswer: 0,
        explanation: 'React is a JavaScript library for building user interfaces, particularly single-page applications.'
      },
      {
        id: 2,
        question: 'Which hook is used to manage state in functional components?',
        options: [
          'useEffect',
          'useState',
          'useContext',
          'useReducer'
        ],
        correctAnswer: 1,
        explanation: 'useState is the primary hook for managing state in functional components.'
      },
      {
        id: 3,
        question: 'What is the virtual DOM in React?',
        options: [
          'A real DOM element',
          'A lightweight copy of the actual DOM',
          'A database for storing components',
          'A testing framework'
        ],
        correctAnswer: 1,
        explanation: 'The virtual DOM is a lightweight copy of the actual DOM that React uses for efficient updates.'
      },
      {
        id: 4,
        question: 'How do you pass data from parent to child component?',
        options: [
          'Using state',
          'Using props',
          'Using context',
          'Using refs'
        ],
        correctAnswer: 1,
        explanation: 'Props are used to pass data from parent to child components in React.'
      },
      {
        id: 5,
        question: 'What is JSX?',
        options: [
          'A JavaScript framework',
          'A syntax extension for JavaScript',
          'A CSS preprocessor',
          'A testing library'
        ],
        correctAnswer: 1,
        explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript.'
      }
    ],
    repositoryInfo: {
      name: 'React',
      description: 'The library for web and native user interfaces',
      language: 'JavaScript'
    }
  },
  'https://github.com/vercel/next.js': {
    questions: [
      {
        id: 1,
        question: 'What is Next.js?',
        options: [
          'A database management system',
          'A React framework for production',
          'A CSS framework',
          'A testing library'
        ],
        correctAnswer: 1,
        explanation: 'Next.js is a React framework that enables functionality such as server-side rendering and static site generation.'
      },
      {
        id: 2,
        question: 'Which file-based routing system does Next.js use?',
        options: [
          'pages directory',
          'app directory',
          'Both pages and app directories',
          'Custom routing configuration'
        ],
        correctAnswer: 2,
        explanation: 'Next.js supports both the pages directory (Pages Router) and app directory (App Router) for file-based routing.'
      },
      {
        id: 3,
        question: 'What is the purpose of getStaticProps in Next.js?',
        options: [
          'To fetch data at request time',
          'To fetch data at build time',
          'To handle client-side state',
          'To manage authentication'
        ],
        correctAnswer: 1,
        explanation: 'getStaticProps is used to fetch data at build time for static generation.'
      },
      {
        id: 4,
        question: 'How do you create an API route in Next.js?',
        options: [
          'Using the pages/api directory',
          'Using the app/api directory',
          'Both A and B',
          'Using a separate server file'
        ],
        correctAnswer: 2,
        explanation: 'Next.js supports API routes in both pages/api (Pages Router) and app/api (App Router) directories.'
      },
      {
        id: 5,
        question: 'What is the main advantage of using Next.js over plain React?',
        options: [
          'Better CSS support',
          'Built-in performance optimizations',
          'More third-party libraries',
          'Better debugging tools'
        ],
        correctAnswer: 1,
        explanation: 'Next.js provides built-in performance optimizations like automatic code splitting, server-side rendering, and static generation.'
      }
    ],
    repositoryInfo: {
      name: 'Next.js',
      description: 'The React Framework for Production',
      language: 'TypeScript'
    }
  }
};

// Default quiz for any other repository
const defaultQuiz: QuizGenerationResponse = {
  questions: [
    {
      id: 1,
      question: 'What is the primary purpose of this repository?',
      options: [
        'To demonstrate coding practices',
        'To provide a learning resource',
        'To solve a specific problem',
        'All of the above'
      ],
      correctAnswer: 3,
      explanation: 'Most repositories serve multiple purposes including demonstrating practices, providing learning resources, and solving problems.'
    },
    {
      id: 2,
      question: 'Which of the following is a best practice for repository management?',
      options: [
        'Never use version control',
        'Write clear commit messages',
        'Ignore documentation',
        'Use only one branch'
      ],
      correctAnswer: 1,
      explanation: 'Clear commit messages help other developers understand the changes and history of the project.'
    },
    {
      id: 3,
      question: 'What is the purpose of a README file?',
      options: [
        'To store code',
        'To provide project documentation',
        'To run tests',
        'To deploy the application'
      ],
      correctAnswer: 1,
      explanation: 'A README file provides essential information about the project, its setup, and usage.'
    },
    {
      id: 4,
      question: 'Which file is commonly used to specify project dependencies?',
      options: [
        'README.md',
        'package.json',
        '.gitignore',
        'LICENSE'
      ],
      correctAnswer: 1,
      explanation: 'package.json is used to specify project dependencies, scripts, and metadata in Node.js projects.'
    },
    {
      id: 5,
      question: 'What is the benefit of using semantic versioning?',
      options: [
        'It makes code run faster',
        'It helps with dependency management',
        'It reduces file size',
        'It improves security'
      ],
      correctAnswer: 1,
      explanation: 'Semantic versioning helps developers understand the impact of updates and manage dependencies effectively.'
    }
  ],
  repositoryInfo: {
    name: 'Repository',
    description: 'A software project repository',
    language: 'Various'
  }
};

/**
 * Generate quiz using LLM and GitHub API (Phase 2 implementation)
 */
export async function generateQuiz(githubUrl: string): Promise<QuizGenerationResponse> {
  // Check if we have the required environment variables
  const hasOpenAIKey = !!process.env.QUIZZIFY_OPENAI_API_KEY;
  const hasGitHubToken = !!process.env.QUIZZIFY_GITHUB_TOKEN;

  // If we don't have the required APIs, fall back to hardcoded data
  if (!hasOpenAIKey || !hasGitHubToken) {
    console.log('Missing API keys, using hardcoded quiz data');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
    return hardcodedQuizzes[githubUrl] || defaultQuiz;
  }

  try {
    console.log('Generating quiz with LLM for:', githubUrl);
    
    // Step 1: Analyze repository using GitHub API
    const repositoryAnalysis = await githubService.analyzeRepository(githubUrl);
    
    // Step 2: Generate quiz using LLM
    const quizResponse = await llmService.generateQuiz({
      repository: repositoryAnalysis,
      questionCount: 5,
      difficulty: 'medium'
    });
    
    return quizResponse;
  } catch (error) {
    console.error('LLM quiz generation failed, falling back to hardcoded data:', error);
    
    // Fall back to hardcoded data if LLM generation fails
    await new Promise(resolve => setTimeout(resolve, 1000));
    return hardcodedQuizzes[githubUrl] || defaultQuiz;
  }
}

/**
 * Generate quiz with custom parameters
 */
export async function generateQuizWithOptions(request: QuizGenerationRequest): Promise<QuizGenerationResponse> {
  const { githubUrl, questionCount = 5, difficulty = 'medium', focus = [] } = request;
  
  // Check if we have the required environment variables
  const hasOpenAIKey = !!process.env.QUIZZIFY_OPENAI_API_KEY;
  const hasGitHubToken = !!process.env.QUIZZIFY_GITHUB_TOKEN;

  if (!hasOpenAIKey || !hasGitHubToken) {
    console.log('Missing API keys, using hardcoded quiz data');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return hardcodedQuizzes[githubUrl] || defaultQuiz;
  }

  try {
    console.log('Generating custom quiz with LLM for:', githubUrl);
    
    // Analyze repository
    const repositoryAnalysis = await githubService.analyzeRepository(githubUrl);
    
    // Generate quiz with custom parameters
    const quizResponse = await llmService.generateQuiz({
      repository: repositoryAnalysis,
      questionCount,
      difficulty,
      focus
    });
    
    return quizResponse;
  } catch (error) {
    console.error('Custom LLM quiz generation failed, falling back to hardcoded data:', error);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    return hardcodedQuizzes[githubUrl] || defaultQuiz;
  }
}

/**
 * Test API connections
 */
export async function testAPIConnections(): Promise<{
  llm: boolean;
  github: boolean;
}> {
  const results = {
    llm: false,
    github: false
  };

  try {
    if (process.env.QUIZZIFY_OPENAI_API_KEY) {
      results.llm = await llmService.testConnection();
    }
  } catch (error) {
    console.error('LLM connection test failed:', error);
  }

  try {
    if (process.env.QUIZZIFY_GITHUB_TOKEN) {
      results.github = await githubService.testConnection();
    }
  } catch (error) {
    console.error('GitHub connection test failed:', error);
  }

  return results;
}

// Legacy function for backward compatibility
export async function generateQuizWithLLM(githubUrl: string): Promise<QuizGenerationResponse> {
  return generateQuiz(githubUrl);
} 