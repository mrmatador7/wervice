import { MOROCCAN_CITIES } from '@/lib/types/vendor';

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

function normalizeCitySlug(value: string): string {
  return cityToSlug(value || '');
}

/**
 * Best-effort conversion from URL city slug to display city name.
 * Returns null when no city can be inferred.
 */
export function slugToCityName(citySlug: string): string | null {
  const normalized = normalizeCitySlug(citySlug);
  if (!normalized) return null;

  const match = MOROCCAN_CITIES.find((city) => {
    if (city.value === 'all') return false;
    return normalizeCitySlug(city.value) === normalized;
  });
  return match?.value || null;
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
