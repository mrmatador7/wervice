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
      className="group relative flex-shrink-0 shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 active:opacity-92 overflow-hidden snap-start rounded-xl"
      style={{
        width: 'clamp(140px, 18vw, 180px)',
        height: 'clamp(180px, 24vw, 220px)',
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

      {/* Bottom Gradient Overlay */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 80%)`,
          clipPath: 'polygon(0% 60%, 100% 60%, 100% 100%, 0% 100%)'
        }}
      ></div>

      {/* Text Content Overlay - Bottom Left */}
      <div className="absolute bottom-3 left-3 right-3">
        <h3 className="text-white font-semibold text-sm md:text-sm leading-tight mb-1 truncate">
          {name}
        </h3>

        {/* Vendors Count */}
        {vendors && vendors > 0 && (
          <p className="text-white/80 text-xs leading-relaxed">
            {vendors.toLocaleString()} vendors
          </p>
        )}
      </div>
    </Link>
  );
}
