import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase-server'
import { mockVendors as MOCK_VENDORS } from '@/data/vendors.mock'

// Scoring weights and thresholds
const SCORING_WEIGHTS = {
  CITY_MATCH: 3,
  SERVICE_MATCH: 4,
  STYLE_OVERLAP_BASE: 2,
  BUDGET_MATCH_MIN: 2,
  BUDGET_MATCH_MAX: 2,
  CAPACITY_MATCH: 1,
  RATING_BASE: 0.5,
  REVIEW_COUNT_LOG: 0.2
}

interface Vendor {
  id: string
  name: string
  slug: string
  category: string
  city: string
  startingPrice?: number
  rating?: number
  reviewsCount?: number
  styles_supported?: string[]
  price_tier_mad_min?: number
  price_tier_mad_max?: number
  capacity_band?: string
  boost_score?: number
}

interface ScoredVendor {
  vendor: Vendor
  score: number
  reasons: string[]
}

// Mock vendor data with additional fields for scoring
const VENDORS: Vendor[] = MOCK_VENDORS.map((vendor, index) => ({
  id: `vendor_${index + 1}`,
  name: vendor.name,
  slug: vendor.slug,
  category: vendor.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  city: vendor.city,
  startingPrice: vendor.priceRange?.from || 0,
  rating: vendor.rating,
  reviewsCount: vendor.reviewsCount || 0,
  styles_supported: ['classic', 'modern', 'traditional'], // Mock styles
  price_tier_mad_min: vendor.priceRange?.from ? vendor.priceRange.from * 0.8 : undefined,
  price_tier_mad_max: vendor.priceRange?.from ? vendor.priceRange.from * 1.5 : undefined,
  capacity_band: '51-100', // Mock capacity
  boost_score: 0 // Mock boost score
}))

function calculateVendorScore(
  vendor: Vendor,
  userProfile: any
): ScoredVendor {
  let score = 0
  const reasons: string[] = []

  // City match
  if (userProfile.city && vendor.city.toLowerCase() === userProfile.city.toLowerCase()) {
    score += SCORING_WEIGHTS.CITY_MATCH
    reasons.push(`Matches your city (${userProfile.city})`)
  }

  // Service match
  if (userProfile.services_needed && userProfile.services_needed.includes(vendor.category)) {
    score += SCORING_WEIGHTS.SERVICE_MATCH
    reasons.push(`Offers ${vendor.category} services`)
  }

  // Style overlap
  if (userProfile.style && vendor.styles_supported) {
    const styleOverlap = userProfile.style.filter((style: string) =>
      vendor.styles_supported!.includes(style.toLowerCase())
    ).length
    if (styleOverlap > 0) {
      score += styleOverlap * SCORING_WEIGHTS.STYLE_OVERLAP_BASE
      const matchedStyles = userProfile.style.filter((style: string) =>
        vendor.styles_supported!.includes(style.toLowerCase())
      )
      reasons.push(`Matches your style (${matchedStyles.join(', ')})`)
    }
  }

  // Budget alignment
  if (userProfile.budget_min_mad && vendor.price_tier_mad_max &&
      userProfile.budget_min_mad <= vendor.price_tier_mad_max) {
    score += SCORING_WEIGHTS.BUDGET_MATCH_MIN
    reasons.push('Within your budget range')
  }

  if (userProfile.budget_max_mad && vendor.price_tier_mad_min &&
      vendor.price_tier_mad_min <= userProfile.budget_max_mad) {
    score += SCORING_WEIGHTS.BUDGET_MATCH_MAX
    reasons.push('Fits your budget')
  }

  // Capacity match (for venues)
  if (vendor.category === 'venues' && userProfile.guest_count_band &&
      vendor.capacity_band === userProfile.guest_count_band) {
    score += SCORING_WEIGHTS.CAPACITY_MATCH
    reasons.push(`Suitable for ${userProfile.guest_count_band} guests`)
  }

  // Quality score from rating
  if (vendor.rating) {
    score += Math.min(vendor.rating, 5) * SCORING_WEIGHTS.RATING_BASE
  }

  // Review count factor
  if (vendor.reviewsCount) {
    score += Math.log10(vendor.reviewsCount + 1) * SCORING_WEIGHTS.REVIEW_COUNT_LOG
  }

  // Business boost
  if (vendor.boost_score) {
    score += vendor.boost_score
  }

  return { vendor, score, reasons }
}

export async function GET(request: NextRequest) {
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

    // Get user's profile data for recommendations
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('city, services_needed, style, budget_min_mad, budget_max_mad, guest_count_band, wedding_month, wedding_year')
      .eq('id', user.id)
      .single()

    // For now, if columns don't exist, use mock profile
    const mockProfile = {
      city: 'Marrakech',
      services_needed: ['venues', 'catering', 'photo'],
      style: ['moroccan-traditional', 'elegant'],
      budget_min_mad: 50000,
      budget_max_mad: 150000,
      guest_count_band: '51-100'
    }

    const userProfile = profileError ? mockProfile : profile

    if (!userProfile) {
      throw new Error('Profile not found')
    }

    // Score all vendors
    const scoredVendors = VENDORS.map(vendor =>
      calculateVendorScore(vendor, userProfile)
    ).sort((a, b) => b.score - a.score)

    // Group by categories and take top vendors per category
    const categoryGroups: Record<string, ScoredVendor[]> = {}
    const maxPerCategory = 6

    for (const scored of scoredVendors) {
      const category = scored.vendor.category
      if (!categoryGroups[category]) {
        categoryGroups[category] = []
      }
      if (categoryGroups[category].length < maxPerCategory) {
        categoryGroups[category].push(scored)
      }
    }

    // Transform to expected format
    const recommendations = Object.entries(categoryGroups).map(([category, vendors]) => ({
      category,
      vendors: vendors.map(({ vendor, score, reasons }) => ({
        id: vendor.id,
        name: vendor.name,
        slug: vendor.slug,
        category: vendor.category,
        city: vendor.city,
        rating: vendor.rating,
        reviewsCount: vendor.reviewsCount,
        startingPrice: vendor.startingPrice,
        score: Math.round(score * 100) / 100, // Round to 2 decimal places
        reasons: reasons.slice(0, 2) // Limit reasons shown
      }))
    }))

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
