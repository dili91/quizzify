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
            content: "You are an expert software developer and educator. Generate high-quality quiz questions about codebases that test understanding of architecture, patterns, and best practices. Always categorize questions into three types: 'domain' (business/domain knowledge), 'code' (technical implementation), and 'general' (general software development knowledge)."
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
Generate ${questionCount} multiple-choice quiz questions about this repository:

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

Requirements:
1. Generate exactly ${questionCount} questions distributed across three categories:
   - 6 "domain" questions: Focus on business logic, domain concepts, and application purpose
   - 3 "code" questions: Focus on technical implementation, architecture, and coding patterns
   - 1 "general" question: Focus on general software development practices and concepts
2. Questions should test understanding of the codebase architecture, patterns, and concepts
3. Include questions about the technology stack, project structure, and key features
4. Make questions relevant to the specific repository content
5. Provide clear explanations for correct answers
6. Use realistic distractors (wrong answers) that are plausible

Format the response as a JSON object with this structure:
{
  "questions": [
    {
      "id": 1,
      "question": "What is the primary purpose of this repository?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation for why this is correct",
      "category": "domain"
    }
  ],
  "repositoryInfo": {
    "name": "${repository.name}",
    "description": "${repository.description}",
    "language": "${repository.language}"
  }
}

Category guidelines:
- "domain": Business logic, user requirements, domain-specific concepts, application purpose
- "code": Technical implementation, code structure, patterns, architecture, specific technologies
- "general": Software development practices, best practices, general concepts, methodologies

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