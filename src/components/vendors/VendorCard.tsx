'use client';

// /components/vendors/VendorCard.tsx
type VendorCardProps = {
  href: string;
  imageUrl: string;
  title: string;
  category: string;
  city: string;
  price?: string;
  categoryIconUrl?: string;
  featured?: boolean;
};

export default function VendorCard({
  href,
  imageUrl,
  title,
  category,
  city,
  price,
  categoryIconUrl,
  featured,
}: VendorCardProps) {
  return (
    <a
      href={href}
      aria-label={title}
      className="group relative rounded-3xl bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-black/30"
    >
      <article className="h-full flex flex-col">
        {/* Image section */}
        <div className="relative aspect-[16/10]">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover rounded-t-3xl group-hover:scale-[1.02] transition-transform"
          />

          {featured && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium shadow-sm">
              Featured
            </span>
          )}

          {categoryIconUrl && (
            <img
              src={categoryIconUrl}
              alt={category}
              className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/90 p-1.5 shadow-sm"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-5 space-y-1">
          <h3 className="text-[16px] font-semibold text-gray-900 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{category} • {city}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 md:px-5 pb-4 md:pb-5">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
            {price ?? 'N/A'}
          </span>
          <button
            type="button"
            className="rounded-full bg-black text-white px-4 py-1.5 text-sm font-medium hover:bg-gray-900 transition focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-black/30"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = href;
            }}
          >
            View Vendor →
          </button>
        </div>
      </article>
    </a>
  );
}
