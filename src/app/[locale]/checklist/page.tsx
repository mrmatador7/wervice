import { Metadata } from 'next';
import { Suspense } from 'react';
import ChecklistClient from './client';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Wedding Checklist – Interactive Planning Tool | Wervice',
    description: 'Complete wedding planning checklist organized by timeline. Track progress, save notes, and get vendor recommendations for your Moroccan wedding.',
    keywords: ['wedding checklist', 'wedding planning', 'Moroccan wedding', 'wedding timeline', 'wedding tasks'],
    openGraph: {
      title: 'Wedding Checklist – Interactive Planning Tool | Wervice',
      description: 'Complete wedding planning checklist organized by timeline. Track progress, save notes, and get vendor recommendations for your Moroccan wedding.',
      type: 'website',
      url: '/checklist',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Wedding Checklist – Interactive Planning Tool | Wervice',
      description: 'Complete wedding planning checklist organized by timeline. Track progress, save notes, and get vendor recommendations for your Moroccan wedding.',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ChecklistPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9FF0A]"></div></div>}>
      <ChecklistClient />
    </Suspense>
  );
}
