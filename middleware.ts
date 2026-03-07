import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const authUiEnabled = process.env.NEXT_PUBLIC_AUTH_UI_ENABLED === 'true';

export async function middleware(request: NextRequest) {
  // Create Supabase client for authentication
  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({
          name,
          value,
          ...options,
        })
      },
      remove(name: string, options: any) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        })
      },
    },
  })

  // Note: Removed session refresh from middleware to avoid cookie parsing issues
  // Session refresh is handled in individual pages as needed

  const pathname = request.nextUrl.pathname;

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

  // For paths without locale, prepend /en and redirect
  const url = request.nextUrl.clone();
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
