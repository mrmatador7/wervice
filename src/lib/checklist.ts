export type ChecklistItem = {
  id: string;
  label: string;
  category?: 'Venues' | 'Catering' | 'Photo & Video' | 'Planning' | 'Beauty' | 'Decor' | 'Music' | 'Dresses';
  note?: string;           // default helper tip
  cta?: { label: string; href: string }; // e.g. Browse Venues
};

export type ChecklistSection = {
  slug: string;            // 'month-12', 'month-9', ..., 'week-of', 'day-of'
  badge: string;           // '12 months'
  title: string;           // 'Set Your Vision & Budget'
  items: ChecklistItem[];
};

export const CHECKLIST: ChecklistSection[] = [
  {
    slug: 'month-12',
    badge: '12 months',
    title: 'Set Your Vision & Budget',
    items: [
      { id: 'vision-style', label: 'Define your wedding style & guest count', category: 'Planning' },
      { id: 'set-budget', label: 'Set an initial budget and priorities', category: 'Planning' },
      { id: 'shortlist-cities', label: 'Shortlist cities (Casablanca, Marrakech, Rabat…)', category: 'Planning' },
      { id: 'create-pinterest', label: 'Create a Pinterest board for inspiration', category: 'Planning' },
      { id: 'set-date', label: 'Set your wedding date (consider seasons)', category: 'Planning' },
      { id: 'research-permits', label: 'Research marriage requirements and permits', category: 'Planning' },
    ],
  },
  {
    slug: 'month-10',
    badge: '10 months',
    title: 'Guest List & Early Bookings',
    items: [
      { id: 'finalize-guest-list', label: 'Finalize initial guest list (100-150 people)', category: 'Planning' },
      { id: 'book-ceremony-venue', label: 'Book ceremony venue if separate', category: 'Venues', cta: { label: 'Browse Venues', href: '/categories/venues' } },
      { id: 'hire-photographer', label: 'Hire photographer for engagement photos', category: 'Photo & Video', cta: { label: 'Browse Photo & Video', href: '/categories/photo-video' } },
      { id: 'book-reception-venue', label: 'Book reception venue', category: 'Venues', cta: { label: 'Browse Venues', href: '/categories/venues' } },
      { id: 'send-save-dates', label: 'Send save-the-date cards or emails', category: 'Planning' },
    ],
  },
  {
    slug: 'month-9',
    badge: '9 months',
    title: 'Book Core Vendors',
    items: [
      { id: 'tour-venues', label: 'Tour venues and request proposals', category: 'Venues', cta: { label: 'Browse Venues', href: '/categories/venues' } },
      { id: 'book-venue', label: 'Reserve your venue + deposit', category: 'Venues' },
      { id: 'hire-planner', label: 'Hire a wedding planner', category: 'Planning', cta: { label: 'Find Planners', href: '/categories/planning' } },
      { id: 'book-caterer', label: 'Book caterer for menu tasting', category: 'Catering', cta: { label: 'Browse Catering', href: '/categories/catering' } },
      { id: 'book-photographer', label: 'Book wedding photographer', category: 'Photo & Video', cta: { label: 'Browse Photo & Video', href: '/categories/photo-video' } },
      { id: 'book-videographer', label: 'Book videographer', category: 'Photo & Video', cta: { label: 'Browse Photo & Video', href: '/categories/photo-video' } },
    ],
  },
  {
    slug: 'month-8',
    badge: '8 months',
    title: 'Music, Flowers & Details',
    items: [
      { id: 'book-dj-band', label: 'Book DJ or live band', category: 'Music', cta: { label: 'Browse Music', href: '/categories/music' } },
      { id: 'hire-florist', label: 'Hire florist and discuss arrangements', category: 'Decor' },
      { id: 'order-invitations', label: 'Order wedding invitations', category: 'Planning' },
      { id: 'book-cake-baker', label: 'Book wedding cake baker', category: 'Catering' },
      { id: 'choose-registry', label: 'Choose wedding registry', category: 'Planning' },
      { id: 'book-transportation', label: 'Book transportation for wedding party', category: 'Planning' },
    ],
  },
  {
    slug: 'month-7',
    badge: '7 months',
    title: 'Attire & Beauty',
    items: [
      { id: 'find-dress', label: 'Find and purchase wedding dress', category: 'Dresses' },
      { id: 'find-suit', label: 'Find and purchase wedding suit/tuxedo', category: 'Planning' },
      { id: 'book-hairdresser', label: 'Book hair and makeup artist', category: 'Beauty', cta: { label: 'Browse Beauty', href: '/categories/beauty' } },
      { id: 'book-bridal-party-attire', label: 'Book attire for bridal party', category: 'Dresses' },
      { id: 'schedule-fittings', label: 'Schedule dress fittings', category: 'Dresses' },
    ],
  },
  {
    slug: 'month-6',
    badge: '6 months',
    title: 'Legal & Logistics',
    items: [
      { id: 'apply-marriage-license', label: 'Apply for marriage license', category: 'Planning' },
      { id: 'book-officiant', label: 'Book officiant or religious leader', category: 'Planning' },
      { id: 'finalize-menu', label: 'Finalize wedding menu with caterer', category: 'Catering' },
      { id: 'order-cake', label: 'Order wedding cake', category: 'Catering' },
      { id: 'send-invitations', label: 'Send wedding invitations', category: 'Planning' },
      { id: 'book-hotel-blocks', label: 'Book hotel blocks for out-of-town guests', category: 'Planning' },
    ],
  },
  {
    slug: 'month-4',
    badge: '4 months',
    title: 'Decor & Details',
    items: [
      { id: 'hire-decorator', label: 'Hire wedding decorator', category: 'Decor', cta: { label: 'Browse Decor', href: '/categories/decor' } },
      { id: 'finalize-flowers', label: 'Finalize flower arrangements', category: 'Decor' },
      { id: 'order-rings', label: 'Order wedding rings', category: 'Planning' },
      { id: 'book-photo-booth', label: 'Book photo booth (optional)', category: 'Photo & Video' },
      { id: 'finalize-playlist', label: 'Finalize music playlist', category: 'Music' },
      { id: 'schedule-rehearsal', label: 'Schedule wedding rehearsal', category: 'Planning' },
    ],
  },
  {
    slug: 'month-2',
    badge: '2 months',
    title: 'Final Vendor Confirmations',
    items: [
      { id: 'confirm-vendors', label: 'Confirm all vendors and contracts', category: 'Planning' },
      { id: 'final-payment-deposits', label: 'Make final payments/deposits', category: 'Planning' },
      { id: 'wedding-website', label: 'Set up wedding website', category: 'Planning' },
      { id: 'guest-gift-registry', label: 'Finalize gift registry', category: 'Planning' },
      { id: 'hair-makeup-trial', label: 'Schedule hair and makeup trial', category: 'Beauty' },
      { id: 'finalize-seating', label: 'Finalize reception seating chart', category: 'Planning' },
    ],
  },
  {
    slug: 'month-1',
    badge: '1 month',
    title: 'Last-Minute Preparations',
    items: [
      { id: 'write-vows', label: 'Write your wedding vows', category: 'Planning' },
      { id: 'finalize-details', label: 'Finalize ceremony and reception details', category: 'Planning' },
      { id: 'pick-up-attire', label: 'Pick up wedding attire', category: 'Dresses' },
      { id: 'thank-you-cards', label: 'Purchase thank-you cards', category: 'Planning' },
      { id: 'final-guest-count', label: 'Confirm final guest count', category: 'Planning' },
      { id: 'emergency-kit', label: 'Prepare emergency kit', category: 'Planning' },
    ],
  },
  {
    slug: 'week-of',
    badge: 'Week-of',
    title: 'Final Week Tasks',
    items: [
      { id: 'wedding-rehearsal', label: 'Attend wedding rehearsal', category: 'Planning' },
      { id: 'pick-up-rings', label: 'Pick up wedding rings', category: 'Planning' },
      { id: 'confirm-weather-plan', label: 'Confirm weather backup plan', category: 'Planning' },
      { id: 'beauty-appointments', label: 'Schedule beauty appointments', category: 'Beauty' },
      { id: 'pack-honeymoon', label: 'Pack for honeymoon', category: 'Planning' },
      { id: 'rest-relax', label: 'Rest and relax before the big day', category: 'Planning' },
    ],
  },
  {
    slug: 'day-of',
    badge: 'Day-of',
    title: 'Wedding Day Checklist',
    items: [
      { id: 'morning-prep', label: 'Morning preparation and photos', category: 'Photo & Video' },
      { id: 'ceremony-setup', label: 'Ceremony setup and timing', category: 'Planning' },
      { id: 'reception-transition', label: 'Transition to reception', category: 'Planning' },
      { id: 'first-dance', label: 'First dance and speeches', category: 'Music' },
      { id: 'cake-cutting', label: 'Cake cutting ceremony', category: 'Catering' },
      { id: 'send-off', label: 'Wedding send-off', category: 'Planning' },
      { id: 'preserve-memories', label: 'Preserve memories and collect cards', category: 'Planning' },
    ],
  },
];

export const getTotalItems = (): number => {
  return CHECKLIST.reduce((total, section) => total + section.items.length, 0);
};

export const getSectionItems = (slug: string): ChecklistItem[] => {
  const section = CHECKLIST.find(s => s.slug === slug);
  return section?.items || [];
};

export const getCategories = (): string[] => {
  const categories = new Set<string>();
  CHECKLIST.forEach(section => {
    section.items.forEach(item => {
      if (item.category) categories.add(item.category);
    });
  });
  return Array.from(categories).sort();
};
