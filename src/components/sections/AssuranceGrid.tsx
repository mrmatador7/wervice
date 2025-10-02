// src/components/sections/AssuranceGrid.tsx
'use client';

import Image from 'next/image';

export default function AssuranceGrid() {
  return (
    <section className="mt-14 md:mt-16 lg:mt-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="font-inter font-bold text-2xl md:text-3xl text-gray-900">
            Plan With Confidence
          </h2>
          <p className="text-gray-600 mt-2">
            Everything you need for a stress-free Moroccan wedding, all in one place.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Tall card on left - spans 2 rows */}
          <div className="col-span-12 md:col-span-4 row-span-2 rounded-xl bg-white shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-center w-14 h-14 bg-[#F9FAFB] rounded-full mb-6 group-hover:bg-[#D9FF00] transition-colors duration-300">
              <RingIcon className="h-7 w-7 text-gray-600 group-hover:text-black transition-colors duration-300" />
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-4">10,000+</div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">Weddings Planned</h3>
            <p className="text-gray-600 leading-relaxed">
              Join thousands of couples who trusted Wervice to create their perfect day.
            </p>
          </div>

          {/* Top row - 3 cards */}
          <div className="col-span-12 md:col-span-4 rounded-xl bg-white shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-center w-12 h-12 bg-[#F9FAFB] rounded-full mb-4 group-hover:bg-[#D9FF00] transition-colors duration-300">
              <ClockIcon className="h-6 w-6 text-gray-600 group-hover:text-black transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-bold text-[#111827] mb-2">Save Time & Energy</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Skip endless calls—find and compare your perfect vendors in minutes.
            </p>
          </div>

          <div className="col-span-12 md:col-span-4 rounded-xl bg-white shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-center w-12 h-12 bg-[#F9FAFB] rounded-full mb-4 group-hover:bg-[#D9FF00] transition-colors duration-300">
              <ShieldIcon className="h-6 w-6 text-gray-600 group-hover:text-black transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-bold text-[#111827] mb-2">Safe & Secure</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Verified vendors, direct contact, no hidden fees.
            </p>
          </div>

          {/* Bottom row - 2 wider cards */}
          <div className="col-span-12 md:col-span-4 rounded-xl bg-white shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-center w-12 h-12 bg-[#F9FAFB] rounded-full mb-4 group-hover:bg-[#D9FF00] transition-colors duration-300">
              <AdvisorIcon className="h-6 w-6 text-gray-600 group-hover:text-black transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-bold text-[#111827] mb-2">Expert Support</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Local specialists and real reviews to guide every step.
            </p>
          </div>

          <div className="col-span-12 md:col-span-4 rounded-xl bg-white shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-center w-12 h-12 bg-[#F9FAFB] rounded-full mb-4 group-hover:bg-[#D9FF00] transition-colors duration-300">
              <CheckCircleIcon className="h-6 w-6 text-gray-600 group-hover:text-black transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-bold text-[#111827] mb-2">Peace of Mind</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Fast confirmations, clear pricing, and contracts you can trust.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- tiny inline icons (no extra deps) --- */
function RingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6.343 7.343a8 8 0 0111.314 0M6.343 7.343a8 8 0 0111.314 0M12 2v6M12 16v6M7.343 9.657a4 4 0 015.314 0M7.343 9.657a4 4 0 015.314 0" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 2l7 3v6c0 5-3.5 9.5-7 11-3.5-1.5-7-6-7-11V5l7-3z" />
    </svg>
  );
}
function AdvisorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2 2 0 0017.96 6H16v6c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V6H4.04c-1.15 0-2.05.95-1.88 2.08L4.5 16H7v6h2v-6h2v6h2v-6h2v6h2z" />
      <circle cx="9" cy="9" r="2" />
      <circle cx="15" cy="9" r="2" />
    </svg>
  );
}
function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22,4 12,14.01 9,11.01" />
    </svg>
  );
}
