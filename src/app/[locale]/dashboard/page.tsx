import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await props.params;
  const searchParams = await props.searchParams;
  const query = new URLSearchParams();

  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry != null) query.append(key, String(entry));
      });
      return;
    }
    if (value != null) query.set(key, String(value));
  });

  const suffix = query.toString();
  redirect(`/${locale}/vendors${suffix ? `?${suffix}` : ''}`);
}
