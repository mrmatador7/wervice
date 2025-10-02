'use client';

import CategoryRow from './CategoryRow';

const venuesItems = [
  { name: 'Palais des Congrès', city: 'Casablanca', rating: 4.8, price: '15,000 MAD', coverUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop', href: '/vendors/venues/palais-des-congres' },
  { name: 'Dar Moha', city: 'Marrakech', rating: 4.9, price: '25,000 MAD', coverUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop', href: '/vendors/venues/dar-moha' },
  { name: 'Royal Palace', city: 'Rabat', rating: 4.9, price: '30,000 MAD', coverUrl: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?q=80&w=800&auto=format&fit=crop', href: '/vendors/venues/royal-palace' },
];

const cateringItems = [
  { name: 'Traditional Tagine', city: 'Marrakech', rating: 4.8, price: '9,500 MAD', coverUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop', href: '/vendors/catering/traditional-tagine' },
  { name: 'Chefs Marocains', city: 'Casablanca', rating: 4.6, price: '8,000 MAD', coverUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop', href: '/vendors/catering/chefs-marocains' },
  { name: 'Mediterranean Feast', city: 'Tangier', rating: 4.7, price: '7,500 MAD', coverUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb5?q=80&w=800&auto=format&fit=crop', href: '/vendors/catering/mediterranean-feast' },
];

const photoVideoItems = [
  { name: 'Golden Moments', city: 'Casablanca', rating: 4.9, price: '5,000 MAD', coverUrl: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=800&auto=format&fit=crop', href: '/vendors/photo-video/golden-moments' },
  { name: 'Studio Lumière', city: 'Rabat', rating: 4.7, price: '3,500 MAD', coverUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop', href: '/vendors/photo-video/studio-lumiere' },
  { name: 'Desert Lens', city: 'Marrakech', rating: 4.7, price: '3,800 MAD', coverUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop', href: '/vendors/photo-video/desert-lens' },
];

export default function CategoryStack() {
  return (
    <div className="space-y-10">
      <CategoryRow
        title="Venues"
        subtitle="Discover top venues vendors across Morocco."
        ctaHref="/vendors?category=venues"
        seeMoreHref="/vendors?category=venues"
        items={venuesItems}
      />

      <CategoryRow
        title="Catering"
        subtitle="Discover top catering vendors across Morocco."
        ctaHref="/vendors?category=catering"
        seeMoreHref="/vendors?category=catering"
        items={cateringItems}
      />

      <CategoryRow
        title="Photo & Video"
        subtitle="Capture your day with Morocco's best photographers & videographers."
        ctaHref="/vendors?category=photo-video"
        seeMoreHref="/vendors?category=photo-video"
        items={photoVideoItems}
      />
    </div>
  );
}
