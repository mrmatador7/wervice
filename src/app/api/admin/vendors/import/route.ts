'use server';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase-server';
// import { downloadImage, uploadToStorage } from '@/lib/supabase/storage';
import { generateUniqueSlug } from '@/lib/slug';
import { revalidateTag } from 'next/cache';
import { normalizeCategory } from '@/lib/categories';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Please upload a CSV file.' },
        { status: 400 }
      );
    }

    // Read file content
    const fileContent = await file.text();
    const lines = fileContent.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      return NextResponse.json(
        { success: false, message: 'CSV file must contain at least a header row and one data row.' },
        { status: 400 }
      );
    }

    // Simple CSV parser that handles quoted fields
    function parseCSVLine(line: string): string[] {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      let i = 0;

      while (i < line.length) {
        const char = line[i];

        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            // Escaped quote
            current += '"';
            i += 2;
          } else {
            // Toggle quote state
            inQuotes = !inQuotes;
            i++;
          }
        } else if (char === ',' && !inQuotes) {
          // Field separator
          result.push(current.trim());
          current = '';
          i++;
        } else {
          current += char;
          i++;
        }
      }

      // Add the last field
      result.push(current.trim());

      return result;
    }

    // Parse headers
    const headers = parseCSVLine(lines[0]);
    const requiredHeaders = ['business_name', 'category', 'city', 'phone'];

    // Check required headers
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required columns: ${missingHeaders.join(', ')}. Required columns are: ${requiredHeaders.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Optional image headers
    const imageHeaders = ['profile_photo', 'gallery_1', 'gallery_2', 'gallery_3', 'gallery_4', 'gallery_5', 'gallery_6', 'gallery_7', 'gallery_8', 'gallery_9', 'gallery_10'];

    // Parse data rows
    const vendors = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    let profileUploaded = 0;
    let galleryUploaded = 0;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);

        if (values.length !== headers.length) {
          errors.push(`Row ${i + 1}: Incorrect number of columns (${values.length} found, ${headers.length} expected)`);
          continue;
        }

        const vendorData: any = {};
        headers.forEach((header, index) => {
          vendorData[header] = values[index] || '';
        });

        // Collect image URLs
        const imageUrls: { profile?: string; gallery: string[] } = { gallery: [] };
        if (vendorData.profile_photo?.trim()) {
          imageUrls.profile = vendorData.profile_photo.trim();
        }
        for (let j = 1; j <= 10; j++) {
          const galleryKey = `gallery_${j}`;
          if (vendorData[galleryKey]?.trim()) {
            imageUrls.gallery.push(vendorData[galleryKey].trim());
          }
        }

        // Store image URLs for processing after vendor creation
        vendorData.imageUrls = imageUrls;

        // Validate required fields
        if (!vendorData.business_name || !vendorData.category || !vendorData.city || !vendorData.phone) {
          errors.push(`Row ${i + 1}: Missing required fields (business_name, category, city, phone)`);
          continue;
        }

        // Normalize category
        const normalizedCategory = normalizeCategory(vendorData.category);
        if (!normalizedCategory) {
          errors.push(`Row ${i + 1}: Invalid category "${vendorData.category}". Please use one of: venues, catering, photo_video, event_planner, beauty, decor, music, dresses`);
          continue;
        }
        vendorData.category = normalizedCategory;

        // Validate city
        const validCities = ['marrakech', 'casablanca', 'rabat', 'tangier', 'agadir', 'fes', 'meknes', 'elJadida', 'kenitra'];
        if (!validCities.includes(vendorData.city)) {
          errors.push(`Row ${i + 1}: Invalid city "${vendorData.city}". Valid cities: ${validCities.join(', ')}`);
          continue;
        }

        // Map plan based on category
        const categoryToPlan: Record<string, string> = {
          'venues': 'venue-planning',
          'catering': 'venue-planning',
          'photo_video': 'media-entertainment',
          'music': 'media-entertainment',
          'beauty': 'style-beauty',
          'decor': 'style-beauty',
          'event_planner': 'venue-planning',
          'dresses': 'style-beauty'
        };

        const plan = categoryToPlan[vendorData.category] || 'style-beauty';

        // Map plan to price
        const planPricing = {
          'style-beauty': 200,
          'media-entertainment': 250,
          'venue-planning': 350
        };
        const subscriptionPrice = planPricing[plan as keyof typeof planPricing] || 200;

        // Prepare vendor data for database
        const vendorPayload = {
          first_name: 'Admin', // Default first name
          last_name: 'Import', // Default last name
          business_name: vendorData.business_name,
          category: vendorData.category,
          city: vendorData.city,
          whatsapp: vendorData.phone,
          email: vendorData.email || null,
          profile_description: vendorData.description || 'No description provided',
          subscription_cadence: 'monthly' as const,
          subscription_price_dhs: subscriptionPrice,
          logo_url: '',
          gallery_urls: [],
          service_area: [vendorData.city],
          languages_spoken: ['en'],
          source: 'admin_csv_import',
          imageUrls: vendorData.imageUrls // Store for later processing
        };

        vendors.push(vendorPayload);

      } catch (error) {
        errors.push(`Row ${i + 1}: Failed to parse - ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (vendors.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No valid vendors found to import',
          total: lines.length - 1,
          successful: 0,
          failed: lines.length - 1,
          errors
        },
        { status: 400 }
      );
    }

    // Create Supabase client
    const cookieStore = await cookies();
    const supabase = await createClient();

    // Insert vendors one by one to handle image uploads
    let successful = 0;
    let failed = 0;
    const batchErrors: string[] = [];

    for (let i = 0; i < vendors.length; i++) {
      const vendorData = vendors[i];
      const imageUrls = vendorData.imageUrls;
      delete vendorData.imageUrls; // Remove from payload

      try {
        // Insert vendor
        const { data: insertedVendor, error: vendorError } = await supabase
          .from('vendor_leads')
          .insert([vendorData])
          .select()
          .single();

        if (vendorError) {
          failed++;
          batchErrors.push(`Vendor ${i + 1} (${vendorData.business_name}): ${vendorError.message}`);
          continue;
        }

        const vendorId = insertedVendor.id;
        successful++;

        // Also insert into public.vendors table
        const slug = await generateUniqueSlug(vendorData.business_name);

        // Map plan to tier
        const planTierMap = {
          'style-beauty': 'styleBeauty',
          'media-entertainment': 'mediaEntertainment',
          'venue-planning': 'venuePlanning'
        };
        const planTier = planTierMap[vendorData.subscription_price_dhs === 200 ? 'style-beauty' :
                                       vendorData.subscription_price_dhs === 250 ? 'media-entertainment' :
                                       'venue-planning'] || 'styleBeauty';

        // Collect gallery URLs for public vendor
        let galleryUrls: string[] = [];
        if (imageUrls.gallery.length > 0) {
          for (let j = 0; j < Math.min(imageUrls.gallery.length, 10); j++) {
            const galleryUrl = imageUrls.gallery[j];
            try {
              // TODO: Implement image download and upload functionality
              // const imageData = await downloadImage(galleryUrl);
              // if (imageData) {
              //   const path = `vendors/${vendorId}/gallery/${j + 1}.${imageData.extension}`;
              //   const uploadResult = await uploadToStorage(imageData.buffer, path, imageData.contentType);
              //
              //   if (uploadResult.success && uploadResult.url) {
              //     galleryUrls.push(uploadResult.url);
              //     galleryUploaded++;
              //   } else {
              //     warnings.push(`Row ${i + 1} (${vendorData.business_name}): Failed to upload gallery image ${j + 1} - ${uploadResult.error}`);
              //   }
              // }
              warnings.push(`Row ${i + 1} (${vendorData.business_name}): Gallery image upload not implemented yet`);
            } catch (error) {
              warnings.push(`Row ${i + 1} (${vendorData.business_name}): Gallery image ${j + 1} error - ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          }
        }

        const publicVendorPayload = {
          slug,
          name: vendorData.business_name,
          category: vendorData.category.toLowerCase(),
          city: vendorData.city.toLowerCase(),
          phone: vendorData.whatsapp,
          email: vendorData.email || null,
          description: vendorData.profile_description || null,
          profile_photo_url: null, // Will be updated after profile image upload
          gallery_urls: galleryUrls.length > 0 ? galleryUrls : null,
          plan_tier: planTier,
          rating: 0,
          published: true
        };

        // TODO: Implement insertion into public vendors table
        // const { error: publicError } = await supabase
        //   .from("vendors")
        //   .insert([publicVendorPayload]);
        //
        // if (publicError) {
        //   console.error('Failed to insert into public vendors:', publicError);
        //   // Don't fail the whole import, just log the error
        // }

        // Process images
        if (imageUrls.profile) {
          try {
            // TODO: Implement image download and upload functionality
            // const imageData = await downloadImage(imageUrls.profile);
            // if (imageData) {
            //   const path = `vendors/${vendorId}/profile.${imageData.extension}`;
            //   const uploadResult = await uploadToStorage(imageData.buffer, path, imageData.contentType);
            //
            //   if (uploadResult.success && uploadResult.url) {
            //     // Update vendor with profile photo URL
            //     await supabase
            //       .from('vendor_leads')
            //       .update({ logo_url: uploadResult.url })
            //       .eq('id', vendorId);
            //
            //     // Also update public vendor
            //     await supabase
            //       .from('vendors')
            //       .update({ profile_photo_url: uploadResult.url })
            //       .eq('slug', slug);
            //
            //     profileUploaded++;
            //   } else {
            //     warnings.push(`Row ${i + 1} (${vendorData.business_name}): Failed to upload profile photo - ${uploadResult.error}`);
            //   }
            // } else {
            //   warnings.push(`Row ${i + 1} (${vendorData.business_name}): Failed to download profile photo from ${imageUrls.profile}`);
            // }
            warnings.push(`Row ${i + 1} (${vendorData.business_name}): Profile photo upload not implemented yet`);
          } catch (error) {
            warnings.push(`Row ${i + 1} (${vendorData.business_name}): Profile photo error - ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }


      } catch (error) {
        failed++;
        batchErrors.push(`Vendor ${i + 1} (${vendorData.business_name}): ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Combine errors
    const allErrors = [...errors, ...batchErrors];

    // Revalidate the vendors cache if any vendors were successfully imported
    if (successful > 0) {
      revalidateTag('vendors');
    }

    return NextResponse.json({
      success: successful > 0,
      message: successful > 0 ? `Successfully imported ${successful} vendors` : 'Import failed',
      total: vendors.length,
      successful,
      failed: vendors.length - successful,
      profileUploaded,
      galleryUploaded,
      errors: allErrors,
      warnings
    });

  } catch (error) {
    console.error('Error importing vendors:', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Import failed',
        total: 0,
        successful: 0,
        failed: 1,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      },
      { status: 500 }
    );
  }
}
