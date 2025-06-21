import { NextResponse } from 'next/server';
import { testAPIConnections } from '@/services/quizService';

export async function GET() {
  try {
    // Test API connections
    const connections = await testAPIConnections();
    
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '2.0.0',
      services: {
        quiz: 'operational',
        llm: connections.llm ? 'operational' : 'not_configured',
        github: connections.github ? 'operational' : 'not_configured',
      },
      apiKeys: {
        openai: process.env.QUIZZIFY_OPENAI_API_KEY ? 'configured' : 'missing',
        github: process.env.QUIZZIFY_GITHUB_TOKEN ? 'configured' : 'missing',
      },
      features: {
        llmIntegration: connections.llm && connections.github,
        fallbackMode: !connections.llm || !connections.github,
      }
    };

    return NextResponse.json(healthCheck);
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    }, { status: 500 });
  }
} 