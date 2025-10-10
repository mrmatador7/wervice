import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Load onboarding data from profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('onboarding_data, onboarded')
      .eq('id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading profile:', error)
      return NextResponse.json(
        { error: 'Failed to load onboarding data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      onboardingData: profile?.onboarding_data || {},
      onboarded: profile?.onboarded || false
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
