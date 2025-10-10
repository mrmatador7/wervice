'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

type HeroCityCardProps = {
  name: string;
  slug: string;
  image: string;
  vendors?: number;
  tint?: string;
  className?: string;
};

export default function HeroCityCard({
  name,
  slug,
  image,
  vendors,
  tint = '#0B0D2E',
  className = ''
}: HeroCityCardProps) {
  const router = useRouter();
  const t = useTranslations('common');

  const handleClick = () => {
    window.location.href = `/en/cities/${slug}`;
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/20 active:opacity-92 overflow-hidden snap-start ${className}`}
      style={{
        width: 'clamp(240px, 28vw, 360px)',
        height: 'clamp(380px, 48vw, 520px)',
        borderRadius: '28px'
      }}
      aria-label={t('browseVendors', { city: name })}
    >
      {/* Faint ambient halo */}
      <div className="absolute inset-0 rounded-[28px] bg-white/5 blur-xl scale-105 -z-10"></div>

      {/* Full-bleed Image */}
      <Image
        src={image}
        alt={`${name} city photo`}
        fill
        className="object-cover object-center group-hover:scale-103 transition-transform duration-300 rounded-[28px]"
        sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, 360px"
        loading="lazy"
      />

      {/* Tinted Mask */}
      <div
        className="absolute inset-0 group-hover:opacity-90 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to top, ${tint}B3 0%, ${tint}73 50%, transparent 75%)`,
          clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)'
        }}
      ></div>

      {/* Glass Label */}
      <div className="absolute bottom-4 left-4">
        <div className="bg-white/12 backdrop-blur-lg rounded-2xl border border-white/22 px-5 py-3 md:px-6 md:py-4">
          <h3 className="text-white font-bold text-xl md:text-2xl leading-tight mb-2 truncate">
            {name}
          </h3>

          {/* Vendors Count */}
          {vendors && vendors > 0 && (
            <p className="text-white/80 text-sm leading-relaxed">
              {t('numberOfVendors', { count: vendors })}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}