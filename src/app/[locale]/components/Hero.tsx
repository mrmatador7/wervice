import '../../../styles/gradients.css';
import SearchBar from './SearchBar';
import { getCities, getCategories } from '@/data/wervice-data';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

const floatingIcons = [
  { src: '/categories/venues.png', alt: 'Venues', size: 60, top: '10%', left: '5%', delay: '0s', duration: '20s' },
  { src: '/categories/Catering.png', alt: 'Catering', size: 50, top: '15%', right: '8%', delay: '2s', duration: '25s' },
  { src: '/categories/photo.png', alt: 'Photo & Video', size: 55, top: '60%', left: '3%', delay: '4s', duration: '22s' },
  { src: '/categories/event planner.png', alt: 'Event Planner', size: 45, top: '70%', right: '5%', delay: '1s', duration: '28s' },
  { src: '/categories/beauty.png', alt: 'Beauty', size: 48, top: '40%', left: '8%', delay: '3s', duration: '24s' },
  { src: '/categories/decor.png', alt: 'Decor', size: 52, top: '50%', right: '10%', delay: '5s', duration: '26s' },
  { src: '/categories/music.png', alt: 'Music', size: 42, top: '25%', left: '12%', delay: '2.5s', duration: '23s' },
  { src: '/categories/Dresses.png', alt: 'Dresses', size: 58, top: '80%', right: '12%', delay: '4.5s', duration: '27s' },
];

export default async function Hero({ locale = 'en' }: { locale?: string }) {
  const [cities, categories] = await Promise.all([getCities(), getCategories()]);
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section className="hero-bg relative mx-auto w-full max-w-6xl px-4 pt-16 pb-10 sm:pt-20 sm:pb-12 z-10 isolate">
      {/* Floating Category Icons Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingIcons.map((icon, index) => (
          <div
            key={index}
            className="absolute opacity-10 animate-float"
            style={{
              top: icon.top,
              left: icon.left,
              right: icon.right,
              animationDelay: icon.delay,
              animationDuration: icon.duration,
            }}
          >
            <Image
              src={icon.src}
              alt={icon.alt}
              width={icon.size}
              height={icon.size}
              className="object-contain"
              priority={false}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20">
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
      </div>
    </section>
  );
}
