import { redirect } from 'next/navigation';

interface BecomeVendorPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BecomeVendorPage({ params }: BecomeVendorPageProps) {
  const { locale } = await params;
  redirect(`/${locale}/vendors/subscribe`);
}
