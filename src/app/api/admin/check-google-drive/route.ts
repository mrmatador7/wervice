import { NextResponse } from 'next/server';
import { testGoogleDriveApi, isGoogleDriveApiConfigured } from '@/lib/supabase/image-utils';

export async function GET() {
  try {
    const isConfigured = isGoogleDriveApiConfigured();
    
    if (!isConfigured) {
      return NextResponse.json({
        configured: false,
        message: 'Google Drive API key not found in environment variables.',
        instructions: 'Add GOOGLE_DRIVE_API_KEY to your .env.local file. Get your API key from https://console.cloud.google.com/apis/credentials'
      });
    }
    
    // Test the API
    const testResult = await testGoogleDriveApi();
    
    return NextResponse.json({
      configured: true,
      working: testResult.success,
      message: testResult.message
    });
    
  } catch (error) {
    return NextResponse.json({
      configured: false,
      working: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error: 'Failed to check Google Drive API status'
    }, { status: 500 });
  }
}






