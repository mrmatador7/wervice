import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { FiArrowLeft, FiMapPin, FiPhone, FiMail, FiGlobe, FiMessageCircle, FiHeart, FiStar } from 'react-icons/fi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getVendorBySlug } from '@/lib/vendors';

interface VendorDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: VendorDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vendor = getVendorBySlug(slug);

  if (!vendor) {
    return {
      title: 'Vendor Not Found | Wervice',
    };
  }

  return {
    title: `${vendor.name} - ${vendor.category} in ${vendor.city} | Wervice`,
    description: vendor.description || `Book ${vendor.name} for your wedding in ${vendor.city}, Morocco. ${vendor.category} services starting at ${vendor.startingPrice?.toLocaleString()} MAD.`,
    openGraph: {
      title: `${vendor.name} - ${vendor.category}`,
      description: vendor.description || `Professional ${vendor.category.toLowerCase()} services in ${vendor.city}, Morocco.`,
      images: [{ url: vendor.coverImage, alt: vendor.name }],
    },
  };
}

export default async function VendorDetailPage({ params }: VendorDetailPageProps) {
  const { slug } = await params;
  const vendor = getVendorBySlug(slug);

  if (!vendor) {
    notFound();
  }

  const whatsappUrl = vendor.whatsapp ? `https://wa.me/${vendor.whatsapp}` : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-16">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-[var(--sub)]">
              <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
              <span>/</span>
              <Link href="/vendors" className="hover:text-[var(--ink)]">Vendors</Link>
              <span>/</span>
              <span className="text-[var(--ink)] font-medium">{vendor.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Image */}
              <div className="lg:w-2/3">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
                  <img
                    src={vendor.coverImage}
                    alt={vendor.name}
                    className="w-full h-full object-cover"
                  />
                  {vendor.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 bg-[#D7FF1F] text-[var(--wervice-lime-ink)] text-sm font-semibold rounded-full">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Vendor Info */}
              <div className="lg:w-1/3">
                <div className="bg-white rounded-2xl border border-[var(--stroke)] p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-[var(--ink)] mb-2">
                        {vendor.name}
                      </h1>
                      <p className="text-[var(--sub)] text-lg mb-2">
                        {vendor.category} in {vendor.city}
                      </p>

                      {/* Rating */}
                      {vendor.rating && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            <FiStar className="w-4 h-4 fill-[#D7FF1F] text-[#D7FF1F]" />
                            <span className="font-semibold text-[var(--ink)]">{vendor.rating}</span>
                            {vendor.reviewsCount && (
                              <span className="text-[var(--sub)]">({vendor.reviewsCount} reviews)</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  {vendor.startingPrice && (
                    <div className="mb-6">
                      <p className="text-2xl font-bold text-[var(--ink)]">
                        Starting at {vendor.startingPrice.toLocaleString()} MAD
                      </p>
                      <p className="text-[var(--sub)] text-sm mt-1">Price may vary based on package</p>
                    </div>
                  )}

                  {/* Tags */}
                  {vendor.tags && vendor.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {vendor.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-3 py-1 bg-[var(--chip)] text-[var(--sub)] text-sm rounded-full border border-[var(--stroke)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3">
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D7FF1F] text-[var(--wervice-lime-ink)] font-semibold rounded-xl hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#D7FF1F] focus:ring-offset-2"
                      >
                        <FiMessageCircle className="w-4 h-4" />
                        Contact on WhatsApp
                      </a>
                    )}

                    <div className="flex gap-3">
                      <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border border-[var(--stroke)] text-[var(--ink)] font-medium rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#D7FF1F] focus:ring-offset-2">
                        <FiMail className="w-4 h-4" />
                        Email
                      </button>
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-[var(--stroke)] text-[var(--ink)] font-medium rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#D7FF1F] focus:ring-offset-2">
                        <FiHeart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-6 pt-6 border-t border-[var(--stroke)]">
                    <h3 className="font-semibold text-[var(--ink)] mb-3">Contact Information</h3>
                    <div className="space-y-2 text-[var(--sub)]">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="w-4 h-4" />
                        <span>{vendor.city}, Morocco</span>
                      </div>
                      {vendor.website && (
                        <div className="flex items-center gap-2">
                          <FiGlobe className="w-4 h-4" />
                          <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-[#D7FF1F] hover:underline">
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Placeholder */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-[var(--stroke)] p-12 text-center">
              <h2 className="text-2xl font-bold text-[var(--ink)] mb-4">Coming Soon</h2>
              <p className="text-[var(--sub)] mb-6">
                We're working on a detailed profile for {vendor.name}. In the meantime, you can contact them directly to learn more about their services.
              </p>
              <Link
                href="/vendors"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D7FF1F] text-[var(--wervice-lime-ink)] font-semibold rounded-xl hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#D7FF1F] focus:ring-offset-2"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back to Vendors
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
