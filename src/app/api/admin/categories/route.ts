import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

// GET /api/admin/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      categories: categories || [],
    });
  } catch (error) {
    console.error('Error in GET /api/admin/categories:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const body = await request.json();

    const { name, slug, description, coverUrl, strapline } = body;

    // Validate required fields
    if (!name || !slug || !description) {
      return NextResponse.json(
        { success: false, error: 'Name, slug, and description are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    // Create the category
    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name,
        slug,
        description,
        image: '', // Required field, will be empty for now
        cover_url: coverUrl || null,
        strapline: strapline || null,
      } as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create category' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error('Error in POST /api/admin/categories:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

