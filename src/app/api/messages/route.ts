import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';
import type { Database } from '@/lib/database.types';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createSupabaseClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function normalizeKeyPart(value: string | null | undefined) {
  return (value || '').trim().toLowerCase();
}

export async function GET() {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = user.email?.trim().toLowerCase();
    const service = getServiceClient();
    if (!service) {
      return NextResponse.json({ success: false, message: 'Server not configured' }, { status: 500 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('phone')
      .eq('id', user.id)
      .maybeSingle();

    const profilePhone = String(profile?.phone || '').trim();

    const allRows = new Map<
      string,
      {
        id: string;
        vendor_name: string;
        vendor_category: string | null;
        vendor_city: string | null;
        vendor_url: string | null;
        message: string;
        is_read: boolean;
        is_flagged: boolean;
        created_at: string;
        updated_at: string;
      }
    >();

    if (userEmail) {
      const { data: emailRows, error: emailError } = await service
        .from('vendor_contact_messages')
        .select('id,vendor_name,vendor_category,vendor_city,vendor_url,message,is_read,is_flagged,created_at,updated_at')
        .ilike('sender_account_email', userEmail)
        .eq('is_archived', false)
        .order('created_at', { ascending: false })
        .limit(100);

      if (emailError) {
        throw emailError;
      }

      for (const row of emailRows || []) {
        allRows.set(row.id, row);
      }
    }

    if (profilePhone) {
      const { data: phoneRows, error: phoneError } = await service
        .from('vendor_contact_messages')
        .select('id,vendor_name,vendor_category,vendor_city,vendor_url,message,is_read,is_flagged,created_at,updated_at')
        .eq('sender_phone', profilePhone)
        .eq('is_archived', false)
        .order('created_at', { ascending: false })
        .limit(100);

      if (phoneError) {
        throw phoneError;
      }

      for (const row of phoneRows || []) {
        allRows.set(row.id, row);
      }

      const digitsOnly = profilePhone.replace(/[^\d]/g, '');
      const suffix = digitsOnly.length >= 9 ? digitsOnly.slice(-9) : '';
      if (suffix) {
        const { data: loosePhoneRows, error: loosePhoneError } = await service
          .from('vendor_contact_messages')
          .select('id,vendor_name,vendor_category,vendor_city,vendor_url,message,is_read,is_flagged,created_at,updated_at')
          .ilike('sender_phone', `%${suffix}%`)
          .eq('is_archived', false)
          .order('created_at', { ascending: false })
          .limit(100);

        if (loosePhoneError) {
          throw loosePhoneError;
        }

        for (const row of loosePhoneRows || []) {
          allRows.set(row.id, row);
        }
      }
    }

    const sortedRows = Array.from(allRows.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const vendorNames = Array.from(
      new Set(
        sortedRows
          .map((row) => row.vendor_name?.trim())
          .filter((name): name is string => Boolean(name))
      )
    );

    const logoByVendorKey = new Map<string, string>();
    if (vendorNames.length > 0) {
      const { data: vendorRows, error: vendorError } = await service
        .from('vendor_leads')
        .select('business_name,city,category,logo_url')
        .in('business_name', vendorNames)
        .limit(500);

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

    const messages = sortedRows.map((row) => ({
      vendorLogoUrl:
        logoByVendorKey.get(
          [
            normalizeKeyPart(row.vendor_name),
            normalizeKeyPart(row.vendor_city),
            normalizeKeyPart(row.vendor_category),
          ].join('|')
        ) || null,
      id: row.id,
      vendorName: row.vendor_name,
      vendorCategory: row.vendor_category,
      vendorCity: row.vendor_city,
      vendorUrl: row.vendor_url,
      message: row.message,
      isRead: row.is_read,
      isFlagged: row.is_flagged,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Error in GET /api/messages:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch messages' }, { status: 500 });
  }
}
