import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { normalizeCategory } from '@/lib/categories';

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
  const localeMatch = pathname.match(/^\/(en|fr|ar)(?:\/|$)/);
  const locale = localeMatch?.[1] || 'en';

  // Legacy category URLs -> canonical category slugs
  // /categories/:slug -> /en/categories/:normalized
  const plainCategoryMatch = pathname.match(/^\/categories\/([^/]+)\/?$/);
  if (plainCategoryMatch) {
    const normalized = normalizeCategory(decodeURIComponent(plainCategoryMatch[1]));
    if (normalized) {
      return NextResponse.redirect(new URL(`/${locale}/categories/${normalized}`, request.url), 308);
    }
  }

  // /:locale/categories/:slug -> /:locale/categories/:normalized
  const localizedCategoryMatch = pathname.match(/^\/(en|fr|ar)\/categories\/([^/]+)\/?$/);
  if (localizedCategoryMatch) {
    const targetLocale = localizedCategoryMatch[1];
    const rawSlug = decodeURIComponent(localizedCategoryMatch[2]);
    const normalized = normalizeCategory(rawSlug);
    if (normalized && normalized !== rawSlug) {
      return NextResponse.redirect(new URL(`/${targetLocale}/categories/${normalized}`, request.url), 308);
    }
  }

  // Legacy vendor URLs
  // /vendor/:slug -> /en/vendors/:slug
  const plainVendorMatch = pathname.match(/^\/vendor\/([^/]+)\/?$/);
  if (plainVendorMatch) {
    return NextResponse.redirect(new URL(`/${locale}/vendors/${plainVendorMatch[1]}`, request.url), 308);
  }

  // /:locale/vendor/:slug -> /:locale/vendors/:slug
  const localizedVendorMatch = pathname.match(/^\/(en|fr|ar)\/vendor\/([^/]+)\/?$/);
  if (localizedVendorMatch) {
    const targetLocale = localizedVendorMatch[1];
    const slug = localizedVendorMatch[2];
    return NextResponse.redirect(new URL(`/${targetLocale}/vendors/${slug}`, request.url), 308);
  }

  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminApi = pathname === '/api/admin' || pathname.startsWith('/api/admin/');

  if (isAdminPage || isAdminApi) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/en/dashboard', request.url), 307);
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .maybeSingle();

    const isAdmin = !profileError && (profile?.user_type === 'admin' || profile?.user_type === 'super_admin');

    if (!isAdmin) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/en/dashboard', request.url), 307);
    }
  }

  // While auth UI is disabled, block direct access to auth and account-creation entry points.
  if (!authUiEnabled) {
    const blockedPatterns = [
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
    '/api/admin/:path*',
  ],
};
