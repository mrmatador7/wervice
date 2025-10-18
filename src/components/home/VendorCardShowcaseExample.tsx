import VendorCardShowcase, { VendorCardShowcaseProps } from '@/components/cards/VendorCardShowcase';
import IconForCategory from '@/components/icons/IconForCategory';

// Inline sample data to avoid import issues
const sampleListings = [
  {
    id: '1',
    name: 'Palais des Congrès',
    city: 'Casablanca',
    category: 'Venues',
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=320&h=460&fit=crop',
    rating: 4.8,
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Dar Moha',
    city: 'Marrakech',
    category: 'Venues',
    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=320&h=460&fit=crop',
    rating: 4.9,
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Studio Lumière',
    city: 'Rabat',
    category: 'Photo & Video',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=320&h=460&fit=crop',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Chefs Marocains',
    city: 'Tangier',
    category: 'Catering',
    coverImage: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=320&h=460&fit=crop',
    rating: 4.6,
  },
  {
    id: '5',
    name: 'Wedding Dreams Co.',
    city: 'Agadir',
    category: 'Event Planner',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=320&h=460&fit=crop',
    rating: 4.8,
  },
  {
    id: '6',
    name: 'Belle Mariée',
    city: 'Fes',
    category: 'Dresses',
    coverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=320&h=460&fit=crop',
    rating: 4.9,
  },
];

// Mapper function to convert from sample data to VendorCardShowcaseProps
const toShowcaseCard = (listing: any): VendorCardShowcaseProps => ({
  id: listing.id,
  name: listing.name,
  href: `/en/vendors/${listing.id}`,
  city: listing.city,
  subtitle: listing.category,
  blurb: `Professional ${listing.category.toLowerCase()} services in ${listing.city}`,
  images: [
    { src: listing.coverImage, alt: listing.name },
  ],
  categoryIcon: <IconForCategory category={listing.category.toLowerCase()} size={16} />,
  badge: listing.isFavorite ? "Featured" : undefined,
  rating: listing.rating || 4.5,
});

export default function VendorCardShowcaseExample() {
  // Get sample vendors
  const sampleVendors = sampleListings.map(toShowcaseCard);

  return (
    <section className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="font-inter font-bold text-2xl md:text-3xl text-gray-900 mb-8">
        Vendor Showcase Cards Example
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleVendors.map((vendor) => (
          <VendorCardShowcase
            key={vendor.id}
            {...vendor}
          />
        ))}
      </div>

      {/* Example of horizontal carousel usage */}
      <div className="mt-12">
        <h3 className="font-inter font-bold text-xl text-gray-900 mb-6">
          Horizontal Carousel Example
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
          {sampleVendors.map((vendor) => (
            <div key={vendor.id} className="snap-start shrink-0">
              <VendorCardShowcase {...vendor} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
