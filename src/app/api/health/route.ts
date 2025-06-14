import { NextResponse } from 'next/server';
import { getThailandNow, formatThailandTime } from '@/lib/timezone';

export async function GET() {
  const thaiTime = getThailandNow();
  return NextResponse.json({ 
    status: 'OK', 
    timestamp: thaiTime.toISOString(),
    thaiTime: formatThailandTime(thaiTime),
    env: {
      nextauth_url: process.env.NEXTAUTH_URL,
      nextauth_secret: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
      database_url: process.env.DATABASE_URL ? 'SET' : 'NOT_SET'
    }
  });
} 