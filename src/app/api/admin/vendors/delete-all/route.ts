import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { revalidateTag } from 'next/cache';

const CHUNK = 200;

/**
 * Delete all vendors from website and database.
 * Removes: vendor_gallery (by vendor_leads FK), public.vendors, vendor_leads.
 * Requires SUPABASE_SERVICE_ROLE_KEY.
 */
export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { success: false, message: 'Server not configured (missing SUPABASE_SERVICE_ROLE_KEY)' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const deleted = { vendor_gallery: 0, vendors: 0, vendor_leads: 0 };

    // 1. Delete all vendor_gallery rows (references vendor_leads)
    const { data: galleryRows } = await supabase.from('vendor_gallery').select('id');
    const galleryIds = galleryRows?.map((r) => r.id) ?? [];
    for (let i = 0; i < galleryIds.length; i += CHUNK) {
      const chunk = galleryIds.slice(i, i + CHUNK);
      if (chunk.length) await supabase.from('vendor_gallery').delete().in('id', chunk);
    }
    deleted.vendor_gallery = galleryIds.length;

    // 2. Delete all from public.vendors (website)
    const { data: vendorRows } = await supabase.from('vendors').select('id');
    const vendorIds = vendorRows?.map((r) => r.id) ?? [];
    for (let i = 0; i < vendorIds.length; i += CHUNK) {
      const chunk = vendorIds.slice(i, i + CHUNK);
      if (chunk.length) await supabase.from('vendors').delete().in('id', chunk);
    }
    deleted.vendors = vendorIds.length;

    // 3. Delete all from vendor_leads
    const { data: leadRows } = await supabase.from('vendor_leads').select('id');
    const leadIds = leadRows?.map((r) => r.id) ?? [];
    for (let i = 0; i < leadIds.length; i += CHUNK) {
      const chunk = leadIds.slice(i, i + CHUNK);
      if (chunk.length) await supabase.from('vendor_leads').delete().in('id', chunk);
    }
    deleted.vendor_leads = leadIds.length;

    revalidateTag('vendors');

    const total = deleted.vendors + deleted.vendor_leads + deleted.vendor_gallery;
    return NextResponse.json({
      success: true,
      message: `Deleted all vendor data: ${deleted.vendors} from website (vendors), ${deleted.vendor_leads} from admin (vendor_leads), ${deleted.vendor_gallery} gallery rows.`,
      deleted,
      total,
    });
  } catch (error) {
    console.error('Error deleting all vendors:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete vendors';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
