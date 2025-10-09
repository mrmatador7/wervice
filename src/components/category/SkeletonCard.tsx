export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-card animate-pulse">
      {/* Image skeleton */}
      <div className="w-full aspect-[4/3] bg-neutral-200" />

      {/* Content skeleton */}
      <div className="p-4 md:p-5 space-y-3">
        {/* Header skeleton */}
        <div className="flex items-center justify-between gap-3">
          <div className="h-5 w-3/4 bg-neutral-200 rounded" />
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 bg-neutral-200 rounded" />
            <div className="h-4 w-8 bg-neutral-200 rounded" />
            <div className="h-4 w-6 bg-neutral-200 rounded" />
          </div>
        </div>

        {/* Location skeleton */}
        <div className="h-4 w-1/2 bg-neutral-200 rounded" />

        {/* Tags skeleton */}
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-neutral-200 rounded-full" />
          <div className="h-6 w-20 bg-neutral-200 rounded-full" />
          <div className="h-6 w-14 bg-neutral-200 rounded-full" />
        </div>

        {/* Price and CTA skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-neutral-200 rounded" />
          <div className="h-9 w-24 bg-neutral-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
