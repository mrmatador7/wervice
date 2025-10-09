import Image from 'next/image';
import CitySelect from './CitySelect';

interface CategoryHeroProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    coverImage?: string;
  };
  totalVendors: number;
  selectedCity?: string;
  categorySlug: string;
}

export default function CategoryHero({ category, totalVendors, selectedCity, categorySlug }: CategoryHeroProps) {
  const backgroundImage = category.coverImage || '/images/hero/hero-bg.jpg';

  return (
    <section className="relative isolate">
      {/* Background */}
      <div className="h-[220px] md:h-[300px] relative overflow-hidden">
        <Image
          src={backgroundImage}
          alt={category.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Content */}
      <div className="container mx-auto -mt-20 md:-mt-24 px-4">
        <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                {category.icon && (
                  <div className="w-12 h-12 rounded-xl bg-[#D9FF0A]/10 flex items-center justify-center">
                    <Image
                      src={category.icon}
                      alt=""
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                )}
                <div className="text-sm font-medium text-[#D9FF0A] uppercase tracking-wide">
                  Category
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-[#11190C] mb-2">
                {category.name}
                {selectedCity && (
                  <span className="text-[#11190C]/70"> in {selectedCity}</span>
                )}
              </h1>

              <p className="text-base md:text-lg text-neutral-600 max-w-2xl">
                {category.description || `Find the best ${category.name.toLowerCase()} for your wedding in Morocco. Compare prices, ratings, and availability.`}
              </p>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-4">
              <div className="text-right">
                <div className="text-2xl md:text-3xl font-bold text-[#11190C]">
                  {totalVendors.toLocaleString()}
                </div>
                <div className="text-sm text-neutral-600">
                  {totalVendors === 1 ? 'Vendor' : 'Vendors'} Available
                </div>
              </div>

              <CitySelect selectedCity={selectedCity} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
