import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase-server'
import { getBudgetBandMADValues, type BudgetBandKey } from '@/lib/currency'

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

    const { step, data }: { step: string; data: any } = await request.json()

    if (!step || !data) {
      return NextResponse.json(
        { error: 'Missing step or data' },
        { status: 400 }
      )
    }

    // Get current profile for onboarding data
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('onboarding_data, onboarded')
      .eq('id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error('Failed to fetch profile')
    }

    // Prepare the data to save
    const existingData = (profile?.onboarding_data as Record<string, any>) || {}
    const updatedOnboardingData = {
      ...existingData,
      [step]: data
    }

    // Prepare update data with denormalized fields
    const updateData: any = {
      onboarding_data: updatedOnboardingData,
      updated_at: new Date().toISOString()
    }

    // Map step data to denormalized database fields based on new data model
    switch (step) {
      case 'basicInfo':
        if (data.firstName) updateData.first_name = data.firstName
        if (data.partnerName !== undefined) updateData.partner_name = data.partnerName || null
        break

      case 'city':
        if (data) updateData.city = data
        break

      case 'date':
        if (data.weddingDate) {
          if (data.weddingDateType === 'exact') {
            updateData.wedding_date = data.weddingDate
          }
        }
        break

      case 'guests':
        if (data) updateData.guest_count = data
        break

      case 'budget':
        if (data.currency) updateData.currency = data.currency
        if (data.budgetTotal) updateData.budget_total = data.budgetTotal
        break

      case 'style':
        if (data.styles) updateData.styles = data.styles
        if (data.priorities) updateData.priorities = data.priorities
        break

      case 'services':
        if (data.servicesNeeded) updateData.services_needed = data.servicesNeeded
        break
    }

    // Check if profile exists, if not create it
    if (fetchError && fetchError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          onboarded: false,
          user_type: 'user',
          user_status: 'active',
          ...updateData
        })

      if (createError) {
        throw new Error('Failed to create profile')
      }
    } else {
      // Update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (updateError) {
        throw new Error('Failed to save onboarding data')
      }
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
