import VendorsPage from '@/app/[locale]/vendors/page';

type SearchParams = { [key: string]: string | string[] | undefined };

type ViewPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
};

export async function renderVendorsView(props: ViewPageProps, view: string) {
  const search = await props.searchParams;
  const merged: SearchParams = { ...search, view };
  return <VendorsPage params={props.params} searchParams={Promise.resolve(merged)} />;
}
