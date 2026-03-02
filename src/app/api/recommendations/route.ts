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
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('city, onboarding_data')
      .eq('id', user.id)
      .maybeSingle()

    // If no profile or error, return empty recommendations
    if (profileError || !profile) {
      return NextResponse.json({ recommendations: [] })
    }

    // Call the existing recommendation API (it uses GET and gets user data from session)
    // Get all cookies from the request to pass to internal API call
    const cookieHeader = request.headers.get('cookie') || ''
    
    const recommendationResponse = await fetch(`${request.nextUrl.origin}/api/recommend/vendors`, {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader,
      },
      // Don't cache internal API calls
      cache: 'no-store',
    })

    if (!recommendationResponse.ok) {
      // If recommendation API fails, return empty array instead of throwing
      console.error('Failed to get recommendations:', recommendationResponse.statusText)
      return NextResponse.json({ recommendations: [] })
    }

    const recommendationData = await recommendationResponse.json()
    
    // Ensure recommendations is an array
    const recommendations = Array.isArray(recommendationData.recommendations) 
      ? recommendationData.recommendations 
      : []

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
