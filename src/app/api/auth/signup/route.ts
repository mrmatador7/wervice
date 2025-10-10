import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, locale } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // Sign up the user with auto-confirmation for development
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          locale: locale || 'en',
          currency: 'MAD'
        },
        emailRedirectTo: `/${locale || 'en'}/onboarding`
      }
    })

    // If signup successful but no immediate session (email confirmation required),
    // create a session by signing in
    let session = data.session
    if (data.user && !session) {
      console.log('No immediate session, signing in user...')
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) {
        console.error('Auto signin failed:', signInError)
      } else {
        session = signInData.session
        console.log('Auto signin successful')
      }
    }

    if (error) {
      console.error('Signup error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          onboarded: false,
          user_type: 'user',
          user_status: 'active'
        })

      if (profileError && profileError.code !== '23505') { // Ignore duplicate key errors
        console.error('Profile creation error:', profileError)
        // Don't fail the signup if profile creation fails
      }
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      session: session,
      message: session
        ? 'Account created and signed in successfully'
        : 'Account created. Please check your email to confirm your account.'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
