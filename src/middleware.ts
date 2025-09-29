import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { CookieOptions } from '@supabase/ssr'
import { ensureUserProfile } from '@/lib/profile'

export async function middleware(req: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: req.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return req.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    req.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    req.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    // Get the current session
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const { pathname, searchParams } = req.nextUrl

    // Define protected routes that require authentication
    const protectedRoutes = [
        '/dashboard',
        '/profile',
        '/reservations',
        '/help'
    ]

    // Define routes that require onboarding completion
    const onboardingRequiredRoutes = [
        '/dashboard',
        '/profile',
        '/reservations'
    ]

    // Define auth routes that authenticated users shouldn't access
    const authRoutes = [
        '/auth/signin',
        '/auth/signup',
        '/auth/reset-password',
        '/auth/update-password'
    ]

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.includes(route) && pathname.startsWith('/en') || pathname.startsWith('/fr') || pathname.startsWith('/ar')
    )

    // Check if the current path is an auth route
    const isAuthRoute = authRoutes.some(route =>
        pathname.includes(route) && pathname.startsWith('/en') || pathname.startsWith('/fr') || pathname.startsWith('/ar')
    )

    // If user is not authenticated and trying to access protected route
    if (isProtectedRoute && !session) {
        const redirectUrl = new URL('/en/auth/signin', req.url)
        // Store the original URL to redirect back after login
        redirectUrl.searchParams.set('redirectTo', pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''))
        return NextResponse.redirect(redirectUrl)
    }

    // Check if user is authenticated and trying to access routes that require onboarding
    const isOnboardingRequiredRoute = onboardingRequiredRoutes.some(route =>
        pathname.includes(route) && (pathname.startsWith('/en') || pathname.startsWith('/fr') || pathname.startsWith('/ar'))
    )

    // Check if authenticated user needs profile (for protected routes)
    if (isOnboardingRequiredRoute && session) {
        try {
            // Check if user has a profile for protected routes
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('id, first_name, last_name')
                .eq('id', session.user.id)
                .single();

            if (error && error.code === 'PGRST116') { // No profile found
                console.log(`[${new Date().toISOString()}] 🛡️ User has no profile, redirecting to onboarding:`, {
                    userId: session.user.id,
                    route: pathname,
                    userAgent: req.headers.get('user-agent')?.substring(0, 50),
                    redirectTo: `/${pathname.split('/')[1] || 'en'}/onboarding?redirectTo=${encodeURIComponent(pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''))}`
                });

                // Redirect to onboarding if trying to access protected routes without profile
                const locale = pathname.split('/')[1] || 'en';
                const onboardingUrl = new URL(`/${locale}/onboarding`, req.url);
                onboardingUrl.searchParams.set('redirectTo', pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''));
                console.log(`[${new Date().toISOString()}] 🛡️ Executing redirect to:`, onboardingUrl.toString());
                return NextResponse.redirect(onboardingUrl);
            }

            // Log successful profile verification for protected routes
            console.log(`[${new Date().toISOString()}] ✅ User has profile, allowing access to:`, {
                userId: session.user.id,
                route: pathname,
                hasProfile: !!profile
            });
        } catch (error) {
            console.error('🛡️ Error checking profile in middleware:', error);
            // Allow access if there's an error (fail open)
        }
    }

    // Note: Profile creation is now handled by the onboarding flow
    // Authenticated users can access auth routes - signin page handles redirects

    // Continue with the request
    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
    ],
}
