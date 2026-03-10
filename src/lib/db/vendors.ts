import { createClient } from '@/lib/supabase-server';

export type VendorDetail = {
  id: string;
  business_name: string;
  slug: string;
  category: string;
  city: string;
  phone: string | null;
  email: string | null;
  description: string | null;
  profile_photo_url: string | null;
  gallery_photos: string[] | null;
  plan: string | null;
  published: boolean;
  starting_price: number | null;
  created_at: string;
  video_url?: string | null;
  video_urls?: string[] | null;
  instagram?: string | null;
  google_maps?: string | null;
};

export type SimilarVendor = {
  id: string;
  business_name: string;
  slug: string;
  category: string;
  city: string;
  profile_photo_url: string | null;
  gallery_photos: string[] | null;
  starting_price: number | null;
  plan: string | null;
};

type MediaFileRow = {
  file_key: string;
  mime_type: string | null;
  vendor_name: string | null;
};

type VendorLeadRow = {
  id: string;
  business_name: string;
  slug: string | null;
  category: string;
  city: string;
  whatsapp: string | null;
  email: string | null;
  profile_description: string | null;
  logo_url: string | null;
  gallery_urls: string[] | null;
  published: boolean;
  profile_starting_price: string | null;
  starting_price: number | null;
  created_at: string;
  instagram?: string | null;
  google_maps?: string | null;
};

function normalizeName(value: string | null | undefined): string {
  return (value || '').trim().toLowerCase();
}

function buildMediaUrl(fileKey: string): string {
  const base = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || 'https://media.wervice.com').replace(/\/+$/, '');
  const encoded = fileKey
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  return `${base}/${encoded}`;
}

function isVideoMime(mimeType: string | null | undefined): boolean {
  return Boolean(mimeType && mimeType.startsWith('video/'));
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov|webm|avi|m4v)(\?|$)/i.test(url);
}

export async function getVendorBySlug(slug: string): Promise<VendorDetail | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('vendor_leads')
      .select('id, business_name, slug, category, city, whatsapp, email, profile_description, logo_url, gallery_urls, published, profile_starting_price, starting_price, created_at, instagram, google_maps')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    
    // Debug logging
    if (error && error.code !== 'PGRST116') {
      console.error('Vendor lookup error:', {
        slug,
        errorCode: error.code,
        errorMessage: error.message,
        errorDetails: error
      });
    }
    
    if (error) {
      // PGRST116 means no rows returned - this is expected when vendor doesn't exist
      if (error.code === 'PGRST116') {
        console.log(`Vendor with slug "${slug}" not found or not published`);
        return null;
      }
      // Actual database error
      console.error('Error fetching vendor by slug:', error);
      return null;
    }
    
    const lead = data as VendorLeadRow | null;
    if (!lead) {
      return null;
    }
    
    // Default media from vendor_leads fields
    let profilePhotoUrl = lead.logo_url || null;
    const leadGalleryRaw: string[] = Array.isArray(lead.gallery_urls) ? lead.gallery_urls : [];
    const leadGalleryImages = leadGalleryRaw.filter((url) => !isVideoUrl(url));
    const leadGalleryVideos = leadGalleryRaw.filter((url) => isVideoUrl(url));

    let galleryPhotos: string[] = leadGalleryImages;
    const collectedVideos: string[] = [...leadGalleryVideos];

    // Prefer media_files (R2) when vendor_name matches business_name (case-insensitive)
    const { data: mediaRows } = await supabase
      .from('media_files')
      .select('file_key,mime_type,vendor_name')
      .ilike('vendor_name', lead.business_name || '');

    if (Array.isArray(mediaRows) && mediaRows.length > 0) {
      const sorted = [...(mediaRows as MediaFileRow[])].sort((a, b) => {
        const av = normalizeName(a.vendor_name);
        const bv = normalizeName(b.vendor_name);
        const target = normalizeName(lead.business_name);
        // Prefer exact normalized name match first
        const aExact = av === target ? 0 : 1;
        const bExact = bv === target ? 0 : 1;
        return aExact - bExact;
      });

      const urls = sorted.map((row) => ({
        url: buildMediaUrl(row.file_key),
        isVideo: isVideoMime(row.mime_type),
      }));

      const images = urls.filter((x) => !x.isVideo).map((x) => x.url);
      const videos = urls.filter((x) => x.isVideo).map((x) => x.url);

      // Use media_files as a fallback source, not as authoritative replacement.
      // vendor_leads.gallery_urls can be manually curated and more complete.
      if (!profilePhotoUrl && images.length > 0) {
        profilePhotoUrl = images[0];
      }

      if (galleryPhotos.length === 0 && images.length > 0) {
        galleryPhotos = profilePhotoUrl
          ? images.filter((url) => url !== profilePhotoUrl)
          : images.slice(1);
      } else if (galleryPhotos.length > 0 && images.length > 0) {
        const seen = new Set(galleryPhotos);
        for (const imageUrl of images) {
          if (imageUrl !== profilePhotoUrl && !seen.has(imageUrl)) {
            galleryPhotos.push(imageUrl);
            seen.add(imageUrl);
          }
        }
      }

      // Prefer MIME-verified R2 videos whenever available.
      if (videos.length > 0) {
        const merged = [...videos, ...collectedVideos];
        const unique = Array.from(new Set(merged));
        collectedVideos.length = 0;
        collectedVideos.push(...unique);
      }
    }

    const videoUrl = collectedVideos[0] || null;

    // Transform database columns to match VendorDetail type
    return {
      id: lead.id,
      business_name: lead.business_name,
      slug: lead.slug || '',
      category: lead.category,
      city: lead.city,
      phone: lead.whatsapp || null,
      email: lead.email || null,
      description: lead.profile_description || null,
      profile_photo_url: profilePhotoUrl,
      gallery_photos: galleryPhotos.length > 0 ? galleryPhotos : null,
      plan: null, // plan_tier doesn't exist in vendor_leads
      published: lead.published || false,
      starting_price:
        lead.starting_price ||
        (lead.profile_starting_price ? parseFloat(lead.profile_starting_price) : null),
      created_at: lead.created_at,
      video_url: videoUrl,
      video_urls: collectedVideos.length > 0 ? collectedVideos : null,
      instagram: lead.instagram || null,
      google_maps: lead.google_maps || null,
    } as VendorDetail;
  } catch (error) {
    console.error('Database error in getVendorBySlug:', error);
    return null;
  }
}

export async function getSimilarVendors(
  category: string,
  city: string,
  currentId: string,
  limit = 10
): Promise<SimilarVendor[]> {
  try {
    const supabase = await createClient();
    
    // Same category and same city only
    const { data, error } = await supabase
      .from('vendor_leads')
      .select('id, business_name, slug, category, city, logo_url, gallery_urls, starting_price, profile_starting_price')
      .eq('category', category)
      .ilike('city', city)
      .eq('published', true)
      .neq('id', currentId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error || !data) {
      console.error('Error fetching similar vendors:', error);
      return [];
    }
    
    // Transform and prioritize same city, then others
    const typedData = (data as VendorLeadRow[]).map((v) => ({
      id: v.id,
      business_name: v.business_name,
      slug: v.slug || '',
      category: v.category,
      city: v.city,
      profile_photo_url: v.logo_url || null,
      gallery_photos: v.gallery_urls || null,
      starting_price: v.starting_price || (v.profile_starting_price ? parseFloat(v.profile_starting_price) : null),
      plan: null, // plan_tier doesn't exist in vendor_leads
    }));

    // Prefer media_files images for similar vendor cards
    const names = typedData.map((v) => v.business_name).filter(Boolean);
    if (names.length > 0) {
      const { data: mediaRows } = await supabase
        .from('media_files')
        .select('vendor_name,file_key,mime_type')
        .in('vendor_name', names);

      const mediaByName = new Map<string, string[]>();
      for (const row of (mediaRows || []) as MediaFileRow[]) {
        if (!isVideoMime(row.mime_type)) {
          const key = normalizeName(row.vendor_name);
          if (!mediaByName.has(key)) mediaByName.set(key, []);
          mediaByName.get(key)!.push(buildMediaUrl(row.file_key));
        }
      }

      for (const item of typedData) {
        const media = mediaByName.get(normalizeName(item.business_name)) || [];
        if (media.length > 0) {
          item.profile_photo_url = media[0];
          item.gallery_photos = media.slice(1);
        }
      }
    }
    
    return typedData.slice(0, limit) as SimilarVendor[];
  } catch (error) {
    console.error('Database error in getSimilarVendors:', error);
    return [];
  }
}
