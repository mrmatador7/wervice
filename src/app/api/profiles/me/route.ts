import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase-server'

// Add cache headers to improve performance
const CACHE_DURATION = 60; // 1 minute cache

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile with optimized query (only select needed fields)
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, user_type, user_status, onboarded, first_name, last_name, email, phone, city, onboarding_data')
      .eq('id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    const response = NextResponse.json({
      user,
      profile: profile || { 
        id: user.id,
        user_type: 'user',
        onboarded: false 
      }
    })

    // Add cache headers for better performance
    response.headers.set('Cache-Control', `private, max-age=${CACHE_DURATION}`)
    
    return response
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}