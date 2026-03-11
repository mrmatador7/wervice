import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';
import type { Database } from '@/lib/database.types';

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contact@wervice.com';
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'Wervice <noreply@wervice.com>';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createServiceSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) return null;

  return createSupabaseClient<Database>(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(request: Request) {
  try {
    const authSupabase = await createServerClient();
    const {
      data: { user },
    } = await authSupabase.auth.getUser();

    const body = (await request.json()) as {
      vendorName?: string;
      vendorCategory?: string;
      vendorCity?: string;
      vendorUrl?: string;
      locale?: string;
      senderName?: string;
      senderPhone?: string;
      senderAccountEmail?: string;
      message?: string;
    };

    const vendorName = (body.vendorName || '').trim();
    const vendorCategory = (body.vendorCategory || '').trim();
    const vendorCity = (body.vendorCity || '').trim();
    const vendorUrl = (body.vendorUrl || '').trim();
    const locale = (body.locale || 'en').trim();
    const senderName = (body.senderName || '').trim();
    const senderPhone = (body.senderPhone || '').trim();
    const senderAccountEmail = (body.senderAccountEmail || '').trim().toLowerCase();
    const authUserEmail = (user?.email || '').trim().toLowerCase();
    const resolvedSenderAccountEmail = senderAccountEmail || authUserEmail;
    const message = (body.message || '').trim();

    if (!vendorName || !senderName || !senderPhone || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServiceSupabaseClient();
    if (!supabase) {
      console.error('vendor-contact API error: missing Supabase service credentials');
      return NextResponse.json({ error: 'Messaging service is not configured' }, { status: 500 });
    }

    const { data: insertedMessage, error: insertError } = await supabase
      .from('vendor_contact_messages')
      .insert({
        vendor_name: vendorName,
        vendor_category: vendorCategory || null,
        vendor_city: vendorCity || null,
        vendor_url: vendorUrl || null,
        locale,
        sender_name: senderName,
        sender_phone: senderPhone,
        sender_account_email: resolvedSenderAccountEmail || null,
        message,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('vendor-contact insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    let emailSent = false;

    if (resendApiKey) {
      const safeVendorName = escapeHtml(vendorName);
      const safeVendorCategory = escapeHtml(vendorCategory);
      const safeVendorCity = escapeHtml(vendorCity);
      const safeVendorUrl = escapeHtml(vendorUrl);
      const safeLocale = escapeHtml(locale);
      const safeSenderName = escapeHtml(senderName);
      const safeSenderPhone = escapeHtml(senderPhone);
      const safeSenderAccountEmail = escapeHtml(resolvedSenderAccountEmail);
      const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

      const subject = `Vendor message: ${vendorName} from ${senderName}`;

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [CONTACT_EMAIL],
          subject,
          html: `
            <h2>New vendor inquiry</h2>
            <p><strong>Vendor:</strong> ${safeVendorName}</p>
            <p><strong>Category:</strong> ${safeVendorCategory}</p>
            <p><strong>City:</strong> ${safeVendorCity}</p>
            <p><strong>Vendor URL:</strong> <a href="${safeVendorUrl}">${safeVendorUrl}</a></p>
            <p><strong>Locale:</strong> ${safeLocale}</p>
            <hr/>
            <p><strong>From:</strong> ${safeSenderName}</p>
            <p><strong>Phone:</strong> ${safeSenderPhone}</p>
            <p><strong>Account Email:</strong> ${safeSenderAccountEmail || 'N/A'}</p>
            <p><strong>Message:</strong><br/>${safeMessage}</p>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const detail = await emailResponse.text();
        console.error('Resend error:', detail);
      } else {
        emailSent = true;
      }
    }

    return NextResponse.json({
      success: true,
      messageId: insertedMessage.id,
      emailSent,
    });
  } catch (error) {
    console.error('vendor-contact API error:', error);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
