import { NextResponse } from 'next/server';

export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      quiz: 'operational',
      llm: 'not_configured', // Will be updated when LLM integration is added
      github: 'not_configured', // Will be updated when GitHub API integration is added
    },
  };

  return NextResponse.json(healthCheck);
} 