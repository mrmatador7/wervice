'use client';

import Link from 'next/link';
import Image from 'next/image';

type SmallCityCardProps = {
  name: string;
  slug: string;
  image: string;
  vendors?: number;
};

export default function SmallCityCard({
  name,
  slug,
  image,
  vendors
}: SmallCityCardProps) {
  return (
    <Link
      href={`/city/${slug}`}
      className="group relative flex-shrink-0 shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 active:opacity-92 overflow-hidden snap-start rounded-xl cursor-pointer"
      style={{
        width: 'clamp(140px, 18vw, 180px)',
        height: 'clamp(180px, 24vw, 220px)',
        minWidth: '140px',
      }}
      aria-label={`Browse vendors in ${name}`}
    >
      {/* Full-bleed Image */}
      <Image
        src={image}
        alt={`${name} city photo`}
        fill
        className="object-cover object-center group-hover:scale-103 transition-transform duration-300 rounded-xl"
        sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, 180px"
        loading="lazy"
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(to top, rgb(123 127 8 / 60%) 0%, rgb(123 127 8 / 40%) 25%, rgb(123 127 8 / 0%) 50%, rgb(123 127 8 / 0) 100%);`,
          clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)'
        }}
      ></div>

      {/* Text Content Overlay - Bottom Left */}
      <div className="absolute bottom-3 left-3 right-3">
        <h3 className="text-white font-semibold text-sm md:text-sm leading-tight mb-1 truncate drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0 , 0.5)' }}>
          {name}
        </h3>

        {/* Vendors Count */}
        {vendors && vendors > 0 && (
          <p className="text-white/90 text-xs leading-relaxed drop-shadow-md" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
            {vendors.toLocaleString()} vendors
          </p>
        )}
      </div>
    </Link>
  );
}
