'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FiCheckCircle, FiCircle, FiSearch } from 'react-icons/fi';
import { CHECKLIST, getCategories } from '@/data/checklist';

const STORAGE_KEY = 'wervice_shell_checklist_v1';

type WeddingChecklistViewProps = {
  locale: string;
};

export default function WeddingChecklistView({ locale }: WeddingChecklistViewProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    try {
      return JSON.parse(raw) as Record<string, boolean>;
    } catch {
      return {};
    }
  });

  const categories = useMemo(() => ['All', ...getCategories()], []);

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase();

    return CHECKLIST.map((section) => {
      const items = section.items.filter((item) => {
        const searchMatch = !q || item.label.toLowerCase().includes(q);
        const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
        return searchMatch && categoryMatch;
      });
      return { ...section, items };
    }).filter((section) => section.items.length > 0);
  }, [search, activeCategory]);

  const stats = useMemo(() => {
    const total = CHECKLIST.reduce((sum, section) => sum + section.items.length, 0);
    const done = Object.values(completed).filter(Boolean).length;
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, percentage };
  }, [completed]);

  const toggle = (id: string) => {
    setCompleted((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  };

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[#11190C] sm:text-5xl">Wedding Checklist</h1>
          <p className="mt-2 text-lg text-[#4a5c74]">Track every step and stay on schedule.</p>
        </div>
        <div className="rounded-full border border-[#d2d9e5] bg-white px-4 py-2 text-sm font-semibold text-[#33475f]">
          {stats.done}/{stats.total} completed
        </div>
      </div>

      <div className="mb-6 rounded-3xl border border-[#d7deea] bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between text-sm text-[#5f6f84]">
          <span>Overall Progress</span>
          <span className="font-semibold text-[#11190C]">{stats.percentage}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-[#e8edf5]">
          <div className="h-2 rounded-full bg-[#D9FF0A]" style={{ width: `${stats.percentage}%` }} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
          <label className="relative block">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a8ca4]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search checklist tasks"
              className="w-full rounded-xl border border-[#d2d9e5] bg-white py-2.5 pl-9 pr-3 text-sm focus:border-[#11190C] focus:outline-none"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  activeCategory === category
                    ? 'bg-[#11190C] text-[#D9FF0A]'
                    : 'border border-[#d2d9e5] bg-white text-[#33475f] hover:bg-[#F3EFE7]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {filteredSections.map((section) => {
          const doneInSection = section.items.filter((item) => completed[item.id]).length;
          const sectionProgress = Math.round((doneInSection / section.items.length) * 100);

          return (
            <div key={section.slug} className="rounded-3xl border border-[#d7deea] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="inline-flex rounded-full bg-[#11190C] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#D9FF0A]">
                    {section.badge}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[#11190C]">{section.title}</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#5f6f84]">{doneInSection}/{section.items.length}</p>
                  <p className="text-xs font-semibold text-[#33475f]">{sectionProgress}%</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {section.items.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-[#e3e8f0] bg-[#FAFCFF] p-3">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggle(item.id)}
                        className="mt-0.5 text-[#11190C]"
                        aria-label={completed[item.id] ? 'Mark as not done' : 'Mark as done'}
                      >
                        {completed[item.id] ? <FiCheckCircle className="h-5 w-5" /> : <FiCircle className="h-5 w-5" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p className={`text-sm ${completed[item.id] ? 'text-[#5f6f84] line-through' : 'text-[#11190C]'}`}>
                          {item.label}
                        </p>

                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          {item.category && (
                            <span className="rounded-full border border-[#d2d9e5] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#5f6f84]">
                              {item.category}
                            </span>
                          )}
                          {item.cta && (
                            <Link
                              href={`/${locale}${item.cta.href}`}
                              className="rounded-full bg-[#11190C] px-2.5 py-0.5 text-[11px] font-semibold text-[#D9FF0A]"
                            >
                              {item.cta.label}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
