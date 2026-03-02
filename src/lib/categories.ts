/**
 * Canonical Wervice categories (11). Slug is used in URLs; dbCategory is the value in vendor_leads.category.
 */
export const WERVICE_CATEGORIES = [
  { slug: 'florist', label: 'Florist', dbCategory: 'florist' },
  { slug: 'dresses', label: 'Dresses', dbCategory: 'dresses' },
  { slug: 'venues', label: 'Venues', dbCategory: 'venues' },
  { slug: 'beauty', label: 'Beauty', dbCategory: 'beauty' },
  { slug: 'photo-film', label: 'Photo & Film', dbCategory: 'photography' },
  { slug: 'caterer', label: 'Caterer', dbCategory: 'catering' },
  { slug: 'decor', label: 'Decor', dbCategory: 'decor' },
  { slug: 'negafa', label: 'Negafa', dbCategory: 'negafa' },
  { slug: 'artist', label: 'Artist', dbCategory: 'music' },
  { slug: 'event-planner', label: 'Event Planner', dbCategory: 'planning' },
  { slug: 'cakes', label: 'Cakes', dbCategory: 'cakes' },
] as const;

export type WerviceCategorySlug = (typeof WERVICE_CATEGORIES)[number]['slug'];
export const VALID_CATEGORY_SLUGS = WERVICE_CATEGORIES.map((c) => c.slug);

/** URL slug → DB category value (for API/filter) */
export const SLUG_TO_DB_CATEGORY: Record<string, string> = Object.fromEntries(
  WERVICE_CATEGORIES.map((c) => [c.slug, c.dbCategory])
);

/** DB category → display label */
export const CATEGORY_MAP: Record<string, { label: string }> = Object.fromEntries(
  WERVICE_CATEGORIES.flatMap((c) => [
    [c.slug, { label: c.label }],
    [c.dbCategory, { label: c.label }],
  ])
);

/** Legacy/loose inputs → canonical slug (for normalization) */
export const LEGACY_CATEGORY_ALIASES: Record<string, string> = {
  venue: 'venues',
  venues: 'venues',
  catering: 'caterer',
  caterer: 'caterer',
  photo: 'photo-film',
  photography: 'photo-film',
  photo_video: 'photo-film',
  'photo&video': 'photo-film',
  'photo & video': 'photo-film',
  'photo & film': 'photo-film',
  eventplanner: 'event-planner',
  event_planner: 'event-planner',
  planning: 'event-planner',
  music: 'artist',
  artist: 'artist',
  beauty: 'beauty',
  decor: 'decor',
  dresses: 'dresses',
  florist: 'florist',
  negafa: 'negafa',
  cakes: 'cakes',
};

export type CategorySlug = string;

export function normalizeCategory(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const key = String(raw).trim().toLowerCase().replace(/\s+/g, ' ').replace(/ /g, '-').replace(/_/g, '-');
  return LEGACY_CATEGORY_ALIASES[key] ?? (VALID_CATEGORY_SLUGS.includes(key) ? key : null);
}

export function slugToDbCategory(slug: string | null | undefined): string | null {
  if (!slug) return null;
  const s = String(slug).trim().toLowerCase();
  return SLUG_TO_DB_CATEGORY[s] ?? (VALID_CATEGORY_SLUGS.includes(s) ? s : null);
}

export function labelForCategory(slug: string | null | undefined): string {
  if (!slug) return '';
  const normalized = normalizeCategory(slug);
  if (normalized && CATEGORY_MAP[normalized]) return CATEGORY_MAP[normalized].label;
  if (CATEGORY_MAP[slug]) return CATEGORY_MAP[slug].label;
  return slug;
}
