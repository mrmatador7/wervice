import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Mark onboarding as complete
    const { error } = await supabase
      .from('profiles')
      .update({
        onboarded: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) {
      throw new Error('Failed to complete onboarding')
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
