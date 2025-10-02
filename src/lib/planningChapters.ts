import { Chapter, TimelineStep, ChecklistItem, FAQItem } from '@/models/chapter';

export const planningChapters: Chapter[] = [
  {
    slug: 'month-12',
    title: 'Month 12: Set Your Vision & Budget',
    excerpt: 'Define your wedding style, create a realistic budget, and start your vendor research.',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=400&fit=crop',
    readTime: 8,
    order: 1,
    lastUpdated: '2024-09-25T10:00:00Z'
  },
  {
    slug: 'month-10',
    title: 'Month 10: Guest List & Venue Shortlist',
    excerpt: 'Finalize your guest count, research venues, and create your wishlist.',
    coverImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=400&fit=crop',
    readTime: 6,
    order: 2,
    lastUpdated: '2024-09-25T10:00:00Z'
  },
  {
    slug: 'month-9',
    title: 'Month 9: Book Venue & Wedding Planner',
    excerpt: 'Secure your dream venue and consider hiring a wedding planner.',
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=400&fit=crop',
    readTime: 7,
    order: 3,
    lastUpdated: '2024-09-25T10:00:00Z'
  },
  {
    slug: 'month-8',
    title: 'Month 8: Photography, Videography & Music',
    excerpt: 'Book your photographer, videographer, and entertainment for the big day.',
    coverImage: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=400&fit=crop',
    readTime: 6,
    order: 4,
    lastUpdated: '2024-09-25T10:00:00Z'
  },
  {
    slug: 'month-7',
    title: 'Month 7: Catering & Menu Planning',
    excerpt: 'Choose your caterer, plan your menu, and schedule tastings.',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop',
    readTime: 5,
    order: 5,
    lastUpdated: '2024-09-25T10:00:00Z'
  },
  {
    slug: 'month-6',
    title: 'Month 6: Dresses, Beauty & Henna',
    excerpt: 'Find your perfect wedding dress and book beauty services.',
    coverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=400&fit=crop',
    readTime: 7,
    order: 6,
    lastUpdated: '2024-09-25T10:00:00Z'
  },
  {
    slug: 'month-4',
    title: 'Month 4: Decor, Invitations & Stationery',
    excerpt: 'Design your wedding invitations and plan your decor theme.',
    coverImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&h=400&fit=crop',
    readTime: 5,
    order: 7,
    lastUpdated: '2024-09-25T10:00:00Z'
  },
  {
    slug: 'month-3',
    title: 'Month 3: Transportation & Logistics',
    excerpt: 'Arrange transportation, finalize logistics, and plan your timeline.',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    readTime: 6,
    order: 8,
    lastUpdated: '2024-09-25T10:00:00Z'
  },
  {
    slug: 'month-2',
    title: 'Month 2: Final Vendor Confirmations',
    excerpt: 'Confirm all vendors, finalize contracts, and create your detailed timeline.',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
    readTime: 5,
    order: 9,
    lastUpdated: '2024-09-25T10:00:00Z'
  },
  {
    slug: 'month-1',
    title: 'Month 1: Final Preparations & Confirmations',
    excerpt: 'Final vendor meetings, confirmations, and last-minute preparations.',
    coverImage: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&h=400&fit=crop',
    readTime: 6,
    order: 10,
    lastUpdated: '2024-09-25T10:00:00Z'
  },
  {
    slug: 'week-of',
    title: 'Week Of: Rehearsal & Final Checklist',
    excerpt: 'Rehearsal dinner, final vendor confirmations, and packing for your wedding.',
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=400&fit=crop',
    readTime: 4,
    order: 11,
    lastUpdated: '2024-09-25T10:00:00Z'
  },
  {
    slug: 'day-of',
    title: 'Day Of: Your Wedding Timeline',
    excerpt: 'Your complete wedding day schedule and run-of-show.',
    coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=400&fit=crop',
    readTime: 5,
    order: 12,
    lastUpdated: '2024-09-25T10:00:00Z'
  }
];

export const timelineSteps: TimelineStep[] = [
  {
    months: 12,
    title: 'Set Your Vision & Budget',
    description: 'Define your wedding style and create a realistic budget',
    chapterSlug: 'month-12',
    icon: '🎯',
    tasks: ['Discuss wedding vision', 'Set budget range', 'Research vendors', 'Create inspiration board']
  },
  {
    months: 10,
    title: 'Guest List & Venue Research',
    description: 'Finalize guest count and start venue hunting',
    chapterSlug: 'month-10',
    icon: '📝',
    tasks: ['Finalize guest list', 'Research venues', 'Book venue tours', 'Create venue shortlist']
  },
  {
    months: 9,
    title: 'Book Venue & Planner',
    description: 'Secure your venue and consider professional help',
    chapterSlug: 'month-9',
    icon: '🏛️',
    tasks: ['Book venue deposit', 'Hire wedding planner', 'Sign contracts', 'Insurance planning']
  },
  {
    months: 8,
    title: 'Photography & Music',
    description: 'Book creative vendors for your wedding day',
    chapterSlug: 'month-8',
    icon: '📸',
    tasks: ['Book photographer', 'Book videographer', 'Book DJ/band', 'Plan first dance']
  },
  {
    months: 7,
    title: 'Catering & Menu',
    description: 'Choose food and beverage options',
    chapterSlug: 'month-7',
    icon: '🍽️',
    tasks: ['Book caterer', 'Menu tastings', 'Dietary accommodations', 'Cake selection']
  },
  {
    months: 6,
    title: 'Dresses & Beauty',
    description: 'Find your perfect wedding attire',
    chapterSlug: 'month-6',
    icon: '👗',
    tasks: ['Wedding dress shopping', 'Book alterations', 'Book hair/makeup', 'Henna planning']
  },
  {
    months: 4,
    title: 'Decor & Invitations',
    description: 'Design your wedding stationery and theme',
    chapterSlug: 'month-4',
    icon: '🎨',
    tasks: ['Send save-the-dates', 'Design invitations', 'Book florist', 'Theme finalization']
  },
  {
    months: 3,
    title: 'Transportation & Logistics',
    description: 'Plan transportation and wedding day logistics',
    chapterSlug: 'month-3',
    icon: '🚗',
    tasks: ['Book transportation', 'Hotel blocks', 'Timeline creation', 'Vendor coordination']
  },
  {
    months: 2,
    title: 'Final Confirmations',
    description: 'Confirm all vendors and finalize details',
    chapterSlug: 'month-2',
    icon: '✅',
    tasks: ['Vendor contracts', 'Final payments', 'Seating chart', 'Day-of timeline']
  },
  {
    months: 1,
    title: 'Final Preparations',
    description: 'Last-minute confirmations and preparations',
    chapterSlug: 'month-1',
    icon: '🎯',
    tasks: ['Final fittings', 'Vendor meetings', 'Marriage license', 'Honeymoon planning']
  },
  {
    months: 0,
    title: 'Week Of',
    description: 'Rehearsal and final preparations',
    chapterSlug: 'week-of',
    icon: '📅',
    tasks: ['Rehearsal dinner', 'Vendor confirmations', 'Packing checklist', 'Relax and enjoy']
  },
  {
    months: 0,
    title: 'Day Of',
    description: 'Your perfect wedding day',
    chapterSlug: 'day-of',
    icon: '💒',
    tasks: ['Morning routine', 'Ceremony', 'Reception', 'First dance', 'Send-off']
  }
];

export const essentialChecklists: ChecklistItem[] = [
  {
    id: 'venue-tour',
    title: 'Venue Tour Checklist',
    icon: '🏛️',
    items: [
      'Check capacity and layout',
      'Review parking availability',
      'Assess catering kitchen facilities',
      'Note restrooms and accessibility',
      'Evaluate lighting and sound systems',
      'Check vendor accommodation options',
      'Review weather contingency plans',
      'Note ceremony and reception spaces'
    ],
    downloadUrl: '/checklists/venue-tour-checklist.pdf'
  },
  {
    id: 'photographer-shot-list',
    title: 'Wedding Photography Shot List',
    icon: '📸',
    items: [
      'Getting ready photos',
      'First look moment',
      'Ceremony shots',
      'Family portraits',
      'Couple portraits',
      'Reception highlights',
      'Dance floor moments',
      'Vendor appreciation shots'
    ],
    downloadUrl: '/checklists/photography-shot-list.pdf'
  },
  {
    id: 'henna-night',
    title: 'Henna Night Checklist',
    icon: '✨',
    items: [
      'Book henna artist',
      'Choose design complexity',
      'Plan guest list',
      'Select venue/location',
      'Arrange food and drinks',
      'Plan entertainment/music',
      'Photography/videography',
      'Backup weather plan'
    ],
    downloadUrl: '/checklists/henna-night-checklist.pdf'
  },
  {
    id: 'beauty-day-of-bag',
    title: 'Beauty Day-Of Emergency Kit',
    icon: '💄',
    items: [
      'Hair pins and accessories',
      'Makeup touch-up items',
      'Deodorant and perfume',
      'Sewing kit for emergencies',
      'Band-aids and first aid',
      'Pain relievers',
      'Breath mints and gum',
      'Tissues and wet wipes'
    ],
    downloadUrl: '/checklists/beauty-emergency-kit.pdf'
  }
];

export const faqItems: FAQItem[] = [
  {
    question: 'When should we book our wedding venue?',
    answer: 'For popular dates and venues, book 9-12 months in advance. Peak season (April-June, September-October) fills up quickly. Start venue research at 10-12 months out and aim to book by month 9.'
  },
  {
    question: 'Is WhatsApp acceptable for initial vendor contact?',
    answer: 'Yes! Moroccan vendors commonly use WhatsApp for initial inquiries and communication. It\'s quick, personal, and allows for easy sharing of photos and details. Most vendors on Wervice list their WhatsApp numbers.'
  },
  {
    question: 'How much should we budget for a Moroccan wedding?',
    answer: 'Budget varies by guest count and style, but expect $3,000-$10,000+ for 50-150 guests. Major costs include venue ($1,500-$4,000), catering ($1,000-$3,000), and photography ($500-$1,500). Use our budget calculator for personalized estimates.'
  },
  {
    question: 'Do we need a wedding planner in Morocco?',
    answer: 'While not required, a local wedding planner is highly recommended for navigating cultural nuances, vendor coordination, and ensuring everything runs smoothly on your special day.'
  },
  {
    question: 'What documents do we need for a Moroccan wedding?',
    answer: 'Bring valid passports, birth certificates, and possibly divorce decrees. For legal marriage, you\'ll need additional documents. Consult with your venue or planner for specific requirements.'
  },
  {
    question: 'Can we have an alcohol-free wedding?',
    answer: 'Absolutely! Many Moroccan weddings are alcohol-free by choice or cultural preference. Focus on traditional mint tea, fresh juices, and beautiful non-alcoholic beverages.'
  }
];

// Helper functions
export function getAllChapters(): Chapter[] {
  return planningChapters.sort((a, b) => a.order - b.order);
}

export function getChapterBySlug(slug: string): Chapter | undefined {
  return planningChapters.find(chapter => chapter.slug === slug);
}

export function getNextChapter(currentSlug: string): Chapter | null {
  const chapters = getAllChapters();
  const currentIndex = chapters.findIndex(chapter => chapter.slug === currentSlug);
  return currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
}

export function getPreviousChapter(currentSlug: string): Chapter | null {
  const chapters = getAllChapters();
  const currentIndex = chapters.findIndex(chapter => chapter.slug === currentSlug);
  return currentIndex > 0 ? chapters[currentIndex - 1] : null;
}

export function getTimelineSteps(): TimelineStep[] {
  return timelineSteps;
}

export function getEssentialChecklists(): ChecklistItem[] {
  return essentialChecklists;
}

export function getFAQItems(): FAQItem[] {
  return faqItems;
}
