'use client';

import { useTranslations } from 'next-intl';

const benefits = [
  {
    icon: '📈',
    title: 'Grow Your Business',
    description: 'Reach thousands of engaged couples in Morocco actively planning their weddings.'
  },
  {
    icon: '💰',
    title: 'Increase Revenue',
    description: 'Get direct bookings through your vendor profile without middleman fees.'
  },
  {
    icon: '⭐',
    title: 'Build Reputation',
    description: 'Showcase your work, collect reviews, and establish credibility in the wedding industry.'
  }
];

export default function VendorBenefits() {
  const t = useTranslations('vendor');

  return (
    <section id="why-choose" className="max-w-7xl mx-auto px-4 md:px-6 mt-12 pb-10 md:pb-12 bg-slate-50/70">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center">
          <h2 className="font-decorative text-3xl md:text-4xl text-gray-900 mb-2">
            Why Choose Wervice?
          </h2>
          <p className="text-lg text-slate-600 max-w-[60ch] mx-auto mb-6 md:mb-8">
            Join Morocco&apos;s leading wedding platform and grow your business
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-10">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center px-4">
              {/* Icon */}
              <div className="w-14 h-14 bg-[#D7FF1F] rounded-full flex items-center justify-center shadow ring-1 ring-black/5 mx-auto mb-3">
                <span className="text-lg">{benefit.icon}</span>
              </div>

              {/* Content */}
              <h3 className="font-semibold text-slate-900 mb-1">
                {benefit.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-[34ch] mx-auto">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
