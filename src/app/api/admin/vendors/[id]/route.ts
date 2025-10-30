'use server';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase-server';

// GET - Fetch a single vendor by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const vendorId = resolvedParams.id;

    if (!vendorId) {
      return NextResponse.json(
        { success: false, error: 'Vendor ID is required' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Fetch the vendor from vendor_leads table
    const { data: vendor, error } = await supabase
      .from('vendor_leads')
      .select('*')
      .eq('id', vendorId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      vendor: {
        id: vendor.id,
        name: vendor.business_name,
        slug: vendor.slug,
        email: vendor.email,
        phone: vendor.phone,
        city: vendor.city,
        category: vendor.category,
        subcategory: vendor.subcategory,
        description: vendor.description,
        startingPrice: vendor.starting_price,
        plan: vendor.plan || 'free',
        planPrice: vendor.plan_price || 0,
        status: vendor.published ? 'active' : 'pending',
        published: vendor.published,
        profilePhotoUrl: vendor.profile_photo_url,
        galleryPhotoUrls: vendor.gallery_photos || [],
        createdAt: vendor.created_at,
        updatedAt: vendor.updated_at,
      }
    });

  } catch (error) {
    console.error('Error fetching vendor:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch vendor'
      },
      { status: 500 }
    );
  }
}

// PUT - Update a vendor
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const vendorId = resolvedParams.id;

    if (!vendorId) {
      return NextResponse.json(
        { success: false, error: 'Vendor ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Create Supabase client
    const supabase = await createClient();

    // Update the vendor in vendor_leads table
    const { data, error } = await supabase
      .from('vendor_leads')
      .update({
        business_name: body.name,
        email: body.email,
        phone: body.phone,
        city: body.city,
        category: body.category,
        subcategory: body.subcategory || null,
        description: body.description || null,
        starting_price: body.startingPrice || null,
        plan: body.plan,
        plan_price: body.planPrice,
        published: body.published,
        profile_photo_url: body.profilePhotoUrl || null,
        gallery_photos: body.galleryPhotoUrls || [],
        updated_at: new Date().toISOString(),
      })
      .eq('id', vendorId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Vendor updated successfully',
      vendor: data
    });

  } catch (error) {
    console.error('Error updating vendor:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update vendor'
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a vendor
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const vendorId = resolvedParams.id;

    if (!vendorId) {
      return NextResponse.json(
        { success: false, message: 'Vendor ID is required' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const cookieStore = await cookies();
    const supabase = await createClient();

    // Delete the vendor from vendor_leads table
    const { error } = await supabase
      .from('vendor_leads')
      .delete()
      .eq('id', vendorId);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Vendor deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting vendor:', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete vendor'
      },
      { status: 500 }
    );
  }
}



