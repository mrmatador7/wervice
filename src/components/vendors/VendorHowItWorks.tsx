'use client';

import { useTranslations } from 'next-intl';

const steps = [
  {
    icon: '👤',
    title: 'Create Your Profile',
    description: 'Add photos, select your city and category, and tell couples about your business.'
  },
  {
    icon: '📝',
    title: 'List Your Services',
    description: 'Publish your packages, starting prices, and showcase your best work.'
  },
  {
    icon: '💬',
    title: 'Get Contacted',
    description: 'Couples reach you directly via WhatsApp or our secure inquiry form.'
  }
];

export default function VendorHowItWorks() {
  const t = useTranslations('vendor');

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mt-8 md:mt-10 pb-8 md:pb-10 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center">
          <h2 className="font-decorative text-3xl md:text-4xl text-gray-900 mb-2">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6 md:mb-8">
            Get started in just 3 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-10">
          {steps.map((step, index) => (
            <div key={index} className="text-center px-4">
              {/* Number Badge */}
              <div className="w-10 h-10 bg-[#D7FF1F] rounded-full flex items-center justify-center font-semibold mx-auto mb-3">
                {index + 1}
              </div>

              {/* Content */}
              <h3 className="font-semibold text-slate-900 mb-1">
                {step.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-[34ch] mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
