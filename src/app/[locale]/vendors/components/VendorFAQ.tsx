'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const faqs = [
  {
    question: 'Do couples pay for Wervice?',
    answer: 'No, Wervice is completely free for couples. Only vendors subscribe to access the platform and get connected with potential clients.'
  },
  {
    question: 'How much does it cost to be a vendor?',
    answer: 'Plans start from 100 MAD/month for small vendors. Prices range from 100–350 MAD/month depending on your plan size and features.'
  },
  {
    question: 'Are there any commissions on bookings?',
    answer: 'No commissions whatsoever. You keep 100% of your earnings from bookings made through your vendor profile.'
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees.'
  },
  {
    question: 'What do I need to join as a vendor?',
    answer: 'Just provide photos of your work, your pricing, contact information, and a brief description of your services.'
  }
];

export default function VendorFAQ() {
  const t = useTranslations('vendor');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="font-decorative text-3xl md:text-4xl text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about becoming a Wervice vendor
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-[#D7FF1F] focus:ring-inset"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-ui-secondary text-lg text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
