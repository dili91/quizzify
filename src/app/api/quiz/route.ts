import { NextRequest, NextResponse } from 'next/server';
import { generateQuiz, generateQuizWithOptions, testAPIConnections } from '@/services/quizService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { githubUrl, questionCount, difficulty, focus } = body;

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

    let quiz;
    
    // If custom parameters are provided, use the advanced function
    if (questionCount || difficulty || focus) {
      quiz = await generateQuizWithOptions({
        githubUrl,
        questionCount,
        difficulty,
        focus
      });
    } else {
      // Use the standard function
      quiz = await generateQuiz(githubUrl);
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}

// GET method for testing API connections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const test = searchParams.get('test');

    if (test === 'connections') {
      const connections = await testAPIConnections();
      return NextResponse.json({
        status: 'ok',
        connections,
        message: 'API connection test completed'
      });
    }

    return NextResponse.json({ 
      status: 'ok', 
      message: 'Quiz API is running',
      version: '2.0.0',
      features: [
        'LLM-powered quiz generation',
        'GitHub repository analysis',
        'Custom quiz parameters',
        'Fallback to hardcoded data'
      ]
    });
  } catch (error) {
    console.error('API test error:', error);
    return NextResponse.json(
      { error: 'API test failed' },
      { status: 500 }
    );
  }
} 