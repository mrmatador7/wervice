import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('Middleware executed for:', request.url);

  // Check if the pathname starts with a locale
  const pathname = request.nextUrl.pathname;

  // If it's the root path, redirect to /en
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  // If it already has a locale prefix, continue
  if (pathname.startsWith('/en') || pathname.startsWith('/fr') || pathname.startsWith('/ar')) {
    return NextResponse.next();
  }

  // Default redirect to /en
  return NextResponse.redirect(new URL('/en', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
