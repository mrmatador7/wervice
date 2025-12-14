'use server';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase-server';
import { downloadAndUploadImage, findVendorImagesInFolder, findVendorMediaInFolder, getGoogleDriveFolderId, isGoogleDriveApiConfigured } from '@/lib/supabase/image-utils';
import { generateUniqueSlug } from '@/lib/slug';
import { revalidateTag } from 'next/cache';
import { normalizeCategory } from '@/lib/categories';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folderLink = formData.get('folderLink') as string | null;

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
    
    // Support both formats: user-friendly names and internal names
    const headerMapping: { [key: string]: string[] } = {
      'business_name': ['business_name', 'Vendor', 'vendor'],
      'category': ['category', 'Category'],
      'city': ['city', 'City'],
      'phone': ['phone', 'Phone']
    };

    // Check required headers (accept any format)
    const missingHeaders: string[] = [];
    Object.keys(headerMapping).forEach(requiredField => {
      const possibleNames = headerMapping[requiredField];
      const found = headers.some(header => possibleNames.includes(header));
      if (!found) {
        missingHeaders.push(requiredField);
      }
    });

    if (missingHeaders.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required columns: ${missingHeaders.join(', ')}. Required columns are: Vendor (or business_name), Category, City, Phone`
        },
        { status: 400 }
      );
    }

    // Optional image headers
    const imageHeaders = ['profile_photo', 'gallery_1', 'gallery_2', 'gallery_3', 'gallery_4', 'gallery_5', 'gallery_6', 'gallery_7', 'gallery_8', 'gallery_9', 'gallery_10'];

    // Create Supabase client early for category/city operations
    const cookieStore = await cookies();
    const supabase = await createClient();

    // Parse data rows
    const vendors = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    let profileUploaded = 0;
    let galleryUploaded = 0;
    const totalRows = lines.length - 1; // Total data rows (excluding header)

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

        // Map user-friendly column names to internal field names
        // Support both formats: "Vendor" or "business_name", etc.
        const fieldMapping: { [key: string]: string } = {
          'Vendor': 'business_name',
          'vendor': 'business_name',
          'Category': 'category',
          'category': 'category',
          'City': 'city',
          'city': 'city',
          'Phone': 'phone',
          'phone': 'phone',
          'Email': 'email',
          'email': 'email',
          'Description': 'description',
          'description': 'description',
          'IG': 'instagram',
          'ig': 'instagram',
          'Instagram': 'instagram',
          'instagram': 'instagram',
          'Google Maps': 'google_maps',
          'google_maps': 'google_maps',
          'GoogleMaps': 'google_maps'
        };

        // Create normalized vendor data with mapped field names
        const normalizedData: any = {};
        Object.keys(vendorData).forEach(key => {
          const normalizedKey = fieldMapping[key] || key.toLowerCase();
          normalizedData[normalizedKey] = vendorData[key];
        });

        // Copy mapped data back to vendorData
        Object.assign(vendorData, normalizedData);

        // Collect image URLs and video
        const imageUrls: { profile?: string; gallery: string[]; folderLink?: string; video?: string } = { gallery: [] };
        
        // Check for folder_link column (vendor-specific folder)
        if (vendorData.folder_link?.trim()) {
          imageUrls.folderLink = vendorData.folder_link.trim();
        } else if (folderLink) {
          // Use base folder link if provided
          imageUrls.folderLink = folderLink;
        }
        
        // Use explicit image URLs if provided (takes precedence over folder)
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

        // Validate required fields (after mapping)
        const missingFields: string[] = [];
        if (!vendorData.business_name?.trim()) missingFields.push('Vendor/business_name');
        if (!vendorData.category?.trim()) missingFields.push('Category');
        if (!vendorData.city?.trim()) missingFields.push('City');
        if (!vendorData.phone?.trim()) missingFields.push('Phone');
        
        if (missingFields.length > 0) {
          errors.push(`Row ${i + 1}: Missing required fields: ${missingFields.join(', ')}`);
          continue;
        }

        // Normalize category (handle user-friendly names like "Caterer", "Venue", etc.)
        const categoryMapping: { [key: string]: string } = {
          'Caterer': 'catering',
          'caterer': 'catering',
          'Catering': 'catering',
          'Venue': 'venues',
          'venue': 'venues',
          'Venues': 'venues',
          'Photographer': 'photo_video',
          'photographer': 'photo_video',
          'Photo & Video': 'photo_video',
          'Photo and Video': 'photo_video',
          'Event Planner': 'event_planner',
          'event planner': 'event_planner',
          'Event Planning': 'event_planner',
          'Beauty': 'beauty',
          'beauty': 'beauty',
          'Decor': 'decor',
          'decor': 'decor',
          'Music': 'music',
          'music': 'music',
          'Dresses': 'dresses',
          'dresses': 'dresses',
          'Negafa': 'beauty',
          'negafa': 'beauty',
          'Spa': 'beauty',
          'spa': 'beauty',
          'Artist': 'music',
          'artist': 'music'
        };

        let categoryToNormalize = vendorData.category.trim();
        if (categoryMapping[categoryToNormalize]) {
          categoryToNormalize = categoryMapping[categoryToNormalize];
        }

        // Try to normalize category first
        let normalizedCategory = normalizeCategory(categoryToNormalize);
        
        // If category doesn't exist in the mapping, create it automatically in the database
        if (!normalizedCategory) {
          // Generate slug from category name
          const categorySlug = categoryToNormalize
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
          
          // Check if category already exists in database
          const { data: existingCategory } = await supabase
            .from('categories')
            .select('slug')
            .eq('slug', categorySlug)
            .maybeSingle();
          
          if (!existingCategory) {
            // Create new category
            const { error: categoryError } = await supabase
              .from('categories')
              .insert({
                name: vendorData.category.trim(), // Use original name from CSV
                slug: categorySlug,
                image: '/placeholder-category.jpg', // Default placeholder
                description: `Category for ${vendorData.category}`,
                is_active: true,
                is_featured: false
              });
            
            if (categoryError) {
              warnings.push(`Row ${i + 1}: Failed to create category "${vendorData.category}": ${categoryError.message}. Using slug: ${categorySlug}`);
            } else {
              warnings.push(`Row ${i + 1}: Auto-created new category "${vendorData.category}" (slug: ${categorySlug})`);
            }
          }
          
          // Use the slug as the category
          normalizedCategory = categorySlug as any;
        }
        
        vendorData.category = normalizedCategory;

        // Normalize city (accept any city, just normalize the format)
        const cityMapping: { [key: string]: string } = {
          'Fes': 'Fes',
          'Meknes': 'Meknes',
          'Casablanca': 'Casablanca',
          'Marrakech': 'Marrakech',
          'Rabat': 'Rabat',
          'Tangier': 'Tangier',
          'Agadir': 'Agadir',
          'El Jadida': 'El Jadida',
          'ElJadida': 'El Jadida',
          'Kenitra': 'Kenitra',
          'Bouskoura': 'Casablanca', // Map Bouskoura to Casablanca
          'fes': 'Fes',
          'meknes': 'Meknes',
          'casablanca': 'Casablanca',
          'marrakech': 'Marrakech',
          'rabat': 'Rabat',
          'tangier': 'Tangier',
          'agadir': 'Agadir',
          'eljadida': 'El Jadida',
          'elJadida': 'El Jadida',
          'kenitra': 'Kenitra',
          'bouskoura': 'Casablanca'
        };

        let cityToNormalize = vendorData.city.trim();
        
        // Check mapping first
        if (cityMapping[cityToNormalize]) {
          cityToNormalize = cityMapping[cityToNormalize];
        } else {
          // Auto-normalize: capitalize first letter of each word
          cityToNormalize = cityToNormalize
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          // Log that we're accepting a new city
          warnings.push(`Row ${i + 1}: Auto-accepted new city "${cityToNormalize}" (original: "${vendorData.city}")`);
        }
        
        vendorData.city = cityToNormalize;

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
          whatsapp: vendorData.phone.trim(),
          email: vendorData.email?.trim() || null,
          instagram: vendorData.instagram?.trim() || null,
          profile_description: vendorData.description?.trim() || 'No description provided',
          subscription_cadence: 'monthly' as const,
          subscription_price_dhs: subscriptionPrice,
          logo_url: '',
          gallery_urls: [],
          service_area: [vendorData.city],
          languages_spoken: ['en'],
          source: 'admin_csv_import',
          status: 'approved', // Set as approved (not pending_review) - valid values: 'pending_review', 'approved', 'rejected', 'contacted'
          published: true, // Automatically publish imported vendors
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

    // Supabase client already created above for category operations
    // Insert vendors one by one to handle image uploads
    let successful = 0;
    let failed = 0;
    const batchErrors: string[] = [];

    for (let i = 0; i < vendors.length; i++) {
      const vendorData = vendors[i];
      const imageUrls = vendorData.imageUrls;
      delete vendorData.imageUrls; // Remove from payload

      try {
        // Generate slug before inserting
        const slug = await generateUniqueSlug(vendorData.business_name);
        
        // Add slug to vendor payload
        vendorData.slug = slug;
        
        // Insert vendor with slug included
        const { data: insertedVendor, error: vendorError } = await supabase
          .from('vendor_leads')
          .insert([vendorData])
          .select()
          .single();

        if (vendorError) {
          failed++;
          // Provide more detailed error messages
          let errorMessage = vendorError.message;
          
          // Check for common database errors
          if (vendorError.message.includes('duplicate key') || vendorError.message.includes('unique constraint')) {
            errorMessage = `Vendor with this business name already exists in the database`;
          } else if (vendorError.message.includes('violates foreign key')) {
            errorMessage = `Invalid reference (category, city, or other field doesn't exist)`;
          } else if (vendorError.message.includes('null value')) {
            errorMessage = `Missing required field: ${vendorError.message.match(/column "(\w+)"/)?.[1] || 'unknown field'}`;
          }
          
          batchErrors.push(`Row ${i + 1} - "${vendorData.business_name}": ${errorMessage}`);
          continue;
        }

        const vendorId = insertedVendor.id;
        successful++;

        // Process folder link FIRST if provided (before uploading images)
        if (imageUrls.folderLink && (!imageUrls.profile || imageUrls.gallery.length === 0)) {
          try {
            const folderId = getGoogleDriveFolderId(imageUrls.folderLink);
            if (folderId) {
              const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
              
              if (apiKey && isGoogleDriveApiConfigured()) {
                // Use Google Drive API to fetch images and videos from folder
                const folderMedia = await findVendorMediaInFolder(folderId, apiKey);
                
                // First image becomes profile photo if not already set
                if (folderMedia.profile && !imageUrls.profile) {
                  imageUrls.profile = folderMedia.profile;
                }
                // Add folder images to gallery if gallery is empty
                if (folderMedia.gallery.length > 0 && imageUrls.gallery.length === 0) {
                  imageUrls.gallery = folderMedia.gallery;
                }
                // Set video if found
                if (folderMedia.video && !imageUrls.video) {
                  imageUrls.video = folderMedia.video;
                }
              } else {
                warnings.push(`Row ${i + 1} (${vendorData.business_name}): Folder link provided but Google Drive API is not configured. Please add GOOGLE_DRIVE_API_KEY to your .env.local file, or provide individual image URLs in profile_photo and gallery columns.`);
              }
            }
          } catch (error) {
            warnings.push(`Row ${i + 1} (${vendorData.business_name}): Error processing folder link - ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }

        // Map plan to tier
        const planTierMap = {
          'style-beauty': 'styleBeauty',
          'media-entertainment': 'mediaEntertainment',
          'venue-planning': 'venuePlanning'
        };
        const planTier = planTierMap[vendorData.subscription_price_dhs === 200 ? 'style-beauty' :
                                       vendorData.subscription_price_dhs === 250 ? 'media-entertainment' :
                                       'venue-planning'] || 'styleBeauty';

        // Process profile image
        let profilePhotoUrl: string | null = null;
        if (imageUrls.profile) {
          try {
            const storagePath = `vendors/${vendorId}/profile`;
            const uploadResult = await downloadAndUploadImage(imageUrls.profile, storagePath, supabase);

            if (uploadResult.success && uploadResult.url) {
              profilePhotoUrl = uploadResult.url;
              
              // Update vendor with profile photo URL
              await supabase
                .from('vendor_leads')
                .update({ logo_url: profilePhotoUrl })
                .eq('id', vendorId);

              profileUploaded++;
            } else {
              warnings.push(`Row ${i + 1} (${vendorData.business_name}): Failed to upload profile photo - ${uploadResult.error || 'Unknown error'}`);
            }
          } catch (error) {
            warnings.push(`Row ${i + 1} (${vendorData.business_name}): Profile photo error - ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }

        // Upload gallery images (after folder processing)
        let galleryUrls: string[] = [];
        if (imageUrls.gallery.length > 0) {
          for (let j = 0; j < Math.min(imageUrls.gallery.length, 10); j++) {
            const galleryUrl = imageUrls.gallery[j];
            try {
              const storagePath = `vendors/${vendorId}/gallery/${j + 1}`;
              const uploadResult = await downloadAndUploadImage(galleryUrl, storagePath, supabase);

              if (uploadResult.success && uploadResult.url) {
                galleryUrls.push(uploadResult.url);
                galleryUploaded++;
              } else {
                warnings.push(`Row ${i + 1} (${vendorData.business_name}): Failed to upload gallery image ${j + 1} - ${uploadResult.error || 'Unknown error'}`);
              }
            } catch (error) {
              warnings.push(`Row ${i + 1} (${vendorData.business_name}): Gallery image ${j + 1} error - ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          }
        }

        // Update vendor_leads with gallery URLs
        if (galleryUrls.length > 0) {
          await supabase
            .from('vendor_leads')
            .update({ gallery_urls: galleryUrls })
            .eq('id', vendorId);
        }

        // Handle video URL (store directly, don't upload to storage)
        if (imageUrls.video) {
          // Store video URL directly (could be YouTube, Vimeo, or Google Drive link)
          // For now, we'll just store it - you may want to add a video_url column
          warnings.push(`Row ${i + 1} (${vendorData.business_name}): Video URL found but video_url column not yet implemented in vendor_leads table. Video URL: ${imageUrls.video}`);
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

    // Calculate actual totals
    const totalRowsInCSV = totalRows; // Original CSV row count
    const totalValidated = vendors.length; // Vendors that passed validation
    const totalFailed = failed + errors.length; // Include parsing and validation errors
    const actualSuccessful = successful;
    const skippedDuringValidation = totalRowsInCSV - totalValidated; // Rows that failed validation

    return NextResponse.json({
      success: actualSuccessful > 0,
      message: actualSuccessful > 0 
        ? `Successfully imported ${actualSuccessful} out of ${totalRowsInCSV} vendors${totalFailed > 0 ? ` (${totalFailed} failed)` : ''}` 
        : `Import failed: ${totalFailed} vendors failed out of ${totalRowsInCSV} total`,
      total: totalRowsInCSV, // Original CSV row count
      successful: actualSuccessful,
      failed: totalFailed,
      validated: totalValidated, // How many passed validation
      skipped: skippedDuringValidation, // How many failed validation
      profileUploaded,
      galleryUploaded,
      errors: allErrors.slice(0, 200), // Show more errors (200 instead of 100)
      warnings: warnings.slice(0, 100), // Show more warnings
      hasMoreErrors: allErrors.length > 200,
      hasMoreWarnings: warnings.length > 100
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
