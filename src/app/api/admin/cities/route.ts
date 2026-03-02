import { NextResponse } from 'next/server';
import { fetchCitiesWithStats } from '@/lib/supabase/vendors';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/cities
 * Returns all cities with vendor counts (total and published) for admin.
 */
export async function GET() {
  try {
    const cities = await fetchCitiesWithStats();
    return NextResponse.json({
      success: true,
      cities,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/cities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}
