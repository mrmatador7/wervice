import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface VendorLeadRequest {
  firstName: string;
  lastName: string;
  businessName: string;
  category: string;
  city: string;
  whatsapp: string;
  email: string;
  instagram: string;
  profileStartingPrice: string;
  profileDescription: string;
  subscriptionCadence: string;
  subscriptionPriceDhs: string;
  serviceArea: string[]; // JSON string from form
  languages: string[]; // JSON string from form
  domainPerkEnabled: string;
  domainPerkRequestedDomain: string;
  domainPerkTld: string;
  source: string;
  honeypot: string;
}

// Helper function to upload file to Supabase Storage
async function uploadFileToStorage(file: File, bucket: string, folder: string, fileName: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      // If bucket doesn't exist, return null but don't fail the whole request
      if (error.message.includes('not found') || error.message.includes('does not exist')) {
        console.error(`Storage bucket '${bucket}' does not exist. Please run the storage setup SQL.`);
        return null;
      }
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('File upload error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Supabase environment variables not configured');
      return NextResponse.json(
        { error: 'Server configuration error: Supabase not properly configured' },
        { status: 500 }
      );
    }

    // Handle multipart/form-data (FormData)
    const formData = await request.formData();

    // Extract text fields
    const body: VendorLeadRequest = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      businessName: formData.get('businessName') as string,
      category: formData.get('category') as string,
      city: formData.get('city') as string,
      whatsapp: formData.get('whatsapp') as string,
      email: formData.get('email') as string,
      instagram: formData.get('instagram') as string || '',
      profileStartingPrice: formData.get('profileStartingPrice') as string || '',
      profileDescription: formData.get('profileDescription') as string,
      subscriptionCadence: formData.get('subscriptionCadence') as string,
      subscriptionPriceDhs: formData.get('subscriptionPriceDhs') as string,
      serviceArea: JSON.parse(formData.get('serviceArea') as string || '[]'),
      languages: JSON.parse(formData.get('languages') as string || '[]'),
      domainPerkEnabled: formData.get('domainPerkEnabled') as string || 'false',
      domainPerkRequestedDomain: formData.get('domainPerkRequestedDomain') as string || '',
      domainPerkTld: formData.get('domainPerkTld') as string || '.ma',
      source: formData.get('source') as string || 'vendor_subscribe_page',
      honeypot: formData.get('honeypot') as string || ''
    };

    // Validate required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'businessName',
      'category',
      'city',
      'whatsapp',
      'email',
      'profileDescription',
      'subscriptionCadence',
      'subscriptionPriceDhs'
    ];

    for (const field of requiredFields) {
      const value = (body as unknown as Record<string, string>)[field];
      if (!value || value.trim() === '') {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check for honeypot spam
    if (body.honeypot && body.honeypot.trim() !== '') {
      return NextResponse.json(
        { message: 'Application submitted successfully' },
        { status: 200 }
      );
    }

    // Handle file uploads
    let logoUrl: string | null = null;
    const galleryUrls: string[] = [];

    // Upload logo if provided
    const logoFile = formData.get('logoFile') as File;
    if (logoFile && logoFile.size > 0) {
      logoUrl = await uploadFileToStorage(logoFile, 'vendor-files', 'logos', logoFile.name);
    }

    // Upload gallery images
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('gallery_') && value instanceof File && value.size > 0) {
        const galleryUrl = await uploadFileToStorage(value, 'vendor-files', 'gallery', value.name);
        if (galleryUrl) {
          galleryUrls.push(galleryUrl);
        }
      }
    }

    // Validate that at least one gallery image is provided
    if (galleryUrls.length === 0) {
      return NextResponse.json(
        { error: 'At least one gallery image is required' },
        { status: 400 }
      );
    }

    // Prepare data for database insertion
    const vendorLeadData = {
      first_name: body.firstName,
      last_name: body.lastName,
      business_name: body.businessName,
      category: body.category,
      city: body.city,
      whatsapp: body.whatsapp,
      email: body.email.toLowerCase(),
      instagram: body.instagram,
      profile_starting_price: body.profileStartingPrice || null,
      profile_description: body.profileDescription,
      service_area: body.serviceArea,
      languages_spoken: body.languages,
      subscription_cadence: body.subscriptionCadence as 'monthly' | '6m' | 'annual',
      subscription_price_dhs: parseFloat(body.subscriptionPriceDhs) || 0,
      domain_perk_enabled: body.domainPerkEnabled === 'true',
      domain_perk_requested_domain: body.domainPerkRequestedDomain || null,
      domain_perk_tld: body.domainPerkTld as '.ma' | '.com' || null,
      logo_url: logoUrl,
      gallery_urls: galleryUrls,
      source: body.source,
      honeypot: body.honeypot,
      status: 'pending_review' as const
    };

    // Insert into database
    const { data, error } = await supabase
      .from('vendor_leads')
      .insert([vendorLeadData])
      .select('id')
      .single();

    if (error) {
      console.error('Database insertion error:', error);

      // Provide more specific error messages
      let errorMessage = 'Failed to save vendor application';
      if (error.message.includes('relation "public.vendor_leads" does not exist')) {
        errorMessage = 'Database table not found. Please run the migration to create the vendor_leads table.';
      } else if (error.message.includes('permission denied')) {
        errorMessage = 'Database permission error. Check RLS policies.';
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: error.message,
          code: error.code
        },
        { status: 500 }
      );
    }

    const leadId = data.id;

    // Log notifications (in production, integrate with actual email/Slack services)
    console.log('📧 Email notification sent to vendors@wervice.ma:', {
      subject: `New Vendor Application: ${body.businessName}`,
      content: `
New vendor application received:

Business: ${body.businessName}
Category: ${body.category}
City: ${body.city}
Contact: ${body.whatsapp} | ${body.email}
Instagram: ${body.instagram || 'Not provided'}

Subscription Plan: ${body.subscriptionCadence} (${parseFloat(body.subscriptionPriceDhs)} MAD)
Profile Starting Price: ${body.profileStartingPrice || 'Not specified'} MAD

Description: ${body.profileDescription}

Images: ${galleryUrls.length} uploaded
Logo: ${logoUrl ? 'Yes' : 'No'}

Service Areas: ${body.serviceArea.join(', ') || 'Not specified'}
Languages: ${body.languages.join(', ') || 'Not specified'}

Please review and contact the vendor to activate their subscription.
      `
    });

    console.log('💬 Slack notification sent to #vendor-leads:', {
      text: `🎉 New vendor application: ${body.businessName} (${body.category})`,
      fields: {
        business: body.businessName,
        category: body.category,
        city: body.city,
        contact: `${body.whatsapp} | ${body.email}`,
        plan: `${body.subscriptionCadence} (${parseFloat(body.subscriptionPriceDhs)} MAD)`,
        profilePrice: body.profileStartingPrice ? `${body.profileStartingPrice} MAD` : 'Not specified',
        images: galleryUrls.length,
        logo: logoUrl ? 'Yes' : 'No'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Vendor application submitted successfully',
      leadId: leadId
    });

  } catch (error) {
    console.error('Error processing vendor lead:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve leads (for success page and admin purposes)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const leadId = url.pathname.split('/').pop();

    // If we have a lead ID in the path, return that specific lead
    if (leadId && leadId !== 'route') {
      const { data: lead, error } = await supabase
        .from('vendor_leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (error || !lead) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }

      // Return only safe fields for the success page
      const safeLead = {
        id: lead.id,
        businessName: lead.business_name,
        category: lead.category,
        city: lead.city,
        whatsapp: lead.whatsapp,
        email: lead.email,
        mappedMonthlyPrice: lead.subscription_price_dhs
      };
      return NextResponse.json(safeLead);
    }

    // Otherwise return all leads for admin purposes (this should be protected in production)
    const { data: leads, error } = await supabase
      .from('vendor_leads')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      leads: leads || [],
      total: leads?.length || 0
    });
  } catch (error) {
    console.error('Error in GET endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
