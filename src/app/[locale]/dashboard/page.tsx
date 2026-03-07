import VendorsPage from '@/app/[locale]/vendors/page';

export const dynamic = 'force-dynamic';

export default function DashboardPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return <VendorsPage {...props} />;
}
