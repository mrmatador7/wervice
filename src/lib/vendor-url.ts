/**
 * Converts a city display name to a URL-safe slug.
 * e.g. "Marrakech" → "marrakech", "Dar Bouazza" → "dar-bouazza"
 */
export function cityToSlug(city: string): string {
  return (city || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Builds the canonical public URL for a vendor detail page.
 * Format: /{locale}/{city-slug}/{category-slug}/{vendor-slug}
 */
export function vendorUrl(
  vendor: { city: string; category: string; slug: string },
  locale = 'en'
): string {
  return `/${locale}/${cityToSlug(vendor.city)}/${vendor.category}/${vendor.slug}`;
}
