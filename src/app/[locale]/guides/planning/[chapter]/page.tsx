import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { FiClock, FiChevronLeft, FiChevronRight, FiArrowLeft, FiUser } from 'react-icons/fi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getChapterBySlug, getNextChapter, getPreviousChapter, getAllChapters } from '@/data/planningChapters';
import { Chapter } from '@/models/chapter';

interface ChapterPageProps {
  params: Promise<{ locale: string; chapter: string }>;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Simple MDX-like content renderer (placeholder for actual MDX)
function ChapterContent({ slug }: { slug: string }) {
  const sampleContent = {
    'month-12': {
      sections: [
        {
          title: 'Define Your Wedding Vision',
          content: `Start by having an honest conversation with your partner about what kind of wedding you both envision. Consider your shared values, cultural traditions, and personal style preferences.

          Ask yourselves:
          • What size wedding feels right for us?
          • Do we want traditional Moroccan elements or a modern celebration?
          • What's our ideal guest count?
          • What time of year works best for our schedule?`,
          checklist: [
            'Discuss wedding vision and style preferences',
            'Determine guest count and budget range',
            'Choose wedding date and season',
            'Create initial inspiration mood board'
          ]
        },
        {
          title: 'Create a Realistic Budget',
          content: `Moroccan weddings can range from intimate gatherings to grand celebrations. Start by determining how much you're comfortable spending and break it down by category.

          Average Moroccan wedding costs:
          • Venue: $1,500–$4,000
          • Catering: $1,000–$3,000
          • Photography: $500–$1,500
          • Decor & Flowers: $800–$2,000`,
          checklist: [
            'Calculate total budget available',
            'Research average costs in Morocco',
            'Allocate budget by category',
            'Set up separate savings account'
          ]
        },
        {
          title: 'Start Vendor Research',
          content: `Begin researching Moroccan wedding vendors early. Use Wervice to browse local options and read reviews from other couples.`,
          cta: {
            text: 'Browse Wedding Vendors',
            href: '/vendors'
          }
        }
      ]
    },
    'month-10': {
      sections: [
        {
          title: 'Finalize Guest List',
          content: `Determine your final guest count and create a comprehensive list. Consider venue capacity and budget constraints.`,
          checklist: [
            'Set final guest count',
            'Create A-list and B-list',
            'Consider plus-ones policy',
            'Plan seating arrangements'
          ]
        },
        {
          title: 'Venue Research & Tours',
          content: `Research venues that match your vision and budget. Schedule tours for your top choices.`,
          checklist: [
            'Research venue options',
            'Schedule venue tours',
            'Check availability for your date',
            'Compare pricing and packages'
          ]
        }
      ]
    }
  };

  const content = sampleContent[slug as keyof typeof sampleContent] || {
    sections: [
      {
        title: 'Chapter Content',
        content: 'This chapter content is being prepared. Please check back soon for detailed planning guidance.',
        checklist: ['Content coming soon']
      }
    ]
  };

  return (
    <div className="space-y-8">
      {content.sections.map((section, index) => (
        <section key={index}>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{section.title}</h2>

          <div className="prose prose-lg max-w-none mb-6">
            {section.content.split('\n\n').map((paragraph, pIndex) => (
              <p key={pIndex} className="text-slate-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {section.checklist && (
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-slate-900 mb-4">Do This Now:</h3>
              <ul className="space-y-2">
                {section.checklist.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-[#D7FF1F] border-slate-300 rounded focus:ring-[#D7FF1F]"
                    />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {'cta' in section && section.cta && (
            <div className="bg-[#D7FF1F]/10 border border-[#D7FF1F]/20 rounded-xl p-6">
              <Link
                href={section.cta.href}
                className="inline-flex items-center gap-2 bg-[#D7FF1F] hover:bg-[#D7FF1F]/90 text-slate-900 font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                {section.cta.text}
                <FiChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

function ChapterNavigation({ currentSlug }: { currentSlug: string }) {
  const prevChapter = getPreviousChapter(currentSlug);
  const nextChapter = getNextChapter(currentSlug);

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-8 border-t border-slate-200">
      <div className="flex gap-4">
        {prevChapter && (
          <Link
            href={`/guides/planning/${prevChapter.slug}`}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <FiChevronLeft className="w-4 h-4" />
            <div>
              <div className="text-sm text-slate-500">Previous</div>
              <div className="font-medium">{prevChapter.title}</div>
            </div>
          </Link>
        )}
      </div>

      <Link
        href="/guides/planning"
        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium py-2 px-4 rounded-lg transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" />
        Return to Guide
      </Link>

      <div className="flex gap-4">
        {nextChapter && (
          <Link
            href={`/guides/planning/${nextChapter.slug}`}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-right"
          >
            <div>
              <div className="text-sm text-slate-500">Next</div>
              <div className="font-medium">{nextChapter.title}</div>
            </div>
            <FiChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

function StickyTOC({ chapter }: { chapter: Chapter }) {
  // Simple TOC - in a real implementation, this would parse headings from MDX
  const tocItems = [
    { id: 'vision', title: 'Define Your Vision', level: 2 },
    { id: 'budget', title: 'Create Budget', level: 2 },
    { id: 'research', title: 'Vendor Research', level: 2 }
  ];

  return (
    <aside className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-6 space-y-6">
        {/* Chapter Progress */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#D7FF1F] rounded-full flex items-center justify-center">
              <span className="font-bold text-slate-900">{chapter.order}</span>
            </div>
            <div>
              <div className="text-sm text-slate-500">Chapter {chapter.order} of 12</div>
              <div className="font-medium text-slate-900">{chapter.readTime} min read</div>
            </div>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-[#D7FF1F] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(chapter.order / 12) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* On-page TOC */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-4">In This Chapter</h3>
          <nav className="space-y-2">
            {tocItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block py-2 px-3 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Help Card */}
        <div className="bg-[#D7FF1F]/10 border border-[#D7FF1F]/20 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
          <p className="text-sm text-slate-600 mb-4">
            Connect with experienced Moroccan wedding planners
          </p>
          <Link
            href="/categories/planning"
            className="inline-flex items-center gap-2 bg-[#D7FF1F] hover:bg-[#D7FF1F]/90 text-slate-900 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Find a Planner
            <FiChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

function AuthorCard({ chapter }: { chapter: Record<string, unknown> }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 mt-12">
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200">
          <Image
            src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"
            alt="Wervice Team"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">Wervice Planning Team</h3>
          <p className="text-sm text-slate-600">Moroccan wedding experts</p>
        </div>

        <Link
          href="/about"
          className="text-sm text-[#D7FF1F] hover:text-[#D7FF1F]/80 font-medium"
        >
          About us →
        </Link>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-slate-600 text-sm leading-relaxed">
          Our team of local wedding experts has helped hundreds of couples create unforgettable
          Moroccan weddings. We combine traditional wisdom with modern planning techniques.
        </p>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { chapter: chapterSlug } = await params;
  const chapter = getChapterBySlug(chapterSlug);

  if (!chapter) {
    return {
      title: 'Chapter Not Found | Wervice Planning Guide',
    };
  }

  return {
    title: `${chapter.title} | Moroccan Wedding Planning Guide`,
    description: chapter.excerpt,
    openGraph: {
      title: chapter.title,
      description: chapter.excerpt,
      images: chapter.coverImage ? [{ url: chapter.coverImage, alt: chapter.title }] : undefined,
    },
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { chapter: chapterSlug } = await params;
  const chapter: Chapter | undefined = getChapterBySlug(chapterSlug);

  if (!chapter) {
    notFound();
  }

  // Type assertion after null check
  const safeChapter = chapter as Chapter;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-16">
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 z-50">
          <div className="h-full bg-[#D7FF1F] transition-all duration-300" style={{ width: '0%' }}></div>
        </div>

        {/* Breadcrumbs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-slate-600">
              <Link href="/" className="hover:text-slate-900">Home</Link>
              <span>/</span>
              <Link href="/guides" className="hover:text-slate-900">Guides</Link>
              <span>/</span>
              <Link href="/guides/planning" className="hover:text-slate-900">Planning</Link>
              <span>/</span>
              <span className="text-slate-900 font-medium">Chapter {chapter.order}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 bg-[#D7FF1F]/10 text-[#D7FF1F] text-sm font-medium rounded-full mb-4">
                Chapter {chapter.order} of 12
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {chapter.title}
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
                {chapter.excerpt}
              </p>

              <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  <span>{chapter.readTime} min read</span>
                </div>
                {chapter.lastUpdated && (
                  <div>
                    Updated {formatDate(chapter.lastUpdated)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Hero Image */}
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 mb-12">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
            <Image
              src={chapter.coverImage}
              alt={chapter.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Main Content */}
        <section className="pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex gap-12">
              {/* Content */}
              <div className="flex-1 max-w-3xl">
                <ChapterContent slug={safeChapter.slug} />
                <ChapterNavigation currentSlug={safeChapter.slug} />
                <AuthorCard chapter={safeChapter} />
              </div>

              {/* Sticky TOC */}
              <StickyTOC chapter={safeChapter} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
