import { redirect } from 'next/navigation';

interface BecomeVendorSuccessPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ lead?: string }>;
}

export default async function BecomeVendorSuccessPage({ params, searchParams }: BecomeVendorSuccessPageProps) {
  const { locale } = await params;
  const query = await searchParams;
  const lead = query.lead ? `?lead=${encodeURIComponent(query.lead)}` : '';
  redirect(`/${locale}/vendors/subscribe/success${lead}`);
}
