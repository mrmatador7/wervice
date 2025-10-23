/**
 * Helper to get public image URLs from Supabase Storage
 */
export function getPublicImageUrl(path: string | null | undefined): string {
  if (!path) {
    return '/images/sample/venues-1.jpg'; // Fallback placeholder
  }

  // If it's already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // If it's a storage path, construct the public URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL not set, using fallback image');
    return '/images/sample/venues-1.jpg';
  }

  return `${supabaseUrl}/storage/v1/object/public/${path}`;
}
