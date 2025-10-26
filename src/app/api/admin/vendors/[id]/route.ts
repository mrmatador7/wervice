'use server';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase-server';

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
    const supabase = await createClient(cookieStore);

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



