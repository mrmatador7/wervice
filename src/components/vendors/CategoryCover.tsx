import Image from 'next/image';

interface CategoryCoverProps {
  title: string;
  strapline?: string | null;
  coverUrl?: string | null;
}

export default function CategoryCover({ title, strapline, coverUrl }: CategoryCoverProps) {
  return (
    <div className="relative mb-6 h-[180px] w-full overflow-hidden rounded-2xl md:h-[280px]">
      {/* Background Image or Gradient */}
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100" />
      )}

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full px-4 pb-6 md:px-6 md:pb-8">
          <h1 className="mb-1 text-2xl font-bold text-white drop-shadow-lg md:text-4xl">
            {title}
          </h1>
          {strapline && (
            <p className="text-sm text-white/90 drop-shadow md:text-base">
              {strapline}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

