import React from 'react';
import HowItWorks from './HowItWorks';
import GuidesList from './GuidesList';
import VendorCtaStrip from './VendorCtaStrip';

type Step = {
  icon?: React.ReactNode;
  title: string;
  desc?: string;
};

type Guide = {
  title: string;
  href: string;
  tag?: string;
  image?: string;
};

interface GuidesAndHowProps {
  howSteps?: Step[];
  guides?: Guide[];
  className?: string;
}

const defaultHowSteps: Step[] = [
  {
    title: 'Search by city & category',
    desc: 'Find trusted vendors near you'
  },
  {
    title: 'Compare photos, prices & reviews',
    desc: 'Shortlist your favorites'
  },
  {
    title: 'Contact via WhatsApp or form',
    desc: 'Chat, get quotes, and book'
  }
];

const defaultGuides: Guide[] = [
  {
    title: 'Best wedding venues in Marrakech',
    href: '/blog/best-venues-marrakech',
    tag: 'Guide'
  },
  {
    title: 'How to choose a photographer in Casablanca',
    href: '/blog/choose-photographer-casablanca',
    tag: 'Guide'
  },
  {
    title: 'Henna night checklist',
    href: '/blog/henna-night-checklist',
    tag: 'Guide'
  }
];

export default function GuidesAndHow({
  howSteps = defaultHowSteps,
  guides = defaultGuides,
  className = ""
}: GuidesAndHowProps) {
  return (
    <section className={`max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-12 md:pt-16 pb-8 md:pb-12 bg-[#F7F8FB] ${className}`}>
      <div className="text-center mb-12">
        <h2 className="font-inter font-bold text-2xl md:text-3xl text-gray-900 mb-2">
          Plan smarter with Wervice
        </h2>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
          Everything you need to plan your perfect Moroccan wedding
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
        <HowItWorks steps={howSteps} />
        <GuidesList items={guides} />
      </div>

      <VendorCtaStrip />
    </section>
  );
}
