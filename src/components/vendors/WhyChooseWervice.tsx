'use client';

import { useTranslations } from 'next-intl';
import { FiTrendingUp, FiCamera, FiCreditCard, FiStar } from 'react-icons/fi';

const features = [
  {
    icon: FiTrendingUp,
    key: 'growBusiness',
    bgColor: '#EAFBF1'
  },
  {
    icon: FiCamera,
    key: 'showcaseWork',
    bgColor: '#EEF4FF'
  },
  {
    icon: FiCreditCard,
    key: 'increaseRevenue',
    bgColor: '#FFF6E5'
  },
  {
    icon: FiStar,
    key: 'buildReputation',
    bgColor: '#FFEFF5'
  }
];

export default function WhyChooseWervice() {
  const t = useTranslations('vendor.whyChoose');

  return (
    <section className="bg-gradient-to-b from-[#F7F7FB] to-white py-14 rounded-t-3xl">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 h-full">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="
                  group relative rounded-2xl border border-slate-200/70 bg-white
                  p-5 md:p-6 shadow-[0_18px_50px_-24px_rgba(2,6,23,.25)]
                  hover:shadow-[0_24px_64px_-22px_rgba(2,6,23,.28)]
                  hover:-translate-y-0.5 transition-all duration-300 ease-out
                  motion-reduce:transform-none motion-reduce:transition-none
                  min-h-[220px] h-full
                  focus-within:ring-2 focus-within:ring-[#D7FF1F] focus-within:ring-offset-2
                "
              >
                {/* Icon Chip - Top Left */}
                <div
                  className="
                    h-11 w-11 md:h-12 md:w-12 rounded-full flex items-center justify-center
                    group-hover:scale-105 transition-transform duration-300 ease-out
                    motion-reduce:transform-none motion-reduce:transition-none
                  "
                  style={{ backgroundColor: feature.bgColor }}
                >
                  <Icon
                    className="w-[22px] h-[22px] md:w-[24px] md:h-[24px] text-slate-800/80"
                    aria-hidden="true"
                  />
                </div>

                {/* Content */}
                <h3 className="text-[17px] md:text-lg font-semibold text-slate-900 mt-3">
                  {t(`${feature.key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 mt-2 line-clamp-3 md:line-clamp-none">
                  {t(`${feature.key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
