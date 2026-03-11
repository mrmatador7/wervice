import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';
import type { Database } from '@/lib/database.types';

type MessageRow = Database['public']['Tables']['vendor_contact_messages']['Row'];

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

function buildSubject(row: MessageRow): string {
  const category = row.vendor_category?.trim();
  const city = row.vendor_city?.trim();
  const base = row.vendor_name?.trim() || 'Vendor inquiry';

  if (category && city) return `${base} (${category}, ${city})`;
  if (category) return `${base} (${category})`;
  if (city) return `${base} (${city})`;
  return base;
}

function buildPreview(message: string): string {
  const trimmed = (message || '').trim();
  if (!trimmed) return '';
  return trimmed.length > 140 ? `${trimmed.slice(0, 140)}...` : trimmed;
}

function normalizeKeyPart(value: string | null | undefined) {
  return (value || '').trim().toLowerCase();
}

export async function GET() {
  try {
    const authGuard = await requireAdmin();
    if (authGuard) return authGuard;

    const supabase = await getAdminDataClient();
    const { data, error } = await supabase
      .from('vendor_contact_messages')
      .select('*')
      .eq('is_archived', false)
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) {
      throw error;
    }

    const rows = (data || []) as MessageRow[];

    const vendorNames = Array.from(
      new Set(rows.map((row) => row.vendor_name?.trim()).filter((name): name is string => Boolean(name)))
    );
    const logoByVendorKey = new Map<string, string>();

    if (vendorNames.length > 0) {
      const { data: vendorRows, error: vendorError } = await supabase
        .from('vendor_leads')
        .select('business_name,city,category,logo_url')
        .in('business_name', vendorNames)
        .limit(1000);

      if (vendorError) {
        throw vendorError;
      }

      for (const vendor of vendorRows || []) {
        if (!vendor.logo_url) continue;
        const key = [
          normalizeKeyPart(vendor.business_name),
          normalizeKeyPart(vendor.city),
          normalizeKeyPart(vendor.category),
        ].join('|');
        if (!logoByVendorKey.has(key)) {
          logoByVendorKey.set(key, vendor.logo_url);
        }
      }
    }

    const messages = rows.map((row) => ({
      id: row.id,
      from: row.sender_name,
      subject: buildSubject(row),
      preview: buildPreview(row.message),
      message: row.message,
      timestamp: row.created_at,
      isRead: row.is_read,
      isFlagged: row.is_flagged,
      vendorName: row.vendor_name,
      vendorCategory: row.vendor_category,
      vendorCity: row.vendor_city,
      vendorUrl: row.vendor_url,
      vendorLogoUrl:
        logoByVendorKey.get(
          [
            normalizeKeyPart(row.vendor_name),
            normalizeKeyPart(row.vendor_city),
            normalizeKeyPart(row.vendor_category),
          ].join('|')
        ) || null,
      locale: row.locale,
      senderName: row.sender_name,
      senderPhone: row.sender_phone,
      senderAccountEmail: row.sender_account_email,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/messages:', error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Failed to fetch messages';

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
