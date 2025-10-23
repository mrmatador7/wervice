import { NextResponse } from 'next/server';
import { fetchCities } from '@/lib/supabase/vendors';

// Revalidate every 300 seconds (5 minutes) - cities change less frequently
export const revalidate = 300;

export async function GET() {
  try {
    const cities = await fetchCities();
    return NextResponse.json({ cities });
  } catch (error: any) {
    console.error('API Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities', cities: [] },
      { status: 500 }
    );
  }
}

