import CompactListingCard from '@/components/CompactListingCard';
import type { RailItem } from './CategoryRail';

export function renderVendorCard(item: RailItem) {
  return (
    <CompactListingCard
      id={item.id}
      name={item.name}
      city={item.city || ''}
      category="venues"
      coverImage={item.coverUrl}
      rating={item.rating}
      priceFrom={item.price ? parseInt(item.price.replace(/[^0-9]/g, '')) : undefined}
    />
  );
}
