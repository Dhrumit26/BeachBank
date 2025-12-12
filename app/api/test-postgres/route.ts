import { NextResponse } from 'next/server';
import { query } from '@/lib/postgres';

export async function GET() {
  try {
    // Test PostgreSQL connection
    const result = await query('SELECT NOW() as current_time, version() as pg_version');
    
    return NextResponse.json({
      success: true,
      message: 'PostgreSQL connection successful',
      data: {
        currentTime: result.rows[0].current_time,
        version: result.rows[0].pg_version,
      },
      postgresUrl: process.env.POSTGRES_URL ? 'Set' : 'Not set',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'PostgreSQL connection failed',
      error: error?.message || 'Unknown error',
      postgresUrl: process.env.POSTGRES_URL ? 'Set' : 'Not set',
      details: error?.stack,
    }, { status: 500 });
  }
}

