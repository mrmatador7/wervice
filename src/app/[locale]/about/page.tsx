'use client';

import Link from 'next/link';

const KPIS = [
  { value: '10,000+', label: 'Couples Served' },
  { value: '250+', label: 'Vendors' }, // UPDATED
  { value: '15', label: 'Cities Covered' },
  { value: '4.8/5', label: 'Avg. Review' },
];

const FEATURES = [
  {
    img: 'https://images.unsplash.com/photo-1533919717624-42dcca8d3d48?q=80&w=1200&auto=format&fit=crop',
    alt: 'Bride holding bouquet close-up',
    title: 'Trust & Transparency',
    body:
      'Verified profiles, clear pricing, and real reviews—so you can book with total confidence.',
  },
  {
    img: 'https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop',
    alt: 'Marrakech skyline at golden hour',
    title: 'Local Expertise',
    body:
      'From Casablanca to Marrakech, we highlight the best local talent and hidden gems.',
  },
  {
    img: 'https://images.unsplash.com/photo-1529634891413-4754a8b0a2c2?q=80&w=1200&auto=format&fit=crop',
    alt: 'Wedding table decor with candles',
    title: 'Time-Saving Tools',
    body:
      'Compare vendors, manage quotes, and message directly—everything in one place.',
  },
  {
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    alt: 'Newlywed couple walking in Moroccan sunlight',
    title: 'Support That Cares',
    body:
      'Friendly help from discovery to confirmation. We’re here for the big moments.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      {/* Hero */}
      <section className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 pt-14 md:pt-16 lg:pt-20">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
              We make planning your Moroccan wedding simple, joyful, and stress-free.
            </h1>
            <p className="mt-4 text-gray-600 max-w-prose">
              Wervice is Morocco's modern wedding marketplace. Discover trusted vendors,
              compare offers, and book everything in one place—with support at every step.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/vendors"
                aria-label="Browse vendors"
                className="inline-flex items-center rounded-full bg-lime-300 px-5 py-2.5 font-semibold text-black hover:bg-lime-400 transition"
              >
                Browse Vendors
                <span className="ml-2">→</span>
              </Link>
              <Link
                href="/contact"
                aria-label="Talk to Wervice support"
                className="inline-flex items-center rounded-full border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-900 hover:bg-gray-50 transition"
              >
                Talk to Us
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
              {/* Hero image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop"
                alt="Newlywed couple walking in Moroccan sunlight"
                loading="lazy"
                decoding="async"
                className="h-[360px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {KPIS.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
            >
              <div className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {kpi.value}
              </div>
              <div className="mt-1 text-sm text-gray-600">{kpi.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What we stand for */}
      <section className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 pb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          What we stand for
        </h2>
        <p className="mt-2 text-gray-600">
          A marketplace you can trust—for the moments that matter most.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="group rounded-2xl bg-white shadow-sm ring-1 ring-black/5 hover:shadow-md transition overflow-hidden"
            >
              <div className="h-28 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.img}
                  alt={f.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover group-hover:scale-[1.02] transition"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{f.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Confidence CTA */}
      <section className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 pb-16 md:pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-lime-100 to-lime-200 p-6 md:p-8 ring-1 ring-lime-300/50">
          <div className="grid gap-6 lg:grid-cols-[1fr,520px] items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                Plan with confidence
              </h3>
              <p className="mt-2 text-gray-700">
                Compare vendors, message directly, and confirm bookings in one place.
                100% free for couples.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/vendors"
                  aria-label="Browse vendors"
                  className="inline-flex items-center rounded-full bg-lime-300 px-5 py-2.5 font-semibold text-black hover:bg-lime-400 transition"
                >
                  Browse Vendors
                  <span className="ml-2">→</span>
                </Link>
                <Link
                  href="/support"
                  aria-label="Get support"
                  className="inline-flex items-center rounded-full border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-900 hover:bg-gray-50 transition"
                >
                  Get Support
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1529634891413-4754a8b0a2c2?q=80&w=1600&auto=format&fit=crop"
                alt="Happy couples and wedding vendors celebrating"
                loading="lazy"
                decoding="async"
                className="h-[240px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}