import { NextResponse } from 'next/server';
import { fetchCategoryStats } from '@/lib/supabase/vendors';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/categories/stats
 * Returns the 11 Wervice categories with vendor counts for admin.
 */
export async function GET() {
  try {
    const categories = await fetchCategoryStats();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error in GET /api/admin/categories/stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category stats' },
      { status: 500 }
    );
  }
}
