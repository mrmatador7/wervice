import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { CookieOptions } from '@supabase/ssr'

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
    ];


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

    // Check if authenticated user has profile - sign out if not
    if (session) {
        try {
            // Check if user has a profile
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('id, first_name, last_name')
                .eq('id', session.user.id)
                .single();

            const hasProfile = !!profile && !error;

            console.log(`[${new Date().toISOString()}] 🛡️ User profile verification:`, {
                userId: session.user.id,
                hasProfile,
                route: pathname,
                profileError: error ? {
                    message: error.message,
                    code: error.code
                } : null
            });

            // If user has no profile, sign them out completely
            if (!hasProfile) {
                console.log(`[${new Date().toISOString()}] 🚪 User has no profile, signing out:`, {
                    userId: session.user.id,
                    reason: 'No profile found - user must complete onboarding first',
                    action: 'Sign out and redirect to signin'
                });

                // Sign out the user by clearing the session
                await supabase.auth.signOut();

                // Redirect to signin page
                const locale = pathname.split('/')[1] || 'en';
                const signinUrl = new URL(`/${locale}/auth/signin`, req.url);
                console.log(`[${new Date().toISOString()}] 🔄 Redirecting to signin:`, signinUrl.toString());
                return NextResponse.redirect(signinUrl);
            }

            // User has profile, allow access
            console.log(`[${new Date().toISOString()}] ✅ User authenticated with profile, allowing access:`, {
                userId: session.user.id,
                route: pathname,
                profileId: profile.id
            });

        } catch (error) {
            const errorObj = error as any;
            console.error(`[${new Date().toISOString()}] 💥 Error in middleware profile check:`, {
                error: errorObj?.message || errorObj || 'Unknown error',
                userId: session.user.id
            });
            // If there's an error, allow access (fail open)
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
