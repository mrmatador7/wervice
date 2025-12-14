/**
 * Utility functions for selecting vendor images
 */

/**
 * Get a featured image for a vendor card.
 * Selects a random image from the vendor's gallery (or profile photo if no gallery).
 * Uses vendor ID as seed for consistent randomness per vendor.
 * 
 * @param vendor - Vendor object with id, profile_photo_url, and gallery_urls/gallery_photos
 * @param fallback - Fallback image URL if no images are available
 * @returns Featured image URL or fallback
 */
export function getFeaturedVendorImage(
  vendor: {
    id?: string;
    profile_photo_url?: string | null;
    gallery_urls?: string[] | null;
    gallery_photos?: string[] | null;
  },
  fallback: string | null = null
): string | null {
  // Get all available images (gallery + profile)
  const allImages: string[] = [];
  
  // Handle both gallery_urls and gallery_photos field names
  const gallery = vendor.gallery_urls || vendor.gallery_photos || [];
  if (Array.isArray(gallery) && gallery.length > 0) {
    const validGalleryUrls = gallery.filter((url: any) => {
      if (typeof url !== 'string') return false;
      const trimmed = url.trim();
      return trimmed.length > 0 && trimmed !== 'null' && trimmed !== 'undefined';
    });
    allImages.push(...validGalleryUrls);
  }
  
  // Add profile photo if available
  if (vendor.profile_photo_url) {
    const trimmed = vendor.profile_photo_url.trim();
    if (trimmed.length > 0 && trimmed !== 'null' && trimmed !== 'undefined') {
      allImages.push(trimmed);
    }
  }
  
  if (allImages.length === 0) {
    return fallback;
  }
  
  // Select a random image using vendor ID as seed for consistency
  // This ensures the same vendor always shows the same "random" image
  const seed = vendor.id 
    ? vendor.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) 
    : Math.floor(Math.random() * 1000);
  
  const selectedImage = allImages[seed % allImages.length];
  
  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development' && !selectedImage) {
    console.warn('No valid image found for vendor:', {
      id: vendor.id,
      gallery_urls: vendor.gallery_urls,
      gallery_photos: vendor.gallery_photos,
      profile_photo_url: vendor.profile_photo_url,
      allImagesCount: allImages.length
    });
  }
  
  return selectedImage;
}

