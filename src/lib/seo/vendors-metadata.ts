import { normalizeCategory } from '@/lib/categories';

type SupportedLocale = 'en' | 'fr' | 'ar';

type CategoryTemplates = Record<
  string,
  {
    en: string;
    fr: string;
    ar: string;
  }
>;

const CATEGORY_DESCRIPTION_TEMPLATES: CategoryTemplates = {
  florist: {
    en: 'Find the best wedding florists in {location}. Discover beautiful bouquets, floral decorations, and custom arrangements for unforgettable weddings and events.',
    fr: 'Trouvez les meilleurs fleuristes de mariage {location}. Decouvrez de magnifiques bouquets, decorations florales et compositions sur mesure pour des mariages et evenements inoubliables.',
    ar: 'اعثر على أفضل منسقي الزهور لحفلات الزفاف {location}. اكتشف باقات جميلة وزينة زهور وتنسيقات مخصصة لحفلات زفاف ومناسبات لا تُنسى.',
  },
  dresses: {
    en: 'Explore stunning wedding dresses and evening gowns in {location}. Find designers, bridal boutiques, and rentals for your perfect wedding look.',
    fr: 'Explorez de superbes robes de mariee et robes de soiree {location}. Trouvez des createurs, boutiques bridal et locations pour votre look de mariage parfait.',
    ar: 'اكتشف فساتين زفاف وفساتين سهرة رائعة {location}. اعثر على مصممين وبوتيكات عرائس وخيارات تأجير لإطلالتك المثالية في الزفاف.',
  },
  venues: {
    en: 'Discover the best wedding venues in {location}. Browse villas, palaces, hotels, and reception spaces for unforgettable weddings and events.',
    fr: 'Decouvrez les meilleurs lieux de mariage {location}. Parcourez villas, palais, hotels et espaces de reception pour des mariages et evenements inoubliables.',
    ar: 'اكتشف أفضل أماكن الزفاف {location}. تصفح الفيلات والقصور والفنادق وقاعات الاستقبال لحفلات زفاف ومناسبات لا تُنسى.',
  },
  beauty: {
    en: 'Find professional wedding beauty services in {location} including makeup artists, hairstylists, and skincare specialists for your big day.',
    fr: 'Trouvez des services beaute mariage professionnels {location}, y compris maquilleurs, coiffeurs et specialistes skincare pour votre grand jour.',
    ar: 'اعثر على خدمات التجميل الاحترافية للزفاف {location} بما في ذلك خبراء المكياج وتصفيف الشعر والعناية بالبشرة ليومك الكبير.',
  },
  'photo-film': {
    en: 'Book the best wedding photographers and videographers in {location} to capture every moment of your wedding or special event.',
    fr: 'Reservez les meilleurs photographes et videastes de mariage {location} pour capturer chaque moment de votre mariage ou evenement special.',
    ar: 'احجز أفضل مصوري ومصوري فيديو الزفاف {location} لالتقاط كل لحظة من زفافك أو مناسبتك الخاصة.',
  },
  caterer: {
    en: 'Discover top wedding caterers in {location} offering gourmet menus, buffets, and professional catering services for weddings and events.',
    fr: 'Decouvrez les meilleurs traiteurs de mariage {location} proposant menus gourmets, buffets et services traiteur professionnels pour mariages et evenements.',
    ar: 'اكتشف أفضل خدمات تموين الزفاف {location} مع قوائم طعام فاخرة وبوفيهات وخدمات تموين احترافية لحفلات الزفاف والمناسبات.',
  },
  decor: {
    en: 'Find wedding decoration specialists in {location}. Explore unique event styling, floral decor, and beautiful setups for unforgettable celebrations.',
    fr: 'Trouvez des specialistes de la decoration de mariage {location}. Explorez un styling evenementiel unique, decor floral et mises en scene elegantes pour des celebrations inoubliables.',
    ar: 'اعثر على متخصصي ديكور الزفاف {location}. استكشف تنسيقات فعاليات فريدة وديكور زهور وتجهيزات جميلة لاحتفالات لا تُنسى.',
  },
  negafa: {
    en: 'Book a professional negafa in {location} for your wedding. Traditional outfits, ceremony guidance, and Moroccan wedding expertise.',
    fr: 'Reservez une negafa professionnelle {location} pour votre mariage. Tenues traditionnelles, accompagnement ceremoniel et expertise du mariage marocain.',
    ar: 'احجز نقافة محترفة {location} لحفل زفافك. أزياء تقليدية وإرشاد للمراسم وخبرة في الأعراس المغربية.',
  },
  artist: {
    en: 'Find wedding entertainers in {location} including singers, bands, DJs, and performers to create an unforgettable wedding atmosphere.',
    fr: 'Trouvez des artistes de mariage {location}, y compris chanteurs, groupes, DJs et performers pour creer une ambiance de mariage inoubliable.',
    ar: 'اعثر على فناني الترفيه لحفلات الزفاف {location} بما في ذلك المغنين والفرق ودي جي والمؤدين لصنع أجواء زفاف لا تُنسى.',
  },
  'event-planner': {
    en: 'Discover professional wedding planners in {location} to organize every detail of your wedding or special event with ease.',
    fr: 'Decouvrez des wedding planners professionnels {location} pour organiser chaque detail de votre mariage ou evenement special en toute simplicite.',
    ar: 'اكتشف منظمي حفلات الزفاف المحترفين {location} لتنظيم كل تفاصيل زفافك أو مناسبتك الخاصة بسهولة.',
  },
  cakes: {
    en: 'Find the best wedding cake designers in {location}. Explore elegant wedding cakes, custom desserts, and creative pastry artists.',
    fr: 'Trouvez les meilleurs createurs de wedding cakes {location}. Explorez des gateaux elegants, desserts sur mesure et patissiers creatifs.',
    ar: 'اعثر على أفضل مصممي كعكات الزفاف {location}. استكشف كعكات زفاف أنيقة وحلويات مخصصة وفناني حلويات مبدعين.',
  },
};

function resolveLocale(locale?: string): SupportedLocale {
  const normalized = (locale || 'en').toLowerCase();
  if (normalized === 'fr') return 'fr';
  if (normalized === 'ar') return 'ar';
  return 'en';
}

function locationText(locale: SupportedLocale, cityLabel?: string): string {
  if (cityLabel) {
    if (locale === 'fr') return `a ${cityLabel}`;
    if (locale === 'ar') return `في ${cityLabel}`;
    return cityLabel;
  }
  if (locale === 'fr') return 'au Maroc';
  if (locale === 'ar') return 'في المغرب';
  return 'Morocco';
}

export function categoryMetaDescription(params: {
  categorySlug?: string | null;
  locale?: string;
  cityLabel?: string;
}): string | null {
  const normalizedCategory = normalizeCategory(params.categorySlug || null);
  if (!normalizedCategory) return null;

  const locale = resolveLocale(params.locale);
  const template = CATEGORY_DESCRIPTION_TEMPLATES[normalizedCategory]?.[locale];
  if (!template) return null;

  return template.replace('{location}', locationText(locale, params.cityLabel));
}

