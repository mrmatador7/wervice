export default function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
      {/* Image Skeleton */}
      <div className="aspect-[16/10] animate-pulse rounded-xl bg-zinc-200" />

      {/* Content Skeleton */}
      <div className="mt-3 space-y-2">
        {/* Title */}
        <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200" />

        {/* Meta */}
        <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200" />

        {/* Spacer */}
        <div className="h-4" />

        {/* Price Chip */}
        <div className="h-6 w-32 animate-pulse rounded-full bg-zinc-200" />

        {/* Button */}
        <div className="mt-3 h-9 w-full animate-pulse rounded-full bg-zinc-200" />
      </div>
    </div>
  );
}

