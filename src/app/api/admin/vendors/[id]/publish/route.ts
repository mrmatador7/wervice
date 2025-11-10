'use server';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase-server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { published } = body;

    if (typeof published !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          message: 'Published status must be a boolean'
        },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = await createClient();

    // Update the published status
    const { data, error } = await supabase
      .from('vendor_leads')
      .update({ published })
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Vendor ${published ? 'published' : 'unpublished'} successfully`,
      vendor: data?.[0]
    });

  } catch (error) {
    console.error('Error updating vendor publish status:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update vendor'
      },
      { status: 500 }
    );
  }
}

