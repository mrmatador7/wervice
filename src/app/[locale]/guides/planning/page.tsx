import { redirect } from 'next/navigation';

export default async function PlanningGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/vendors?view=planning-tools`);
}
