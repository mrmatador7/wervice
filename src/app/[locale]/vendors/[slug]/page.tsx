import { permanentRedirect, notFound } from 'next/navigation';
import { getVendorBySlug } from '@/lib/db/vendors';
import { VALID_CATEGORY_SLUGS } from '@/lib/categories';
import { vendorUrl } from '@/lib/vendor-url';

interface VendorPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

/**
 * Legacy vendor URL handler.
 * Permanently redirects /[locale]/vendors/[slug] → /[locale]/[city]/[category]/[slug]
 */
export default async function VendorPageLegacy({ params }: VendorPageProps) {
  const { locale, slug } = await params;

  // Legacy category slugs that were once served here
  if (VALID_CATEGORY_SLUGS.includes(slug as (typeof VALID_CATEGORY_SLUGS)[number])) {
    permanentRedirect(`/${locale}/categories/${slug}`);
  }

  const vendor = await getVendorBySlug(slug);
  if (!vendor) notFound();

  permanentRedirect(vendorUrl(vendor, locale));
}
