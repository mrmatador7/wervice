import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

interface VendorScore {
  vendor: any;
  score: number;
  reasons: string[];
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's profile data for recommendations
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('city, services_needed, style, budget_min_mad, budget_max_mad, guest_count_band')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    // Get all active vendors (assuming we have a vendors table)
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendors')
      .select(`
        id,
        name,
        category,
        city,
        service_areas,
        price_tier_mad_min,
        price_tier_mad_max,
        styles_supported,
        capacity_band,
        rating,
        reviews_count,
        boost_score,
        images,
        description
      `)
      .eq('active', true);

    if (vendorsError) {
      console.error('Error fetching vendors:', vendorsError);
      return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
    }

    // Score vendors based on user preferences
    const scoredVendors = vendors.map(vendor => {
      let score = 0;
      const reasons: string[] = [];

      // City match (3 points)
      if (vendor.city === profile.city ||
          (vendor.service_areas && vendor.service_areas.includes(profile.city))) {
        score += 3;
        reasons.push(`Available in ${profile.city}`);
      }

      // Service match (4 points)
      if (profile.services_needed && profile.services_needed.includes(vendor.category)) {
        score += 4;
        reasons.push(`Matches your ${vendor.category} needs`);
      }

      // Style overlap (2 points per matching style)
      if (profile.style && vendor.styles_supported) {
        const styleOverlap = profile.style.filter((style: string) =>
          vendor.styles_supported.includes(style)
        ).length;
        score += styleOverlap * 2;
        if (styleOverlap > 0) {
          reasons.push(`Matches ${styleOverlap} of your preferred styles`);
        }
      }

      // Budget alignment (2 points each for min/max)
      if (profile.budget_min_mad && vendor.price_tier_mad_max &&
          profile.budget_min_mad <= vendor.price_tier_mad_max) {
        score += 2;
        reasons.push('Within your budget range');
      }

      if (profile.budget_max_mad && vendor.price_tier_mad_min &&
          vendor.price_tier_mad_min <= profile.budget_max_mad) {
        score += 2;
        reasons.push('Fits your budget expectations');
      }

      // Capacity fit for venues (1 point)
      if (vendor.category === 'venues' && vendor.capacity_band &&
          vendor.capacity_band === profile.guest_count_band) {
        score += 1;
        reasons.push('Perfect capacity for your guest count');
      }

      // Quality score (rating * 0.5, max 2.5 points)
      if (vendor.rating) {
        const ratingScore = Math.min(vendor.rating * 0.5, 2.5);
        score += ratingScore;
        if (vendor.rating >= 4.5) {
          reasons.push('Highly rated');
        }
      }

      // Review count score (log scale, max ~1.4 points)
      if (vendor.reviews_count) {
        const reviewScore = Math.log10(vendor.reviews_count + 1) * 0.3;
        score += reviewScore;
        if (vendor.reviews_count > 50) {
          reasons.push('Popular choice');
        }
      }

      // Business boost
      if (vendor.boost_score) {
        score += vendor.boost_score;
      }

      return {
        vendor,
        score,
        reasons
      } as VendorScore;
    });

    // Sort by score descending and take top 24
    const topVendors = scoredVendors
      .sort((a, b) => b.score - a.score)
      .slice(0, 24);

    // Group by categories the user selected
    const groupedRecommendations: Record<string, VendorScore[]> = {};

    if (profile.services_needed) {
      profile.services_needed.forEach((service: string) => {
        groupedRecommendations[service] = topVendors.filter(
          scored => scored.vendor.category === service
        );
      });
    }

    // Add "other" category for high-scoring vendors not in user's services
    const otherVendors = topVendors.filter(
      scored => !profile.services_needed?.includes(scored.vendor.category)
    );
    if (otherVendors.length > 0) {
      groupedRecommendations.other = otherVendors.slice(0, 6);
    }

    return NextResponse.json({
      recommendations: groupedRecommendations,
      userPreferences: {
        city: profile.city,
        services: profile.services_needed,
        styles: profile.style,
        budgetRange: {
          min: profile.budget_min_mad,
          max: profile.budget_max_mad
        },
        guestCount: profile.guest_count_band
      }
    });

  } catch (error) {
    console.error('Unexpected error in vendor recommendations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
