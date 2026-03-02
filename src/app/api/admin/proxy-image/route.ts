import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy media from approved hosts to avoid CORS/referrer issues in admin.
 * Allows Supabase storage and configured R2 media host.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url || typeof url !== 'string') {
    return new NextResponse('Missing url', { status: 400 });
  }
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    const mediaHost = (() => {
      try {
        return process.env.NEXT_PUBLIC_MEDIA_BASE_URL
          ? new URL(process.env.NEXT_PUBLIC_MEDIA_BASE_URL).hostname
          : null;
      } catch {
        return null;
      }
    })();

    const allowed =
      host.endsWith('.supabase.co') ||
      host.endsWith('.supabase.in') ||
      host.endsWith('.r2.dev') ||
      host === mediaHost;

    if (!allowed) {
      return new NextResponse('Invalid source', { status: 403 });
    }
  } catch {
    return new NextResponse('Invalid url', { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { Accept: '*/*' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return new NextResponse('Image not found', { status: 404 });
    }
    const blob = await res.blob();
    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (e) {
    console.error('Proxy image error:', e);
    return new NextResponse('Failed to load image', { status: 502 });
  }
}
