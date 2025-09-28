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

    // If user is authenticated and trying to access auth routes, redirect to dashboard
    if (isAuthRoute && session) {
        // Extract locale from pathname (e.g., /en/auth/signin -> /en)
        const locale = pathname.split('/')[1] || 'en'
        return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url))
    }

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
