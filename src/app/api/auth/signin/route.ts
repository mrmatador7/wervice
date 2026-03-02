import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const supabase = await createClient()

    // Sign in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Signin error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    if (!data.session) {
      return NextResponse.json(
        { error: 'Sign in failed - no session created' },
        { status: 401 }
      )
    }

    // Fetch user profile to check user_type
    // Use maybeSingle() instead of single() to avoid errors when profile doesn't exist
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_type, id, email')
      .eq('id', data.user.id)
      .maybeSingle()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      console.error('Profile error details:', {
        code: profileError.code,
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint
      })
      // Continue even if profile fetch fails - user_type will be null
    }

    const userType = profile?.user_type || null
    
    console.log('Signin - Profile check:', {
      hasProfile: !!profile,
      userType,
      userId: data.user.id,
      email: data.user.email,
      profileError: profileError ? {
        code: profileError.code,
        message: profileError.message
      } : null
    })

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
      user_type: userType,
      message: 'Signed in successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
