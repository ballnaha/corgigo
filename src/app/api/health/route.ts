import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: {
      nextauth_url: process.env.NEXTAUTH_URL,
      nextauth_secret: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
      database_url: process.env.DATABASE_URL ? 'SET' : 'NOT_SET'
    }
  });
} 