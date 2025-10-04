export type Chapter = {
  slug: string;          // 'month-12', 'month-9', ..., 'week-of', 'day-of'
  title: string;
  excerpt: string;
  coverImage: string;
  readTime: number;
  order: number;
  mdxFile?: string;      // path to MDX file (optional for now)
  lastUpdated?: string;  // ISO date string
};

export type TimelineStep = {
  months: number;
  title: string;
  description: string;
  chapterSlug: string;
  icon: string; // emoji or icon name
  tasks: string[];
};

export type ChecklistItem = {
  id: string;
  title: string;
  items: string[];
  downloadUrl?: string;
  icon: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};
