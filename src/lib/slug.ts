import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export async function generateUniqueSlug(businessName: string): Promise<string> {
  const cookieStore = await cookies();
  const supabase = await createClient();

  // Convert to kebab-case
  const baseSlug = businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  let slug = baseSlug;
  let counter = 0;

  // Check uniqueness and add hash if needed
  while (true) {
    const { data } = await supabase
      .from('vendor_leads')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!data) {
      // Slug is available
      return slug;
    }

    // Generate a 6-character hash from the counter
    const hash = counter.toString(36).padStart(6, '0').toUpperCase();
    slug = `${baseSlug}-${hash}`;
    counter++;

    // Prevent infinite loop
    if (counter > 1000) {
      throw new Error('Unable to generate unique slug');
    }
  }
}








