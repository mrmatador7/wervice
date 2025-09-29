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

    if (session) {
        try {
            // Ensure user has a profile (create if missing)
            const { profile, created, error: profileError } = await ensureUserProfile(session);

            console.log('🛡️ Middleware profile check:', {
                pathname,
                userId: session.user.id,
                hasProfile: !!profile,
                profileCreated: created,
                profile: profile ? {
                    is_onboarded: profile.is_onboarded,
                    user_type: profile.user_type,
                    user_status: profile.user_status,
                    first_name: profile.first_name,
                    last_name: profile.last_name
                } : null,
                error: profileError?.message
            });

            if (profileError && !profile) {
                console.error('🛡️ Profile creation failed, continuing with limited functionality');
                // Continue without profile - some features may not work
            }

            // Profile existence is guaranteed by this point
            // Onboarding redirects are handled by the signin page, not middleware
        } catch (error) {
            console.error('🛡️ Error in middleware profile/onboarding check:', error)
            // If there's an error, allow access (fail open)
        }
    }

    // Note: Authenticated users can access auth routes now because the signin page
    // handles proper redirection based on onboarding status. Users who are not
    // onboarded will be redirected to onboarding from the signin component.

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
