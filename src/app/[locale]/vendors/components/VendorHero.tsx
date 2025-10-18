interface VendorHeroProps {
  title: string;
  subtitle: string;
  totalCount: number;
}

export default function VendorHero({ title, subtitle, totalCount }: VendorHeroProps) {
  return (
    <section className="bg-gradient-to-br from-wv-gray1 via-white to-wv-gray1 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-wv-text mb-6">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-wv-sub mb-8 max-w-3xl mx-auto">
          {subtitle}
        </p>
        <div className="text-lg text-wv-sub">
          <span className="font-semibold text-wv-text">{totalCount.toLocaleString()}</span> verified vendors
        </div>
      </div>
    </section>
  );
}
