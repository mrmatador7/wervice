import '../../../styles/gradients.css';
import SearchBar from './SearchBar';
import { getCities, getCategories } from '@/data/wervice-data';
import { getTranslations } from 'next-intl/server';

export default async function Hero({ locale = 'en' }: { locale?: string }) {
  const [cities, categories] = await Promise.all([getCities(), getCategories()]);
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section className="hero-bg relative mx-auto w-full max-w-6xl px-4 pt-16 pb-10 sm:pt-20 sm:pb-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#11190C] sm:text-4xl md:text-5xl">
          {t('hero.title')}
        </h1>
        <p className="mt-3 text-base text-black/70 sm:text-lg">
          {t('hero.subtitle')}
        </p>
      </div>

      <div className="mt-8">
        <SearchBar cities={cities} categories={categories} locale={locale} />
      </div>
    </section>
  );
}
