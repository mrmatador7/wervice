import { Metadata } from 'next';
import { Suspense } from 'react';
import ChecklistClient from './client';
import { localeAlternates, toAbsoluteUrl } from '@/lib/seo/site-url';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = toAbsoluteUrl(`/${locale}/checklist`);
  const seoCopy = {
    en: {
      title: 'Wedding Checklist – Interactive Planning Tool | Wervice',
      description:
        'Complete wedding planning checklist organized by timeline. Track progress, save notes, and get vendor recommendations for your Moroccan wedding.',
      keywords: ['wedding checklist', 'wedding planning', 'Moroccan wedding', 'wedding timeline', 'wedding tasks'],
    },
    fr: {
      title: 'Checklist Mariage – Outil de Planification Interactif | Wervice',
      description:
        'Checklist complète de planification de mariage organisée par étapes. Suivez votre progression, enregistrez vos notes et obtenez des recommandations de prestataires au Maroc.',
      keywords: ['checklist mariage', 'organisation mariage', 'mariage marocain', 'planning mariage', 'taches mariage'],
    },
    ar: {
      title: 'قائمة مهام الزفاف - أداة تخطيط تفاعلية | Wervice',
      description:
        'قائمة كاملة لتخطيط الزفاف مرتبة حسب الجدول الزمني. تتبّع التقدم، احفظ الملاحظات، واحصل على توصيات مزوّدي خدمات لزفافك في المغرب.',
      keywords: ['قائمة مهام الزفاف', 'تخطيط الزفاف', 'زفاف مغربي', 'جدول الزفاف', 'مهام الزفاف'],
    },
  } as const;
  const current = seoCopy[locale as keyof typeof seoCopy] || seoCopy.en;

  return {
    title: current.title,
    description: current.description,
    keywords: current.keywords,
    openGraph: {
      title: current.title,
      description: current.description,
      type: 'website',
      url: canonical,
    },
    twitter: {
      card: 'summary_large_image',
      title: current.title,
      description: current.description,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical,
      languages: localeAlternates('/checklist'),
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
