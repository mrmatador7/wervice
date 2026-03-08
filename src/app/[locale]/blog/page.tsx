import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { localeAlternates, toAbsoluteUrl } from '@/lib/seo/site-url';

// Dynamically import the client component
const BlogPageContent = dynamic(() => import('./BlogPageContent'), {
  loading: () => (
    <div className="min-h-screen bg-[#f5f5f4] flex items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-800"></div>
    </div>
  )
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = toAbsoluteUrl(`/${locale}/blog`);
  return {
    title: 'Wedding Blog | Wervice',
    description: 'Wedding planning guides, inspiration, and vendor tips for Moroccan weddings.',
    alternates: {
      canonical,
      languages: localeAlternates('/blog'),
    },
    openGraph: {
      title: 'Wedding Blog | Wervice',
      description: 'Wedding planning guides, inspiration, and vendor tips for Moroccan weddings.',
      type: 'website',
      url: canonical,
    },
  };
}

// Export the client component as default
export default function BlogPage() {
  return <BlogPageContent />;
}
