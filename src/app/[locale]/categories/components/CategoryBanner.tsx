'use client';

interface CategoryBannerProps {
  categoryName: string;
  imageUrl?: string;
  category?: string;
}

/** Per-category taglines shown below the title in the hero */
const CATEGORY_TAGLINES: Record<string, string> = {
  florist:        'Discover the most beautiful wedding florists across Morocco',
  dresses:        'Find your perfect bridal gown or traditional kaftan in Morocco',
  venues:         'Explore the finest wedding venues across Morocco',
  beauty:         'Discover top bridal makeup artists and hair stylists in Morocco',
  'photo-film':   'Capture every unforgettable moment with Morocco\'s best photographers',
  caterer:        'Taste excellence — discover the finest wedding caterers in Morocco',
  decor:          'Transform your celebration with stunning wedding décor in Morocco',
  negafa:         'Honour Moroccan tradition with the finest Negafas in Morocco',
  artist:         'Set the perfect mood with exceptional wedding entertainment in Morocco',
  'event-planner':'Plan your perfect wedding with expert event planners across Morocco',
  cakes:          'Discover the most exquisite wedding cake vendors across Morocco',
};

export default function CategoryBanner({ categoryName, imageUrl, category }: CategoryBannerProps) {
  const tagline = (category && CATEGORY_TAGLINES[category]) || `Discover the best ${categoryName.toLowerCase()} vendors in Morocco`;

  return (
    <div className="w-full">
      <div className="relative w-full h-[280px] md:h-[320px] bg-[#0a0a0a] overflow-hidden">

        {/* Background image — fades in from center-right */}
        {imageUrl && (
          <>
            <img
              src={imageUrl}
              alt={categoryName}
              className="absolute inset-0 w-full h-full object-cover object-right"
            />
            {/* Left-heavy dark gradient so text stays legible */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
            {/* Bottom fade for cleaner transition to page */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
          </>
        )}

        {/* Fallback dark gradient when no image */}
        {!imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#11190C] via-neutral-900 to-neutral-800" />
        )}

        {/* Content — left-aligned on large screens, centered on mobile */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 md:px-12 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-4"
              style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}>
            {categoryName}
          </h1>
          <p className="text-white/75 text-sm md:text-base max-w-xl leading-relaxed">
            {tagline}
          </p>
        </div>
      </div>
    </div>
  );
}
