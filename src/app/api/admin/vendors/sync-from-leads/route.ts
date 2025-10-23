import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Sync vendor_leads to public vendors table
 * This endpoint migrates vendor_leads data to the public-facing vendors table
 * Uses service role to bypass RLS
 */
export async function POST() {
  try {
    // Use service role client to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseServiceKey) {
      return NextResponse.json(
        { success: false, error: 'Service role key not configured' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Fetch all vendor_leads
    const { data: vendorLeads, error: fetchError } = await supabase
      .from('vendor_leads')
      .select('*')
      .is('deleted_at', null);

    if (fetchError) {
      console.error('Error fetching vendor_leads:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch vendor leads', details: fetchError.message },
        { status: 500 }
      );
    }

    if (!vendorLeads || vendorLeads.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No vendor leads to sync',
        synced: 0,
        skipped: 0,
        errors: []
      });
    }

    let synced = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Sync each vendor lead to vendors table
    for (const lead of vendorLeads) {
      try {
        // Generate slug (simple version inline)
        const baseSlug = lead.business_name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        
        // Check if slug exists
        const { data: existing } = await supabase
          .from('vendors')
          .select('id')
          .eq('slug', baseSlug)
          .single();
        
        const slug = existing 
          ? `${baseSlug}-${lead.id.split('-')[0]}` 
          : baseSlug;

        // Determine plan based on subscription price
        let plan = 'basic';
        if (lead.subscription_price_dhs >= 350) {
          plan = 'premium';
        } else if (lead.subscription_price_dhs >= 250) {
          plan = 'pro';
        }

        // Parse starting price if available
        let startingPrice: number | null = null;
        if (lead.profile_starting_price) {
          const priceMatch = lead.profile_starting_price.match(/\d+/);
          if (priceMatch) {
            startingPrice = parseInt(priceMatch[0]);
          }
        }

        // Prepare vendor data
        const vendorData = {
          slug,
          business_name: lead.business_name,
          category: lead.category.toLowerCase(),
          city: lead.city.toLowerCase(),
          phone: lead.whatsapp,
          email: lead.email || null,
          description: lead.profile_description || null,
          profile_photo_url: lead.logo_url || null,
          gallery_photos: lead.gallery_urls || null,
          plan,
          starting_price: startingPrice,
          published: lead.status === 'approved', // Only publish approved leads
          created_at: lead.created_at
        };

        // Upsert into vendors table
        const { error: upsertError } = await supabase
          .from('vendors')
          .upsert(vendorData, {
            onConflict: 'slug',
            ignoreDuplicates: false
          });

        if (upsertError) {
          errors.push(`Failed to sync ${lead.business_name}: ${upsertError.message}`);
          skipped++;
        } else {
          synced++;
        }
      } catch (error) {
        errors.push(`Error processing ${lead.business_name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${synced} vendors from vendor_leads`,
      total: vendorLeads.length,
      synced,
      skipped,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error syncing vendor_leads:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync vendor leads',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

