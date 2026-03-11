import { renderVendorsView } from '@/app/[locale]/vendors/renderVendorsView';

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function Page(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  return renderVendorsView(props, 'messages');
}
