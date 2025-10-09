import '../../../styles/gradients.css';
import SearchBar from './SearchBar';
import { getCities, getCategories } from '@/lib/wervice-data';

export default async function Hero({ locale = 'en' }: { locale?: string }) {
  const [cities, categories] = await Promise.all([getCities(), getCategories()]);

  return (
    <section className="hero-bg relative mx-auto w-full max-w-6xl px-4 pt-16 pb-10 sm:pt-20 sm:pb-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#11190C] sm:text-4xl md:text-5xl">
          Plan your wedding, your way.
        </h1>
        <p className="mt-3 text-base text-black/70 sm:text-lg">
          Compare trusted vendors, read reviews, and book fast — all in one place.
        </p>
      </div>

      <div className="mt-8">
        <SearchBar cities={cities} categories={categories} locale={locale} />
      </div>
    </section>
  );
}
