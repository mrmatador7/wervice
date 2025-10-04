import ListingsRail from '@/components/ListingsRail';
import { homepageListings } from '@/lib/mockListings';

export default function NewVendors() {
  return (
    <ListingsRail
      title="New Vendors"
      items={homepageListings}
      variant="carousel"
    />
  );
}
