interface VendorHeroProps {
  title: string;
  subtitle: string;
  totalCount: number;
}

export default function VendorHero({ title, subtitle, totalCount }: VendorHeroProps) {
  return (
    <header className="text-center pb-8 border-b border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-2">{subtitle}</p>
      <p className="text-sm text-gray-400 mt-1">{totalCount.toLocaleString()} verified vendors</p>
      <div className="w-16 h-px bg-gray-200 mx-auto mt-8"></div>
    </header>
  );
}
