import ListingsRail from './ListingsRail';
import { homepageListings } from '@/data/mockListings';

export default function NewVendors() {
  return (
    <ListingsRail
      title="New Vendors"
      items={homepageListings}
      variant="carousel"
    />
  );
}
