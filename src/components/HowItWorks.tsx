import React from 'react';

type Step = {
  icon?: React.ReactNode;
  title: string;
  desc?: string;
};

interface HowItWorksProps {
  title?: string;
  steps?: Step[];
  className?: string;
}

const defaultSteps: Step[] = [
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

export default function HowItWorks({
  title = "How Wervice Works",
  steps = defaultSteps,
  className = ""
}: HowItWorksProps) {
  return (
    <div className={`rounded-2xl border border-[#ECEEF4] bg-white shadow-sm p-6 md:p-8 ${className}`}>
      <h2 className="font-inter font-bold text-2xl md:text-3xl text-gray-900 mb-6 md:mb-8">
        {title}
      </h2>

      <div className="space-y-6 md:space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-[#D7FF1F] text-[#0B0D2E] rounded-full flex items-center justify-center font-bold text-sm">
              {index + 1}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-lg md:text-xl text-gray-900 mb-1">
                {step.title}
              </h3>
              {step.desc && (
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {step.desc}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
