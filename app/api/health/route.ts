import { NextResponse } from 'next/server';

/**
 * Health Check API Endpoint
 * 
 * This endpoint is used by tests to verify the server is running
 * and for basic API testing purposes.
 */

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
} 