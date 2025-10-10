import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase-server'
import { getBudgetBandMADValues, type BudgetBandKey } from '@/lib/currency'

export async function POST(request: NextRequest) {
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
      [`step_${step}`]: data
    }

    // Prepare update data with denormalized fields
    const updateData: any = {
      onboarding_data: updatedOnboardingData,
      updated_at: new Date().toISOString()
    }

    // Map step data to denormalized database fields
    switch (`step_${step}`) {
      case 'step_names':
        if (data.firstName) updateData.first_name = data.firstName
        if (data.partnerFirstName !== undefined) updateData.partner_name = data.partnerFirstName || null
        if (data.phone) updateData.phone = data.phone
        break

      case 'step_location':
        if (data.city) updateData.city = data.city
        break

      case 'step_style':
        if (data.style) updateData.style = data.style
        break

      case 'step_timeline':
        if (data.timeline) {
          if (data.timeline.dateType === 'picked' && data.timeline.weddingDate) {
            updateData.wedding_date = data.timeline.weddingDate
          } else if (data.timeline.dateType === 'monthYear') {
            updateData.wedding_month = data.timeline.month
            updateData.wedding_year = data.timeline.year
          }
        }
        break

      case 'step_guests':
        if (data.guests?.guestCount) {
          updateData.guest_count_band = data.guests.guestCount
        }
        break

      case 'step_services':
        if (data.services) {
          updateData.services_needed = data.services
        }
        break

      case 'step_budget':
        if (data.budgetBand) {
          updateData.budget_band = data.budgetBand
          const madValues = getBudgetBandMADValues(data.budgetBand as BudgetBandKey)
          updateData.budget_min_mad = madValues.min
          updateData.budget_max_mad = madValues.max
        }
        if (data.currency) {
          updateData.currency_preference = data.currency
        }
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
