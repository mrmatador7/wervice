import { CitySelect } from './CitySelect';

interface CategoryHeroProps {
  name: string;
  slug: string;
  city?: string;
  count: number;
}

export function CategoryHero({ name, slug, city, count }: CategoryHeroProps) {
  return (
    <section className="relative isolate">
      {/* Background */}
      <div className="h-[220px] md:h-[260px] bg-gradient-to-b from-[#F8F7F5] to-white" />

      {/* Content Card */}
      <div className="container mx-auto -mt-16 md:-mt-20 px-4">
        <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-6 md:p-7">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            {/* Left side - Title and description */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#11190C] mb-2">
                {name}
                {city && city !== 'All Cities' && (
                  <span className="text-[#11190C]/70"> in {city}</span>
                )}
              </h1>
              <p className="text-sm text-neutral-600 max-w-md">
                Discover verified professionals to bring your wedding vision to life.
              </p>
            </div>

            {/* Right side - Controls */}
            <div className="flex items-center gap-4">
              <CitySelect
                value={city || 'All Cities'}
                className="min-w-[140px]"
              />

              {/* Vendor count badge */}
              <div className="flex items-center justify-center rounded-full bg-[#F3F1EE] px-4 py-2">
                <span className="text-sm font-medium text-[#11190C]">
                  {count.toLocaleString()} vendor{count !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
