import Link from 'next/link';

interface VendorCtaStripProps {
  title?: string;
  subtitle?: string;
  href?: string;
  className?: string;
}

export default function VendorCtaStrip({
  title = "Are you a vendor?",
  subtitle = "List your business on Wervice",
  href = "/vendors",
  className = ""
}: VendorCtaStripProps) {
  return (
    <div className={`mt-12 md:mt-16 ${className}`}>
      <div className="rounded-2xl md:rounded-3xl bg-[#0B0D2E] text-white px-6 py-6 md:px-10 md:py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-inter font-bold text-xl md:text-2xl mb-1">
              {title}
            </h3>
            <p className="text-white/80 text-sm md:text-base">
              {subtitle}
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href={href}
              className="inline-flex items-center justify-center bg-[#D7FF1F] hover:bg-[#D7FF1F]/90 text-[#0B0D2E] font-medium px-5 py-3 rounded-full transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
