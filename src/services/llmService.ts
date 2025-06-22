import OpenAI from 'openai';
import { Question } from '@/components/Quiz';
import { QuizGenerationResponse } from './quizService';

// Initialize OpenAI client with proper error handling
const getOpenAIClient = () => {
  const apiKey = process.env.QUIZZIFY_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('QUIZZIFY_OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({ apiKey });
};

export interface RepositoryAnalysis {
  name: string;
  description: string;
  language: string;
  topics: string[];
  readmeContent?: string;
  mainFiles: Array<{
    path: string;
    content: string;
    type: 'code' | 'config' | 'documentation';
    size: number;
  }>;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface LLMQuizRequest {
  repository: RepositoryAnalysis;
  questionCount?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  focus?: string[];
}

export interface LLMQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: 'domain' | 'code' | 'general';
}

export interface LLMQuizResponse {
  questions: LLMQuizQuestion[];
  repositoryInfo: {
    name: string;
    description: string;
    language: string;
  };
}

export class LLMService {
  private static instance: LLMService;
  
  private constructor() {}
  
  static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  /**
   * Generate quiz questions using LLM based on repository analysis
   */
  async generateQuiz(request: LLMQuizRequest): Promise<QuizGenerationResponse> {
    try {
      const prompt = this.buildQuizPrompt(request);
      
      const completion = await getOpenAIClient().chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert code reviewer and onboarding specialist. Generate quiz questions that test knowledge specific to THIS PARTICULAR codebase and its unique implementation details. Focus on questions that would help new contributors understand the project's specific architecture, business logic, and implementation choices. Avoid generic software development questions that could apply to any project."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from LLM');
      }

      return this.parseQuizResponse(response, request.repository);
    } catch (error) {
      console.error('LLM quiz generation error:', error);
      throw new Error('Failed to generate quiz with LLM');
    }
  }

  /**
   * Build a comprehensive prompt for quiz generation
   */
  private buildQuizPrompt(request: LLMQuizRequest): string {
    const { repository, questionCount = 10, difficulty = 'medium', focus = [] } = request;
    
    const focusText = focus.length > 0 ? `\nFocus areas: ${focus.join(', ')}` : '';
    
    return `
Generate ${questionCount} multiple-choice quiz questions about THIS SPECIFIC repository. Focus ONLY on knowledge that is unique to this codebase:

Repository: ${repository.name}
Description: ${repository.description}
Primary Language: ${repository.language}
Topics: ${repository.topics.join(', ')}
Difficulty Level: ${difficulty}${focusText}

Key Files:
${repository.mainFiles.map(file => 
  `- ${file.path} (${file.type}): ${file.content.substring(0, 200)}...`
).join('\n')}

${repository.readmeContent ? `README Content: ${repository.readmeContent.substring(0, 500)}...` : ''}

CRITICAL REQUIREMENTS:
1. Generate exactly ${questionCount} questions distributed across three categories:
   - 5 "code" questions: Focus on THIS PROJECT'S code structure, main components, critical code parts, architecture patterns, and technical implementation details
   - 4 "domain" questions: Focus on THIS PROJECT'S specific business logic, domain concepts, and unique application features
   - 1 "general" question: Focus on THIS PROJECT'S specific development practices and project-specific concepts

2. AVOID generic questions about:
   - What README files are for
   - What contributing guidelines contain
   - General software development practices
   - Generic technology explanations (e.g., "What is Gradle?")
   - Standard file purposes (e.g., "What is package.json for?")

3. INSTEAD, focus on questions about:
   - This project's specific architecture decisions
   - Unique business logic and domain concepts
   - Project-specific implementation patterns
   - How this particular codebase solves specific problems
   - The project's specific technology choices and why they were made
   - Project-specific data structures and algorithms
   - Unique features and functionality of this codebase

4. Questions must be answerable ONLY by someone who has studied THIS specific codebase
5. Provide detailed explanations that reference specific parts of the code
6. Use realistic distractors that are plausible but incorrect for THIS project

Format the response as a JSON object with this structure:
{
  "questions": [
    {
      "id": 1,
      "question": "How does this specific project handle [specific feature]?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation referencing specific code or architecture from this project",
      "category": "code"
    }
  ],
  "repositoryInfo": {
    "name": "${repository.name}",
    "description": "${repository.description}",
    "language": "${repository.language}"
  }
}

Category guidelines for THIS PROJECT:
- "code": This project's code structure, main components, critical code parts, architecture patterns, technical implementation details, and how the code is organized
- "domain": This project's specific business logic, user requirements, domain concepts, and unique application features
- "general": This project's specific development practices, project structure, and project-specific concepts

Only return valid JSON, no additional text.
`;
  }

  /**
   * Parse the LLM response into our quiz format
   */
  private parseQuizResponse(response: string, repository: RepositoryAnalysis): QuizGenerationResponse {
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed: LLMQuizResponse = JSON.parse(jsonMatch[0]);
      
      // Validate and transform the response
      const questions: Question[] = parsed.questions?.map((q: LLMQuizQuestion, index: number) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        category: q.category
      })) || [];

      return {
        questions,
        repositoryInfo: {
          name: parsed.repositoryInfo?.name || repository.name,
          description: parsed.repositoryInfo?.description || repository.description,
          language: parsed.repositoryInfo?.language || repository.language
        }
      };
    } catch (error) {
      console.error('Failed to parse LLM response:', error);
      console.error('Raw response:', response);
      throw new Error('Invalid response format from LLM');
    }
  }

  /**
   * Test the LLM connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const completion = await getOpenAIClient().chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 10,
      });
      return !!completion.choices[0]?.message?.content;
    } catch (error) {
      console.error('LLM connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const llmService = LLMService.getInstance(); 