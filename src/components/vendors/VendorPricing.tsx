'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

// Icon mapping for categories
const CATEGORY_ICONS: Record<string, string> = {
  'venues': '/categories/venues.png',
  'catering': '/categories/catering.png',
  'planning': '/categories/event planner.png',
  'photo-video': '/categories/photo.png',
  'music': '/categories/music.png',
  'decor': '/categories/decor.png',
  'beauty': '/categories/beauty.png',
  'dresses': '/categories/dresses.png',
};

const LABELS = {
  'venues': 'Venues',
  'catering': 'Catering',
  'planning': 'Planning',
  'photo-video': 'Photo & Video',
  'music': 'Music',
  'decor': 'Decor',
  'beauty': 'Beauty',
  'dresses': 'Dresses'
} as const;

// Base monthly prices
const MONTHLY_PRICES = {
  premium: 250,
  standard: 200,
  basic: 150,
} as const;

// Annual discounted monthly price (20% off)
const getAnnualMonthlyPrice = (planKey: keyof typeof MONTHLY_PRICES) =>
  Math.round(MONTHLY_PRICES[planKey] * 0.8);

// Annual total (discounted monthly × 12)
const getAnnualTotal = (planKey: keyof typeof MONTHLY_PRICES) =>
  getAnnualMonthlyPrice(planKey) * 12;

const PLANS = [
  {
    key: 'premium',
    title: 'Premium',
    monthlyPrice: MONTHLY_PRICES.premium,
    annualMonthlyPrice: getAnnualMonthlyPrice('premium'),
    annualTotal: getAnnualTotal('premium'),
    subtitle: 'Best for high-demand, venue-led services.',
    categories: ['venues', 'catering', 'planning'],
  },
  {
    key: 'standard',
    title: 'Standard',
    monthlyPrice: MONTHLY_PRICES.standard,
    annualMonthlyPrice: getAnnualMonthlyPrice('standard'),
    annualTotal: getAnnualTotal('standard'),
    subtitle: 'For media and entertainment providers.',
    categories: ['photo-video', 'music'],
  },
  {
    key: 'basic',
    title: 'Basic',
    monthlyPrice: MONTHLY_PRICES.basic,
    annualMonthlyPrice: getAnnualMonthlyPrice('basic'),
    annualTotal: getAnnualTotal('basic'),
    subtitle: 'Perfect for style & finishing touches.',
    categories: ['decor', 'beauty', 'dresses'],
  },
];

export default function VendorPricing() {
  const t = useTranslations('vendor');
  const locale = useLocale();
  const [selectedCategories, setSelectedCategories] = useState<{[planId: string]: string}>({});
  const [isAnnual, setIsAnnual] = useState(false);

  // Get current price for a plan (for CTA and calculations)
  const getCurrentPrice = (plan: typeof PLANS[0]) => {
    return isAnnual ? plan.annualMonthlyPrice : plan.monthlyPrice;
  };

  // Get current pricing text for a plan
  const getCurrentPricingText = (plan: typeof PLANS[0]) => {
    if (isAnnual) {
      return `${plan.annualMonthlyPrice} DHS / month`;
    }
    return `${plan.monthlyPrice} DHS / month`;
  };


  // Get cadence for URLs
  const getCurrentCadence = () => {
    return isAnnual ? 'annual' : 'monthly';
  };

  // Handle category selection
  const handleCategorySelect = (planId: string, categorySlug: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [planId]: categorySlug
    }));
  };

  // Get selected category for a plan
  const getSelectedCategory = (planId: string) => {
    return selectedCategories[planId];
  };

  // Generate CTA href
  const getCtaHref = (planId: string) => {
    const selectedCategory = getSelectedCategory(planId);
    if (!selectedCategory) return '#';

    return `/${locale}/vendors/subscribe?category=${selectedCategory}&cadence=${getCurrentCadence()}`;
  };

  // Generate CTA label
  const getCtaLabel = (planId: string) => {
    const selectedCategory = getSelectedCategory(planId);

    if (!selectedCategory) {
      return 'Subscribe — Select a category';
    }

    const categoryName = LABELS[selectedCategory as keyof typeof LABELS] || selectedCategory;
    const plan = PLANS.find(p => p.key === planId);

    if (!plan) return 'Subscribe — Select a category';

    if (isAnnual) {
      return `Subscribe — ${categoryName} (${plan.annualMonthlyPrice} DHS / month • annual plan)`;
    } else {
      return `Subscribe — ${categoryName} (${plan.monthlyPrice} DHS / month)`;
    }
  };

  // Get CTA aria label
  const getCtaAriaLabel = (planId: string) => {
    const selectedCategory = getSelectedCategory(planId);

    if (!selectedCategory) {
      return 'Select a category to subscribe';
    }

    const categoryName = LABELS[selectedCategory as keyof typeof LABELS] || selectedCategory;
    const plan = PLANS.find(p => p.key === planId);

    if (!plan) return 'Select a category to subscribe';

    if (isAnnual) {
      return `Subscribe to ${categoryName} plan for ${plan.annualMonthlyPrice} DHS per month`;
    } else {
      return `Subscribe to ${categoryName} plan for ${plan.monthlyPrice} DHS per month`;
    }
  };

  return (
    <section id="pricing" className="relative overflow-hidden bg-gradient-to-b from-[#EDEAFF] via-white to-white py-14">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Vendor Plan
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Pricing depends on your category. Select your category to continue.
          </p>

          {/* Segmented Control */}
          <div className="flex justify-center mt-8 mb-2">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-sm border border-zinc-200">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 text-sm font-medium rounded-xl transition-all ${
                  !isAnnual
                    ? 'text-black bg-[#D7FF1F] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 text-sm font-medium rounded-xl transition-all flex items-center ${
                  isAnnual
                    ? 'text-black bg-[#D7FF1F] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Annual
                <span className="bg-emerald-50 text-emerald-700 text-xs rounded-full px-2 py-0.5 ml-2">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              className="group relative h-full flex flex-col rounded-3xl border border-zinc-200/70 bg-white/85 backdrop-blur-sm shadow-[0_10px_40px_-12px_rgba(0,0,0,0.15)] hover:shadow-[0_18px_60px_-18px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 hover:ring-1 hover:ring-black/5 transition-all duration-300 p-6 md:p-8 bg-gradient-to-b from-white to-zinc-50/50"
            >
              {/* Card Header */}
              <div className="relative rounded-2xl border border-zinc-200 bg-white/90 p-4 md:p-5 shadow-sm mb-6">
                {/* TopRow: Title left, Icons right */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {plan.title}
                  </h3>

                  {/* Header Icons */}
                  <div className="absolute right-3 top-2 flex items-center gap-2 group-hover:-translate-y-0.5 transition-transform duration-300">
                    {plan.categories.map((categorySlug) => {
                      const iconPath = CATEGORY_ICONS[categorySlug];
                      if (!iconPath) return null;

                      return (
                        <img
                          key={categorySlug}
                          src={iconPath}
                          alt=""
                          className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm shrink-0"
                          aria-hidden="true"
                        />
                      );
                    })}
                  </div>
                </div>

                {/* PriceRow: Vertically stacked */}
                <div className="flex flex-col space-y-0.5">
                  <span className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-none">
                    {isAnnual ? plan.annualMonthlyPrice : plan.monthlyPrice}
                  </span>
                  <div className="flex flex-col text-xs uppercase tracking-wide text-slate-500">
                    <span>DHS</span>
                    <span>per month</span>
                  </div>
                  {isAnnual && (
                    <span className="inline-flex items-center justify-center rounded-lg bg-[#EAFBF1] text-[#198754] text-[11px] font-bold px-2 py-0.5 mt-1 mx-auto">
                      -20% discount
                    </span>
                  )}
                </div>
              </div>

              {/* Tagline */}
              <div className="text-center mb-5">
                <p className="text-sm text-slate-600">
                  {plan.subtitle}
                </p>
              </div>

              {/* CategoryChips */}
              <div className="space-y-2 mb-5">
                {plan.categories.map((categorySlug) => {
                  const isSelected = getSelectedCategory(plan.key) === categorySlug;
                  return (
                    <button
                      key={categorySlug}
                      onClick={() => handleCategorySelect(plan.key, categorySlug)}
                      aria-pressed={isSelected}
                      className={`w-full h-10 flex items-center justify-between px-4 rounded-full transition-all duration-200 ${
                        isSelected
                          ? 'bg-white ring-2 ring-[#D7FF1F] text-gray-900'
                          : 'bg-slate-100 hover:bg-slate-200 text-gray-700'
                      }`}
                    >
                      <span className="text-sm font-medium truncate pr-2">
                        {LABELS[categorySlug as keyof typeof LABELS]}
                      </span>
                      <img
                        src={CATEGORY_ICONS[categorySlug]}
                        alt=""
                        className="w-4 h-4 object-contain flex-shrink-0"
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="mb-0">
                <Link
                  href={getCtaHref(plan.key)}
                  className={`inline-flex items-center justify-center text-center w-full min-h-[44px] px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    getSelectedCategory(plan.key)
                      ? 'bg-[#D7FF00] text-black hover:bg-[#C5EE00] shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  aria-label={getCtaAriaLabel(plan.key)}
                  aria-disabled={!getSelectedCategory(plan.key)}
                  onClick={(e) => {
                    if (!getSelectedCategory(plan.key)) {
                      e.preventDefault();
                    }
                  }}
                >
                  <span className="text-sm md:text-[15px] leading-snug whitespace-normal break-words line-clamp-2">
                    {getSelectedCategory(plan.key)
                      ? getCtaLabel(plan.key).replace('Subscribe — ', 'Get Started — ')
                      : 'Get Started'
                    }
                  </span>
                </Link>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-200/70 my-5"></div>

              {/* FeaturesList */}
              <div className="space-y-3">
                <div className="grid grid-cols-[16px_1fr] gap-3 text-sm text-slate-700 leading-relaxed">
                  <span className="text-green-500">✅</span>
                  <span>Profile listing with photos & description</span>
                </div>
                <div className="grid grid-cols-[16px_1fr] gap-3 text-sm text-slate-700 leading-relaxed">
                  <span className="text-green-500">✅</span>
                  <span>Appear in city & category searches</span>
                </div>
                <div className="grid grid-cols-[16px_1fr] gap-3 text-sm text-slate-700 leading-relaxed">
                  <span className="text-green-500">✅</span>
                  <span>WhatsApp & form contact</span>
                </div>
                <div className="grid grid-cols-[16px_1fr] gap-3 text-sm text-slate-700 leading-relaxed">
                  <span className="text-green-500">✅</span>
                  <span>Vendor dashboard access</span>
                </div>
                <div className="grid grid-cols-[16px_1fr] gap-3 text-sm text-slate-700 leading-relaxed">
                  <span className="text-green-500">✅</span>
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
