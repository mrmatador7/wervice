import { NextRequest, NextResponse } from 'next/server';
import { fetchCategoryBySlug } from '@/lib/supabase/vendors';

// Revalidate every 300 seconds (5 minutes) - categories change infrequently
export const revalidate = 300;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const category = await fetchCategoryBySlug(slug);

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error: any) {
    console.error('API Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category', details: error?.message },
      { status: 500 }
    );
  }
}

