import type { VendorDetail } from '@/lib/db/vendors';

interface VendorAboutProps {
  vendor: VendorDetail;
}

function extractBullets(description: string): string[] {
  // Split by periods and clean up
  const sentences = description
    .split(/[.!]\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 10 && s.length < 150);
  
  // Return up to 6 bullets
  return sentences.slice(0, 6);
}

export default function VendorAbout({ vendor }: VendorAboutProps) {
  if (!vendor.description) {
    return null;
  }

  const bullets = extractBullets(vendor.description);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-zinc-900 mb-4">About</h2>
      
      {/* Full Description */}
      <div className="prose prose-zinc max-w-none">
        <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap">
          {vendor.description}
        </p>
      </div>

      {/* Bullet Points (if we have a decent description) */}
      {bullets.length > 2 && (
        <div className="mt-6 pt-6 border-t border-zinc-100">
          <h3 className="text-sm font-semibold text-zinc-900 mb-3">Key Points</h3>
          <ul className="space-y-2">
            {bullets.map((bullet, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-400 shrink-0" />
                <span className="text-sm text-zinc-700">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

