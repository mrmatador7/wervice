'use client';

import CategoryRow from './CategoryRow';
import Section from '@/components/layout/Section';
import { usePathname } from 'next/navigation';

const venuesItems = [
  { name: 'Palais des Congrès', city: 'Casablanca', rating: 4.8, price: '15,000 MAD', coverUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop', href: '/vendors/palais-des-congres' },
  { name: 'Dar Moha', city: 'Marrakech', rating: 4.9, price: '25,000 MAD', coverUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop', href: '/vendors/dar-moha' },
];

const cateringItems = [
  { name: 'Authentic Moroccan Kitchen', city: 'Casablanca', rating: 4.9, price: '150 MAD', coverUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop', href: '/vendors/authentic-moroccan-kitchen' },
  { name: 'Fusion Feast', city: 'Casablanca', rating: 4.7, price: '200 MAD', coverUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', href: '/vendors/fusion-feast' },
  { name: 'Ocean View Catering', city: 'Agadir', rating: 4.5, price: '180 MAD', coverUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', href: '/vendors/ocean-view-catering' },
];

const photoVideoItems = [
  { name: 'Golden Moments', city: 'Casablanca', rating: 4.9, price: '5,000 MAD', coverUrl: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=800&auto=format&fit=crop', href: '/vendors/golden-moments' },
  { name: 'Studio Lumière', city: 'Rabat', rating: 4.7, price: '3,500 MAD', coverUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop', href: '/vendors/studio-lumiere' },
  { name: 'Desert Lens', city: 'Marrakech', rating: 4.7, price: '3,800 MAD', coverUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop', href: '/vendors/desert-lens' },
];

// Separator component for section dividers
function SectionSeparator() {
  return (
    <div className="py-4">
      <hr className="border-0 border-t border-[#E5E5E5] mx-auto max-w-7xl" />
    </div>
  );
}

export default function CategoryStack() {
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';

  // Update hrefs to include locale
  const localizedVenuesItems = venuesItems.map(item => ({
    ...item,
    href: `/${currentLocale}${item.href}`
  }));

  const localizedCateringItems = cateringItems.map(item => ({
    ...item,
    href: `/${currentLocale}${item.href}`
  }));

  const localizedPhotoVideoItems = photoVideoItems.map(item => ({
    ...item,
    href: `/${currentLocale}${item.href}`
  }));

  return (
    <div className="space-y-0">
      <Section variant="default">
        <CategoryRow
          title="Venues"
          subtitle="Discover top venues vendors across Morocco."
          ctaHref={`/${currentLocale}/vendors?category=venues`}
          seeMoreHref={`/${currentLocale}/vendors?category=venues`}
          items={localizedVenuesItems}
          colorVariant="light"
        />
      </Section>

      <SectionSeparator />

      <Section variant="default">
        <CategoryRow
          title="Catering"
          subtitle="Discover top catering vendors across Morocco."
          ctaHref={`/${currentLocale}/vendors?category=catering`}
          seeMoreHref={`/${currentLocale}/vendors?category=catering`}
          items={localizedCateringItems}
          colorVariant="light"
        />
      </Section>

      <SectionSeparator />

      <Section variant="default">
        <CategoryRow
          title="Photo & Video"
          subtitle="Capture your day with Morocco's best photographers & videographers."
          ctaHref={`/${currentLocale}/vendors?category=photo-video`}
          seeMoreHref={`/${currentLocale}/vendors?category=photo-video`}
          items={localizedPhotoVideoItems}
          colorVariant="light"
        />
      </Section>
    </div>
  );
}
