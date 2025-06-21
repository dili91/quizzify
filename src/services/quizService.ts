import { Question } from '@/components/Quiz';

export interface QuizGenerationRequest {
  githubUrl: string;
}

export interface QuizGenerationResponse {
  questions: Question[];
  repositoryInfo: {
    name: string;
    description: string;
    language: string;
  };
}

// Hardcoded quiz data for demonstration
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

export async function generateQuiz(githubUrl: string): Promise<QuizGenerationResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return hardcoded quiz if available, otherwise return default
  return hardcodedQuizzes[githubUrl] || defaultQuiz;
}

// Future function signature for when we integrate with LLM API
export async function generateQuizWithLLM(githubUrl: string): Promise<QuizGenerationResponse> {
  // TODO: Implement LLM API integration
  // This will be implemented in a future step
  throw new Error('LLM integration not yet implemented');
} 