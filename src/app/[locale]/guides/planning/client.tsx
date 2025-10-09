'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getAllChapters, getTimelineSteps, getFAQItems } from '@/lib/planningChapters';

const VENDOR_CATEGORIES = [
  { name: 'Venues', href: '/categories/venues', icon: '/categories/venues.png' },
  { name: 'Catering', href: '/categories/catering', icon: '/categories/catering.png' },
  { name: 'Photo & Video', href: '/categories/photo-video', icon: '/categories/photo.png' },
  { name: 'Planning', href: '/categories/planning', icon: '/categories/event planner.png' },
  { name: 'Beauty', href: '/categories/beauty', icon: '/categories/beauty.png' },
  { name: 'Decor', href: '/categories/decor', icon: '/categories/decor.png' },
  { name: 'Music', href: '/categories/music', icon: '/categories/music.png' },
  { name: 'Dresses', href: '/categories/dresses', icon: '/categories/dresses.png' }
];

const CITY_GUIDES = [
  { name: 'Casablanca', href: '/guides/cities/casablanca' },
  { name: 'Marrakech', href: '/guides/cities/marrakech' },
  { name: 'Rabat', href: '/guides/cities/rabat' },
  { name: 'Tangier', href: '/guides/cities/tangier' },
  { name: 'Agadir', href: '/guides/cities/agadir' },
  { name: 'Fes', href: '/guides/cities/fes' }
];

function scrollToTOC() {
  document.getElementById('toc')?.scrollIntoView({ behavior: 'smooth' });
}

function TimelineStepper() {
  const steps = getTimelineSteps();

  return (
    <section className="mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">12-Month Planning Timeline</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <Link
            key={step.chapterSlug}
            href={`/guides/planning/${step.chapterSlug}`}
            className="group bg-white rounded-2xl border border-[var(--stroke)] shadow-sm hover:shadow-md transition-all duration-300 p-6 hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[var(--chip)] rounded-xl flex items-center justify-center text-2xl text-[var(--ink)]">
                {step.icon}
              </div>

              <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--wervice-lime)] bg-white px-2.5 py-1 text-[13px] font-medium text-[var(--ink)]">
                    <i className="h-1.5 w-1.5 rounded-full bg-[var(--wervice-lime)]" aria-hidden />
                    {step.months === 0 ? 'Final' : `${step.months} months`}
                  </span>
                </div>

                <h3 className="font-semibold text-[var(--ink)] mb-2 group-hover:text-[var(--wervice-lime-ink)] transition-colors">
                  {step.title}
                </h3>

                <p className="text-sm text-[var(--sub)] mb-3 leading-relaxed">{step.description}</p>

                <ul className="space-y-1 mb-4">
                  {step.tasks.slice(0, 3).map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-center gap-2 text-sm text-[var(--sub)]">
                      <div className="flex-shrink-0 w-3 h-3 bg-[var(--wervice-lime)] text-[var(--wervice-lime-ink)] rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                      <span className="line-clamp-1">{task}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center text-sm font-medium text-[var(--ink)] underline decoration-[var(--wervice-lime)] underline-offset-4 hover:decoration-2 transition-all">
                  Read chapter
                  <FiArrowRight className="w-4 h-4 ml-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function VendorCTA() {
  return (
    <section className="mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Find Moroccan Wedding Vendors</h2>
      <p className="text-lg text-slate-600 mb-8 max-w-2xl">
        Connect with trusted local vendors for every aspect of your Moroccan wedding
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {VENDOR_CATEGORIES.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group bg-white rounded-2xl border border-[var(--stroke)] shadow-sm hover:shadow-md transition-all duration-300 p-4 hover:-translate-y-0.5"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative w-12 h-12 mb-3">
                <Image
                  src={category.icon}
                  alt={category.name}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-medium text-slate-900 group-hover:text-[#D7FF1F] transition-colors">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CityGuides() {
  return (
    <section className="mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Wedding Cities in Morocco</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CITY_GUIDES.map((city) => (
          <Link
            key={city.name}
            href={city.href}
            className="group bg-white rounded-2xl border border-[var(--stroke)] shadow-sm hover:shadow-md transition-all duration-300 p-6 text-center hover:-translate-y-0.5"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-[#D7FF1F] transition-colors">
              {city.name}
            </h3>
            <p className="text-sm text-slate-600 mt-1">Wedding guide</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = getFAQItems();

  return (
    <section className="mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details key={index} className="bg-white rounded-2xl border border-[var(--stroke)] shadow-sm group">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors">
              <h3 className="font-semibold text-slate-900 pr-4">{faq.question}</h3>
              <svg
                className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-6 pb-6">
              <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function StickyTOC() {
  const chapters = getAllChapters();

  return (
    <aside className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-6">
        <div className="bg-white rounded-2xl border border-[var(--stroke)] shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Planning Guide Chapters</h3>

          <nav className="space-y-2">
            {chapters.map((chapter) => (
              <Link
                key={chapter.slug}
                href={`/guides/planning/${chapter.slug}`}
                className="block py-2 px-3 rounded-lg text-sm text-[var(--sub)] hover:bg-[var(--chip)] hover:text-[var(--ink)] transition-colors"
              >
                <div className="font-medium">{chapter.title}</div>
                <div className="inline-flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 bg-[var(--wervice-lime)] rounded-full" aria-hidden></span>
                  <span className="text-xs text-[var(--sub)]">{chapter.readTime} min read</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}

export default function PlanningGuideClient() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                The Complete Moroccan Wedding Planning Guide
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-6">
                Step-by-step timeline, checklists, and local tips to plan with confidence.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <span className="inline-flex items-center rounded-full bg-[var(--wervice-lime)] text-[var(--wervice-lime-ink)] px-3 py-1 text-xs font-semibold shadow-sm">
                  Updated Sep 2025
                </span>
                <span className="inline-flex items-center rounded-full bg-[var(--chip)] text-[var(--sub)] border border-[var(--stroke)] px-3 py-1 text-xs font-medium">
                  15–20 min read
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={scrollToTOC}
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--wervice-lime)] text-[var(--wervice-lime-ink)] px-5 py-2.5 font-semibold shadow-[0_6px_20px_-8px_rgba(14,16,8,.35)] hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--wervice-lime)] focus:ring-offset-2"
                >
                  Start the Guide
                </button>
                <Link
                  href="/vendors"
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--wervice-lime)] text-[var(--wervice-lime-ink)] px-5 py-2.5 font-semibold shadow-[0_6px_20px_-8px_rgba(14,16,8,.35)] hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--wervice-lime)] focus:ring-offset-2"
                >
                  Find Vendors
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex gap-12">
              {/* Content */}
              <div className="flex-1 max-w-3xl">
                {/* How to Use This Guide */}
                <section className="mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">How to Use This Guide</h2>
                  <div className="bg-white rounded-2xl border border-[var(--stroke)] shadow-sm p-6 md:p-8">
                    <p className="text-slate-600 leading-relaxed mb-6">
                      This comprehensive guide follows a 12-month wedding planning timeline, perfect for couples planning
                      their Moroccan dream wedding. Each chapter breaks down what to do, when to do it, and includes
                      practical checklists and vendor recommendations.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                      <div className="text-center p-4 bg-[var(--chip)] rounded-xl border border-[var(--stroke)]">
                        <div className="text-2xl mb-2">📅</div>
                        <h3 className="font-semibold text-[var(--ink)] mb-1">Timeline</h3>
                        <p className="text-sm text-[var(--sub)]">12-month planning schedule</p>
                      </div>
                      <div className="text-center p-4 bg-[var(--chip)] rounded-xl border border-[var(--stroke)] relative">
                        <div className="text-2xl mb-2">🎯</div>
                        <h3 className="font-semibold text-[var(--ink)] mb-1">Local Tips</h3>
                        <p className="text-sm text-[var(--sub)]">Moroccan wedding expertise</p>
                        <div className="absolute top-2 right-2 w-2 h-2 bg-[var(--wervice-lime)] rounded-full" aria-hidden></div>
                      </div>
                    </div>
                  </div>
                </section>

                <TimelineStepper />
                <VendorCTA />
                <CityGuides />
                <FAQSection />
              </div>

              {/* Sticky TOC */}
              <StickyTOC />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
