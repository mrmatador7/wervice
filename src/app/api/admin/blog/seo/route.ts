import { NextRequest, NextResponse } from 'next/server';
import { getBlogSeoSettings, saveBlogSeoSettings } from '@/lib/blog-admin-store';

export async function GET() {
  try {
    const settings = await getBlogSeoSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch SEO settings',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const homepageTitle = String(body.homepageTitle || '').trim();
    const homepageDescription = String(body.homepageDescription || '').trim();

    if (!homepageTitle || !homepageDescription) {
      return NextResponse.json(
        {
          success: false,
          message: 'Homepage title and description are required',
        },
        { status: 400 }
      );
    }

    await saveBlogSeoSettings({ homepageTitle, homepageDescription });

    return NextResponse.json({
      success: true,
      settings: { homepageTitle, homepageDescription },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to save SEO settings',
      },
      { status: 500 }
    );
  }
}
