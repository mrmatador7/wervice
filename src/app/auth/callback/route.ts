import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function sanitizeNextPath(next: string | null): string {
    if (!next || !next.startsWith('/')) return '/en'
    if (next.startsWith('//')) return '/en'
    return next
}

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)

    // Get OAuth parameters
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    const next = sanitizeNextPath(searchParams.get('next'))

    console.log('🔍 OAuth Callback - Supabase Auth UI Flow:', {
        hasError: !!error,
        errorDescription,
        next,
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

    console.log('✅ OAuth callback received, redirecting to safe path:', next)
    const redirectUrl = `${origin}${next}`

    console.log('🔄 Final redirect URL:', redirectUrl)
    return NextResponse.redirect(redirectUrl)
}
