import { NextRequest, NextResponse } from 'next/server';
import { generateQuiz } from '@/services/quizService';

export async function POST(request: NextRequest) {
  try {
    const { githubUrl } = await request.json();

    if (!githubUrl) {
      return NextResponse.json(
        { error: 'GitHub URL is required' },
        { status: 400 }
      );
    }

    // Validate GitHub URL format
    const githubRegex = /^https?:\/\/github\.com\/[^\/]+\/[^\/]+$/;
    if (!githubRegex.test(githubUrl)) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL format' },
        { status: 400 }
      );
    }

    // Generate quiz using the service
    const quiz = await generateQuiz(githubUrl);

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}

// Optional: Add GET method for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Quiz API is running',
    version: '1.0.0'
  });
} 