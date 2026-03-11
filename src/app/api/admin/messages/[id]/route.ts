import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';
import type { Database } from '@/lib/database.types';

async function requireAdmin(): Promise<NextResponse | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', user.id)
    .maybeSingle();

  const isAdmin = !profileError && (profile?.user_type === 'admin' || profile?.user_type === 'super_admin');
  if (!isAdmin) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  return null;
}

async function getAdminDataClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey) {
    return createSupabaseClient<Database>(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  return createServerClient();
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authGuard = await requireAdmin();
    if (authGuard) return authGuard;

    const { id } = await context.params;
    const body = (await request.json()) as {
      isRead?: boolean;
      isFlagged?: boolean;
      isArchived?: boolean;
    };

    const updatePayload: Database['public']['Tables']['vendor_contact_messages']['Update'] = {};

    if (typeof body.isRead === 'boolean') updatePayload.is_read = body.isRead;
    if (typeof body.isFlagged === 'boolean') updatePayload.is_flagged = body.isFlagged;
    if (typeof body.isArchived === 'boolean') updatePayload.is_archived = body.isArchived;

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ success: false, message: 'No valid fields to update' }, { status: 400 });
    }

    const supabase = await getAdminDataClient();
    const { data, error } = await supabase
      .from('vendor_contact_messages')
      .update(updatePayload)
      .eq('id', id)
      .select('id,is_read,is_flagged,is_archived,updated_at')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: {
        id: data.id,
        isRead: data.is_read,
        isFlagged: data.is_flagged,
        isArchived: data.is_archived,
        updatedAt: data.updated_at,
      },
    });
  } catch (error) {
    console.error('Error in PATCH /api/admin/messages/[id]:', error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Failed to update message';

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
