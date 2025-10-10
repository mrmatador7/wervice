export type SimpleItem = { name: string; slug: string };

export async function getCities(): Promise<SimpleItem[]> {
  // TODO: replace with Supabase fetch; safe fallback keeps SSR stable
  return [
    { name: 'Casablanca', slug: 'casablanca' },
    { name: 'Marrakech',  slug: 'marrakech'  },
    { name: 'Rabat',      slug: 'rabat'      },
    { name: 'Tangier',    slug: 'tangier'    },
    { name: 'Agadir',     slug: 'agadir'     },
    { name: 'Fes',        slug: 'fes'        },
    { name: 'Meknes',     slug: 'meknes'     },
  ];
}

export async function getCategories(): Promise<SimpleItem[]> {
  return [
    { name: 'Venues',        slug: 'venues' },
    { name: 'Catering',      slug: 'catering' },
    { name: 'Photo & Video', slug: 'photo-video' },
    { name: 'Planning',      slug: 'planning' },
    { name: 'Beauty',        slug: 'beauty' },
    { name: 'Decor',         slug: 'decor' },
    { name: 'Music',         slug: 'music' },
    { name: 'Dresses',       slug: 'dresses' },
  ];
}
