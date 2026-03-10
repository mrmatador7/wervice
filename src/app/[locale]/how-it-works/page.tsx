import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FiSearch, FiGrid, FiPhone, FiCheckCircle, FiShield, FiClock } from 'react-icons/fi';
import { localeAlternates, toAbsoluteUrl } from '@/lib/seo/site-url';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('how-it-works');
  const canonical = toAbsoluteUrl(`/${locale}/how-it-works`);
  const seoCopy = {
    en: {
      ogTitle: 'How Wervice Works',
      keywords: 'wedding planning Morocco, wedding vendors, Moroccan weddings, wedding marketplace',
    },
    fr: {
      ogTitle: 'Comment Wervice fonctionne',
      keywords: 'organisation mariage maroc, prestataires mariage, mariage marocain, marketplace mariage',
    },
    ar: {
      ogTitle: 'كيف يعمل Wervice',
      keywords: 'تخطيط الزفاف في المغرب, مزودو خدمات الزفاف, زفاف مغربي, منصة الزفاف',
    },
  } as const;
  const current = seoCopy[locale as keyof typeof seoCopy] || seoCopy.en;

  return {
    title: t('title'),
    description: t('description'),
    keywords: current.keywords,
    openGraph: {
      title: current.ogTitle,
      description: t('description'),
      type: 'website',
      url: canonical,
    },
    alternates: {
      canonical,
      languages: localeAlternates('/how-it-works'),
    },
  };
}

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#F3F1EE] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#11190C] mb-6">
            How Wervice Works
          </h1>
          <p className="text-xl text-[#787664] max-w-3xl mx-auto leading-relaxed">
            Plan your dream wedding in Morocco with ease — discover vendors, compare options, and contact them directly.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-xl shadow-sm ring-1 ring-black/5 flex items-center justify-center mx-auto mb-6">
                <FiSearch className="w-10 h-10 text-[#11190C]" />
              </div>
              <h3 className="text-xl font-semibold text-[#11190C] mb-4">Browse & Discover</h3>
              <p className="text-[#787664] leading-relaxed">
                Explore thousands of verified wedding vendors across Morocco. Filter by category, location, and budget to find the perfect match for your vision.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-xl shadow-sm ring-1 ring-black/5 flex items-center justify-center mx-auto mb-6">
                <FiGrid className="w-10 h-10 text-[#11190C]" />
              </div>
              <h3 className="text-xl font-semibold text-[#11190C] mb-4">Compare & Select</h3>
              <p className="text-[#787664] leading-relaxed">
                Read reviews, compare pricing, and view portfolios side by side. Make informed decisions with all the information you need in one place.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-xl shadow-sm ring-1 ring-black/5 flex items-center justify-center mx-auto mb-6">
                <FiPhone className="w-10 h-10 text-[#11190C]" />
              </div>
              <h3 className="text-xl font-semibold text-[#11190C] mb-4">Contact Directly</h3>
              <p className="text-[#787664] leading-relaxed">
                Connect directly with vendors through WhatsApp or email. Book consultations, ask questions, and secure your wedding professionals instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Flow */}
      <section className="py-16 bg-[#F3F1EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#11190C] mb-4">Your Wedding Planning Journey</h2>
            <p className="text-[#787664] max-w-2xl mx-auto">
              Follow these simple steps to plan your perfect Moroccan wedding
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-[#CAC4B7] opacity-50"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center relative">
                <div className="w-16 h-16 bg-[#D9FF0A] rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="text-xl font-bold text-[#11190C]">1</span>
                </div>
                <h3 className="text-xl font-semibold text-[#11190C] mb-2">Choose Category</h3>
                <p className="text-[#787664]">Venues, catering, photography, or planning</p>
              </div>

              {/* Step 2 */}
              <div className="text-center relative">
                <div className="w-16 h-16 bg-[#D9FF0A] rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="text-xl font-bold text-[#11190C]">2</span>
                </div>
                <h3 className="text-xl font-semibold text-[#11190C] mb-2">Explore Vendors</h3>
                <p className="text-[#787664]">Browse portfolios, read reviews, compare prices</p>
              </div>

              {/* Step 3 */}
              <div className="text-center relative">
                <div className="w-16 h-16 bg-[#D9FF0A] rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="text-xl font-bold text-[#11190C]">3</span>
                </div>
                <h3 className="text-xl font-semibold text-[#11190C] mb-2">Contact Vendor</h3>
                <p className="text-[#787664]">Message directly and book your services</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#11190C] mb-4">Why Choose Wervice?</h2>
            <p className="text-[#787664] max-w-2xl mx-auto">
              We make wedding planning simple, transparent, and stress-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Trust Card 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D9FF0A] rounded-xl flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="w-8 h-8 text-[#11190C]" />
              </div>
              <h3 className="text-xl font-semibold text-[#11190C] mb-4">Wide Range of Vendors</h3>
              <p className="text-[#787664] leading-relaxed">
                Access thousands of verified wedding professionals across all categories and price ranges in Morocco.
              </p>
            </div>

            {/* Trust Card 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D9FF0A] rounded-xl flex items-center justify-center mx-auto mb-6">
                <FiShield className="w-8 h-8 text-[#11190C]" />
              </div>
              <h3 className="text-xl font-semibold text-[#11190C] mb-4">Easy to Compare Options</h3>
              <p className="text-[#787664] leading-relaxed">
                Side-by-side comparisons, detailed portfolios, and honest reviews help you make the best choice.
              </p>
            </div>

            {/* Trust Card 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D9FF0A] rounded-xl flex items-center justify-center mx-auto mb-6">
                <FiClock className="w-8 h-8 text-[#11190C]" />
              </div>
              <h3 className="text-xl font-semibold text-[#11190C] mb-4">Contact Vendors Directly</h3>
              <p className="text-[#787664] leading-relaxed">
                Skip the middleman and communicate directly with vendors for faster responses and better service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#D9FF0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#11190C] mb-6">
            Start Planning Your Wedding Today
          </h2>
          <p className="text-xl text-[#11190C]/80 mb-8 max-w-2xl mx-auto">
            Join thousands of couples who have found their perfect Moroccan wedding vendors through Wervice.
          </p>
          <Link
            href="/vendors"
            className="inline-flex items-center px-8 py-4 bg-[#11190C] text-white font-bold rounded-xl hover:bg-[#0a0f0a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Explore Vendors
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
