import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const published = typeof body?.published === 'boolean' ? body.published : true;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { success: false, message: 'Missing Supabase server credentials' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: beforeRows, error: countError } = await supabase
      .from('vendor_leads')
      .select('id,published');
    if (countError) throw countError;

    const total = beforeRows?.length || 0;
    const currentlyPublished = (beforeRows || []).filter((r) => !!r.published).length;

    const { error: updateError } = await supabase
      .from('vendor_leads')
      .update({ published });
    if (updateError) throw updateError;

    const { count, error: finalError } = await supabase
      .from('vendor_leads')
      .select('id', { count: 'exact', head: true })
      .eq('published', published);
    if (finalError) throw finalError;

    revalidateTag('vendors');

    return NextResponse.json({
      success: true,
      message: published
        ? `Published vendors updated: ${count ?? 0} now visible on website`
        : `All vendors unpublished from website`,
      total,
      previouslyPublished: currentlyPublished,
      nowPublished: count ?? 0,
    });
  } catch (error) {
    console.error('Error bulk publishing vendors:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to bulk update publish status',
      },
      { status: 500 }
    );
  }
}
