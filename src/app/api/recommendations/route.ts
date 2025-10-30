import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile for personalization
    const { data: profile } = await supabase
      .from('profiles')
      .select('city, onboarding_data')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ recommendations: {} })
    }

    // Call the existing recommendation API with the user's data
    const recommendationResponse = await fetch(`${request.nextUrl.origin}/api/recommend/vendors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        city: profile.city,
        onboardingData: profile.onboarding_data
      })
    })

    if (!recommendationResponse.ok) {
      throw new Error('Failed to get recommendations')
    }

    const recommendations = await recommendationResponse.json()

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
