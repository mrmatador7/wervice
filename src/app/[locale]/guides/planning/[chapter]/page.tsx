import { redirect } from 'next/navigation';

export default async function PlanningGuideChapterPage({
  params,
}: {
  params: Promise<{ locale: string; chapter: string }>;
}) {
  const { locale, chapter } = await params;
  redirect(`/${locale}/planning-tools?chapter=${encodeURIComponent(chapter)}`);
}
