import { Metadata } from 'next';
import PlanningGuideClient from './client';

export const metadata: Metadata = {
  title: 'Wedding Planning Guide (Morocco) – Timeline & Checklists | Wervice',
  description: '12-month planning timeline, vendor tips, printable checklists for your perfect Moroccan wedding.',
  openGraph: {
    title: 'Wedding Planning Guide (Morocco) – Timeline & Checklists',
    description: '12-month planning timeline, vendor tips, printable checklists for your perfect Moroccan wedding.',
    images: [{ url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=630&fit=crop' }],
  },
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'When should we book our wedding venue?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For popular dates and venues, book 9-12 months in advance. Peak season (April-June, September-October) fills up quickly. Start venue research at 10-12 months out and aim to book by month 9.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is WhatsApp acceptable for initial vendor contact?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Moroccan vendors commonly use WhatsApp for initial inquiries and communication. It\'s quick, personal, and allows for easy sharing of photos and details. Most vendors on Wervice list their WhatsApp numbers.'
          }
        },
        {
          '@type': 'Question',
          name: 'How much should we budget for a Moroccan wedding?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Budget varies by guest count and style, but expect $3,000-$10,000+ for 50-150 guests. Major costs include venue ($1,500-$4,000), catering ($1,000-$3,000), and photography ($500-$1,500). Use our budget calculator for personalized estimates.'
          }
        }
      ]
    })
  }
};

export default function PlanningGuidePage() {
  return <PlanningGuideClient />;
}
