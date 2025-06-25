import { NextResponse } from 'next/server';
import { testConnection } from '@/config/db';

export async function GET() {
  try {
    const dbStatus = await testConnection();
    
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus ? 'connected' : 'disconnected',
      version: process.env.npm_package_version || '1.0.0'
    };

    const statusCode = dbStatus ? 200 : 503;
    
    return NextResponse.json(health, { status: statusCode });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 500 });
  }
} 