'use server';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';
import { generateUniqueSlug } from '@/lib/slug';
import { revalidateTag } from 'next/cache';
import { normalizeCategory } from '@/lib/categories';

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

async function getVendorSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey) {
    return createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  return createServerClient();
}

export async function GET() {
  try {
    const authGuard = await requireAdmin();
    if (authGuard) return authGuard;
    const supabase = await getVendorSupabaseClient();

    // Read from vendor_leads (where imports and admin-managed vendors live)
    const { data: leadsRows, error } = await supabase
      .from('vendor_leads')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      throw error;
    }

    const rows = leadsRows ?? [];
    const transformedVendors = rows.map((row: Record<string, unknown>) => {
      const planPrice = Number(row.subscription_price_dhs ?? 0);
      const plan = planPrice >= 350 ? 'venue-planning' : planPrice >= 250 ? 'media-entertainment' : 'style-beauty';
      const profilePhotoUrl = (row.logo_url ?? '') as string;
      const galleryUrls = (row.gallery_urls ?? []) as string[];
      const published = Boolean(row.published);
      const status = (row.status as string) || 'pending';
      return {
        id: (row.id ?? '') as string,
        name: (row.business_name ?? 'Unnamed') as string,
        slug: (row.slug ?? '') as string,
        city: (row.city ?? '') as string,
        category: (row.category ?? '') as string,
        subcategory: (row.subcategory ?? '') as string,
        status: status === 'approved' ? 'active' : status === 'rejected' ? 'inactive' : status,
        plan,
        planPrice,
        profilePhotoUrl: profilePhotoUrl || '',
        galleryPhotoUrls: Array.isArray(galleryUrls) ? galleryUrls : [],
        email: (row.email ?? '') as string,
        phone: (row.whatsapp ?? row.phone ?? '') as string,
        startingPrice: Number(row.profile_starting_price ?? 0) || 0,
        description: (row.profile_description ?? row.description ?? '') as string,
        published,
        createdAt: (row.submitted_at ?? row.created_at ?? new Date().toISOString()) as string,
        updatedAt: (row.updated_at ?? row.created_at ?? '') as string,
      };
    });

    return NextResponse.json({
      success: true,
      vendors: transformedVendors,
    });

  } catch (error) {
    console.error('Error fetching vendors:', error);
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Supabase error code:', (error as { code?: string }).code);
    }
    // Supabase and other libs often return plain objects with .message, not Error instances
    const err = error as { message?: string; details?: string; code?: string };
    const message =
      typeof err?.message === 'string'
        ? err.message
        : error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'Failed to fetch vendors';
    return NextResponse.json(
      {
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && err?.code && { code: err.code, details: err.details })
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authGuard = await requireAdmin();
    if (authGuard) return authGuard;

    // Check if request has files (multipart/form-data) or is JSON
    const contentType = request.headers.get('content-type') || '';

    let formData: FormData;
    let firstName: string, lastName: string, businessName: string, category: string, city: string, email: string, phone: string, plan: string, description: string;
    let profilePhoto: File | null = null;
    let galleryPhotos: File[] = [];

    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (with files)
      formData = await request.formData();

      firstName = formData.get('firstName') as string || 'Unknown';
      lastName = formData.get('lastName') as string || 'Unknown';
      businessName = formData.get('businessName') as string;
      category = formData.get('category') as string;
      city = formData.get('city') as string;

      // Normalize category
      const normalizedCategory = normalizeCategory(category);
      if (!normalizedCategory) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid category provided'
          },
          { status: 400 }
        );
      }
      category = normalizedCategory;
      email = formData.get('email') as string || '';
      phone = formData.get('phone') as string;
      plan = formData.get('plan') as string;
      description = formData.get('description') as string || '';

      profilePhoto = formData.get('profilePhoto') as File || null;
      galleryPhotos = formData.getAll('galleryPhotos') as File[] || [];
    } else {
      // Handle JSON (no files)
      const body = await request.json();

      firstName = body.firstName || 'Unknown';
      lastName = body.lastName || 'Unknown';
      businessName = body.businessName;
      category = body.category;
      city = body.city;

      // Normalize category
      const normalizedCategory = normalizeCategory(category);
      if (!normalizedCategory) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid category provided'
          },
          { status: 400 }
        );
      }
      category = normalizedCategory;
      email = body.email || '';
      phone = body.phone;
      plan = body.plan;
      description = body.description || '';

      profilePhoto = null;
      galleryPhotos = [];
    }

    // Validate required fields
    if (!businessName || !category || !city || !phone || !plan) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please fill in all required fields: business name, category, city, plan, and phone'
        },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await getVendorSupabaseClient();

    // Map plan to price
    const planPricing = {
      'style-beauty': 200,
      'media-entertainment': 250,
      'venue-planning': 350
    };
    const subscriptionPrice = planPricing[plan as keyof typeof planPricing] || 200;

    // Handle file uploads if files are provided
    let logoUrl = '';
    let galleryUrls: string[] = [];

    if (profilePhoto && profilePhoto instanceof File) {
      const profileFileName = `vendor_${Date.now()}_profile_${profilePhoto.name}`;
      const { data: profileUpload, error: profileError } = await supabase.storage
        .from('vendor-files')
        .upload(profileFileName, profilePhoto);

      if (profileError) {
        throw new Error(`Failed to upload profile photo: ${profileError.message}`);
      }

      const { data: profileUrl } = supabase.storage
        .from('vendor-files')
        .getPublicUrl(profileFileName);

      logoUrl = profileUrl.publicUrl;
    }

    if (galleryPhotos && galleryPhotos.length > 0) {
      for (const [index, photo] of galleryPhotos.entries()) {
        if (photo instanceof File) {
          const galleryFileName = `vendor_${Date.now()}_gallery_${index}_${photo.name}`;
          const { data: galleryUpload, error: galleryError } = await supabase.storage
            .from('vendor-files')
            .upload(galleryFileName, photo);

          if (galleryError) {
            throw new Error(`Failed to upload gallery photo ${index + 1}: ${galleryError.message}`);
          }

          const { data: galleryUrl } = supabase.storage
            .from('vendor-files')
            .getPublicUrl(galleryFileName);

          galleryUrls.push(galleryUrl.publicUrl);
        }
      }
    }

    // Prepare payload for vendor_leads table
    const payload = {
      first_name: firstName,
      last_name: lastName,
      business_name: businessName,
      category,
      city,
      whatsapp: phone,
      email: email || 'no-email@example.com', // Provide a default email if empty
      profile_description: description || null,
      subscription_cadence: 'monthly' as const,
      subscription_price_dhs: subscriptionPrice,
      logo_url: logoUrl,
      gallery_urls: galleryUrls,
      service_area: [city], // Default to selected city
      languages_spoken: ['en'], // Default
      source: 'admin_dashboard'
    };

    // Insert into vendor_leads table
    const { data, error } = await supabase.from("vendor_leads").insert([payload]);
    console.log("Insert result", { data, error });

    if (error) {
      throw new Error(error.message);
    }

    // Also insert into public.vendors table
    const slug = await generateUniqueSlug(businessName);

    // Map plan to tier
    const planTierMap = {
      'style-beauty': 'styleBeauty',
      'media-entertainment': 'mediaEntertainment',
      'venue-planning': 'venuePlanning'
    };
    const planTier = planTierMap[plan as keyof typeof planTierMap] || 'styleBeauty';

    // Minimal payload to match existing table schema
    const publicVendorPayload = {
      category: category.toLowerCase(),
      city: city.toLowerCase(),
      phone,
      email: email || null,
      description: description || null,
      profile_photo_url: logoUrl || null
    };

    // TODO: Implement insertion into public vendors table
    // const { data: publicData, error: publicError } = await supabase
    //   .from("vendors")
    //   .insert([publicVendorPayload])
    //   .select();

    // if (publicError) {
    //   console.error('Failed to insert into public vendors:', publicError);
    //   console.error('Public vendor payload:', publicVendorPayload);
    //   // Return error in response
    //   return NextResponse.json({
    //     success: false,
    //     message: 'Vendor created in admin, but failed to publish to public site',
    //     vendor: payload,
    //     publicError: publicError.message
    //   }, { status: 500 });
    // } else {
    //   console.log('Successfully inserted into public vendors:', publicData);
    // }

    // Revalidate the vendors cache
    revalidateTag('vendors');

    return NextResponse.json({
      success: true,
      message: 'Vendor created successfully',
      vendor: payload
    });

  } catch (error) {
    console.error('Error creating vendor:', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create vendor'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authGuard = await requireAdmin();
    if (authGuard) return authGuard;

    // Check if request has files (multipart/form-data)
    const contentType = request.headers.get('content-type') || '';

    let formData: FormData;
    let id: string, businessName: string, category: string, city: string, email: string, phone: string, plan: string, description: string;
    let profilePhoto: File | null = null;
    let galleryPhotos: File[] = [];

    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (with files)
      formData = await request.formData();

      id = formData.get('id') as string;
      businessName = formData.get('businessName') as string;
      category = formData.get('category') as string;
      city = formData.get('city') as string;

      // Normalize category
      const normalizedCategory = normalizeCategory(category);
      if (!normalizedCategory) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid category provided'
          },
          { status: 400 }
        );
      }
      category = normalizedCategory;
      email = formData.get('email') as string || '';
      phone = formData.get('phone') as string;
      plan = formData.get('plan') as string;
      description = formData.get('description') as string || '';

      profilePhoto = formData.get('profilePhoto') as File || null;
      galleryPhotos = formData.getAll('galleryPhotos') as File[] || [];
    } else {
      // Handle JSON (no files)
      const body = await request.json();

      id = body.id;
      businessName = body.businessName;
      category = body.category;
      city = body.city;

      // Normalize category
      const normalizedCategory = normalizeCategory(category);
      if (!normalizedCategory) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid category provided'
          },
          { status: 400 }
        );
      }
      category = normalizedCategory;
      email = body.email || '';
      phone = body.phone;
      plan = body.plan;
      description = body.description || '';

      profilePhoto = null;
      galleryPhotos = [];
    }

    // Validate required fields
    if (!id || !businessName || !category || !city || !phone || !plan) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please fill in all required fields: business name, category, city, plan, and phone'
        },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await getVendorSupabaseClient();

    // Map plan to price
    const planPricing = {
      'style-beauty': 200,
      'media-entertainment': 250,
      'venue-planning': 350
    };
    const subscriptionPrice = planPricing[plan as keyof typeof planPricing] || 200;

    // Handle file uploads if files are provided
    let logoUrl = '';
    let galleryUrls: string[] = [];

    if (profilePhoto && profilePhoto instanceof File) {
      const profileFileName = `vendor_${Date.now()}_profile_${profilePhoto.name}`;
      const { data: profileUpload, error: profileError } = await supabase.storage
        .from('vendor-files')
        .upload(profileFileName, profilePhoto);

      if (profileError) {
        throw new Error(`Failed to upload profile photo: ${profileError.message}`);
      }

      const { data: profileUrl } = supabase.storage
        .from('vendor-files')
        .getPublicUrl(profileFileName);

      logoUrl = profileUrl.publicUrl;
    }

    if (galleryPhotos && galleryPhotos.length > 0) {
      for (const [index, photo] of galleryPhotos.entries()) {
        if (photo instanceof File) {
          const galleryFileName = `vendor_${Date.now()}_gallery_${index}_${photo.name}`;
          const { data: galleryUpload, error: galleryError } = await supabase.storage
            .from('vendor-files')
            .upload(galleryFileName, photo);

          if (galleryError) {
            throw new Error(`Failed to upload gallery photo ${index + 1}: ${galleryError.message}`);
          }

          const { data: galleryUrl } = supabase.storage
            .from('vendor-files')
            .getPublicUrl(galleryFileName);

          galleryUrls.push(galleryUrl.publicUrl);
        }
      }
    }

    // Prepare payload for vendor_leads table update
    const payload: any = {
      business_name: businessName,
      category,
      city,
      whatsapp: phone,
      email: email || 'no-email@example.com', // Provide a default email if empty
      profile_description: description,
      subscription_cadence: 'monthly' as const,
      subscription_price_dhs: subscriptionPrice,
      service_area: [city], // Default to selected city
      languages_spoken: ['en'], // Default
    };

    // Only update logo_url and gallery_urls if new files were uploaded
    if (logoUrl) {
      payload.logo_url = logoUrl;
    }
    if (galleryUrls.length > 0) {
      payload.gallery_urls = galleryUrls;
    }

    // Update the vendor_leads table
    const { data, error } = await supabase
      .from("vendor_leads")
      .update(payload)
      .eq('id', id)
      .select();

    console.log("Update result", { data, error });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Vendor updated successfully',
      vendor: data?.[0] || payload
    });

  } catch (error) {
    console.error('Error updating vendor:', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update vendor'
      },
      { status: 500 }
    );
  }
}
