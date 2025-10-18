import VendorCardShowcase from '@/components/cards/VendorCardShowcase';
import IconForCategory from '@/components/icons/IconForCategory';

export default function ShowcasePage() {
  // Simple test data
  const testCard = {
    id: 'test-1',
    name: 'Beautiful Wedding Venue',
    href: '/en/vendors/test-venue',
    city: 'Marrakech',
    subtitle: 'Wedding Venues',
    blurb: 'Stunning garden venue perfect for weddings',
    images: [
      { src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=320&h=460&fit=crop', alt: 'Beautiful Venue' },
    ],
    categoryIcon: <IconForCategory category="venues" size={16} />,
    badge: "Featured",
    rating: 4.8,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">VendorCardShowcase Demo</h1>
        <div className="flex justify-center">
          <VendorCardShowcase {...testCard} />
        </div>
      </div>
    </div>
  );
}
