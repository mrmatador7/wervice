import Link from 'next/link';

type Guide = {
  title: string;
  href: string;
  tag?: string;
  image?: string;
};

interface GuidesListProps {
  title?: string;
  items?: Guide[];
  className?: string;
}

const defaultGuides: Guide[] = [
  {
    title: 'Best wedding venues in Marrakech',
    href: '/blog/best-venues-marrakech',
    tag: 'Guide'
  },
  {
    title: 'How to choose a photographer in Casablanca',
    href: '/blog/choose-photographer-casablanca',
    tag: 'Guide'
  },
  {
    title: 'Henna night checklist',
    href: '/blog/henna-night-checklist',
    tag: 'Guide'
  }
];

export default function GuidesList({
  title = "Wedding Guides",
  items = defaultGuides,
  className = ""
}: GuidesListProps) {
  return (
    <div className={className}>
      <h2 className="font-inter font-bold text-2xl md:text-3xl text-gray-900 mb-6 md:mb-8">
        {title}
      </h2>

      <div className="space-y-4">
        {items.map((guide, index) => (
          <Link
            key={index}
            href={guide.href}
            className="group block rounded-xl border border-[#ECEEF4] bg-white hover:shadow-md transition-all duration-200 p-4"
            aria-label={`Read guide: ${guide.title}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                {guide.tag && (
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full mb-2">
                    {guide.tag}
                  </span>
                )}
                <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight group-hover:text-gray-700 transition-colors">
                  {guide.title}
                </h3>
              </div>

              <div className="flex-shrink-0 ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-inter font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          Explore all guides
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
