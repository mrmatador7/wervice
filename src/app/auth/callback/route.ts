import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)

    // Get OAuth parameters
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    const providerToken = searchParams.get('provider_token')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    const next = searchParams.get('next') ?? '/en'

    console.log('🔍 OAuth Callback - Supabase Auth UI Flow:', {
        url: request.url,
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasProviderToken: !!providerToken,
        hasError: !!error,
        errorDescription,
        next,
        allParams: Object.fromEntries(searchParams.entries()),
        timestamp: new Date().toISOString()
    })

    // If there's an OAuth error, redirect to error page
    if (error) {
        console.log('❌ OAuth error from provider:', error, errorDescription)
        const errorUrl = `${origin}/en/auth/auth-code-error?error=${error}&error_description=${errorDescription || 'OAuth authentication failed'}`
        return NextResponse.redirect(errorUrl)
    }

    // For Supabase Auth UI, the client-side library handles the token exchange
    // The callback route just needs to redirect to the appropriate page
    // The client-side Supabase will automatically pick up the session from URL fragments or local storage

    console.log('✅ OAuth callback received, redirecting to:', `${origin}${next}`)

    // Determine the correct redirect URL based on environment
    const forwardedHost = request.headers.get('x-forwarded-host')
    const isLocalEnv = process.env.NODE_ENV === 'development'

    let redirectUrl: string
    if (isLocalEnv) {
        redirectUrl = `${origin}${next}`
    } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`
    } else {
        redirectUrl = `${origin}${next}`
    }

    console.log('🔄 Final redirect URL:', redirectUrl)
    return NextResponse.redirect(redirectUrl)
}
