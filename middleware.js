import { NextResponse } from 'next/server';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const authUiEnabled = process.env.NEXT_PUBLIC_AUTH_UI_ENABLED === 'true';

  // While auth UI is disabled, block direct access to auth and account-creation entry points.
  if (!authUiEnabled) {
    const blockedPatterns = [
      /^\/(en|fr|ar)\/auth(?:\/|$)/,
      /^\/(en|fr|ar)\/become-vendor(?:\/|$)/,
      /^\/(en|fr|ar)\/vendors\/subscribe(?:\/|$)/,
      /^\/vendor-login(?:\/|$)/,
    ];
    const isBlocked = blockedPatterns.some((pattern) => pattern.test(pathname));
    if (isBlocked) {
      const localeMatch = pathname.match(/^\/(en|fr|ar)(?:\/|$)/);
      const locale = localeMatch?.[1] || 'en';
      return NextResponse.redirect(new URL(`/${locale}`, request.url), 307);
    }
  }

  // If it's the root path, redirect to /en
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  // If it already has a locale prefix, continue
  if (pathname.startsWith('/en') || pathname.startsWith('/fr') || pathname.startsWith('/ar')) {
    return NextResponse.next();
  }

  // Prepend default locale so /vendors/slug -> /en/vendors/slug
  const url = new URL(request.url);
  url.pathname = `/en${pathname}`;
  return NextResponse.redirect(url, 308);
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
