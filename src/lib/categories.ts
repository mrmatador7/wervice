export const CATEGORY_MAP = {
  venues:        { label: "Venues" },
  catering:      { label: "Catering" },
  photo_video:   { label: "Photo & Video" },
  event_planner: { label: "Event Planner" },
  beauty:        { label: "Beauty" },
  decor:         { label: "Decor" },
  music:         { label: "Music" },
  dresses:       { label: "Dresses" },
} as const;

export type CategorySlug = keyof typeof CATEGORY_MAP;
export const VALID_CATEGORY_SLUGS = Object.keys(CATEGORY_MAP) as CategorySlug[];

/** Legacy/loose inputs → canonical slug */
export const LEGACY_CATEGORY_ALIASES: Record<string, CategorySlug> = {
  venue: "venues",
  venues: "venues",

  catering: "catering",
  caterer: "catering",
  carter: "catering",
  carterer: "catering",

  photo: "photo_video",
  photography: "photo_video",
  photographer: "photo_video",
  "photo&video": "photo_video",
  "photo & video": "photo_video",
  photo_video: "photo_video",

  eventplanner: "event_planner",
  event_planner: "event_planner",
  eventPlanner: "event_planner",
  planning: "event_planner",

  beauty: "beauty",
  decor: "decor",
  music: "music",
  dresses: "dresses",
};

export function normalizeCategory(raw: string | null | undefined): CategorySlug | null {
  if (!raw) return null;
  const key = String(raw).trim().toLowerCase().replace(/\s+/g, " ").replace(/ /g, "_");
  return (
    (LEGACY_CATEGORY_ALIASES[key] as CategorySlug) ||
    ((VALID_CATEGORY_SLUGS as string[]).includes(key) ? (key as CategorySlug) : null)
  );
}

export function labelForCategory(slug: string | null | undefined): string {
  if (!slug) return "";

  // First try to normalize the slug and get the label
  const normalized = normalizeCategory(slug);
  if (normalized && CATEGORY_MAP[normalized]) {
    return CATEGORY_MAP[normalized].label;
  }

  // Fallback to direct lookup or the original slug
  return CATEGORY_MAP[slug as CategorySlug]?.label ?? slug;
}