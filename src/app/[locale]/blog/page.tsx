import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import { localeAlternates, toAbsoluteUrl } from '@/lib/seo/site-url';
import { getBlogSeoSettings } from '@/lib/blog-admin-store';

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
  const seo = await getBlogSeoSettings();
  const canonical = toAbsoluteUrl(`/${locale}/blog`);
  return {
    title: seo.homepageTitle,
    description: seo.homepageDescription,
    alternates: {
      canonical,
      languages: localeAlternates('/blog'),
    },
    openGraph: {
      title: seo.homepageTitle,
      description: seo.homepageDescription,
      type: 'website',
      url: canonical,
    },
  };
}

// Export the client component as default
export default function BlogPage() {
  return <BlogPageContent />;
}
