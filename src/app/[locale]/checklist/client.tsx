'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiChevronDown, FiChevronRight, FiSearch, FiPrinter, FiRotateCcw, FiCheckCircle, FiCircle, FiPlus, FiInfo } from 'react-icons/fi';
import { CHECKLIST, getTotalItems, getCategories, type ChecklistItem, type ChecklistSection } from '@/lib/checklist';

const STORAGE_KEY = 'wervice_checklist_v1';

type FilterState = {
  search: string;
  show: 'all' | 'completed' | 'remaining';
  categories: string[];
  timeline: string;
};

type ChecklistState = {
  completed: Record<string, boolean>;
  notes: Record<string, string>;
};

export default function ChecklistClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state
  const [checklistState, setChecklistState] = useState<ChecklistState>({ completed: {}, notes: {} });
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['month-12']));
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    show: 'all',
    categories: [],
    timeline: '',
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setChecklistState(parsed);
      } catch (error) {
        console.error('Failed to parse checklist data:', error);
      }
    }

    // Load filters from URL
    const urlSearch = searchParams.get('q') || '';
    const urlShow = (searchParams.get('show') as FilterState['show']) || 'all';
    const urlCategories = searchParams.get('cat')?.split(',') || [];
    const urlTimeline = searchParams.get('tab') || '';

    setFilters({
      search: urlSearch,
      show: urlShow,
      categories: urlCategories,
      timeline: urlTimeline,
    });

    // Expand section if timeline filter is set
    if (urlTimeline) {
      setExpandedSections(prev => new Set([...prev, urlTimeline]));
    }
  }, [searchParams]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checklistState));
  }, [checklistState]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('q', filters.search);
    if (filters.show !== 'all') params.set('show', filters.show);
    if (filters.categories.length > 0) params.set('cat', filters.categories.join(','));
    if (filters.timeline) params.set('tab', filters.timeline);

    // Get current locale from pathname
    const currentPath = window.location.pathname;
    const locale = currentPath.split('/')[1] || 'en';
    const baseUrl = `/${locale}/checklist`;

    const newUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    router.replace(newUrl, { scroll: false });
  }, [filters, router]);

  // Calculate progress
  const progress = useMemo(() => {
    const totalItems = getTotalItems();
    const completedItems = Object.values(checklistState.completed).filter(Boolean).length;
    return { completed: completedItems, total: totalItems, percentage: Math.round((completedItems / totalItems) * 100) };
  }, [checklistState.completed]);

  // Filter sections based on current filters
  const filteredSections = useMemo(() => {
    return CHECKLIST.map(section => {
      const filteredItems = section.items.filter(item => {
        // Search filter
        if (filters.search && !item.label.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }

        // Category filter
        if (filters.categories.length > 0 && (!item.category || !filters.categories.includes(item.category))) {
          return false;
        }

        // Show filter
        if (filters.show === 'completed' && !checklistState.completed[item.id]) {
          return false;
        }
        if (filters.show === 'remaining' && checklistState.completed[item.id]) {
          return false;
        }

        return true;
      });

      return { ...section, filteredItems };
    }).filter(section => {
      // Timeline filter
      if (filters.timeline && section.slug !== filters.timeline) {
        return false;
      }

      return section.filteredItems.length > 0;
    });
  }, [filters, checklistState.completed]);

  // Toggle item completion
  const toggleItem = (itemId: string) => {
    setChecklistState(prev => ({
      ...prev,
      completed: {
        ...prev.completed,
        [itemId]: !prev.completed[itemId]
      }
    }));
  };

  // Update item note
  const updateNote = (itemId: string, note: string) => {
    setChecklistState(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [itemId]: note
      }
    }));
  };

  // Clear all progress
  const clearAll = () => {
    if (confirm('Are you sure you want to clear all progress? This cannot be undone.')) {
      setChecklistState({ completed: {}, notes: {} });
    }
  };

  // Toggle section expansion
  const toggleSection = (sectionSlug: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionSlug)) {
        newSet.delete(sectionSlug);
      } else {
        newSet.add(sectionSlug);
      }
      return newSet;
    });
  };

  // Filter controls
  const updateFilter = (key: keyof FilterState, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const availableCategories = getCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Wedding Checklist
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Tick through every step of your Moroccan wedding—organized by timeline.
            </p>

            {/* Hero chips */}
            <div className="flex justify-center gap-2 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-lime-100 text-lime-800 border border-lime-200">
                Updated Sep 2025
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                Save progress automatically
              </span>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm text-gray-600">{progress.completed} of {progress.total} tasks</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#D7FF1F] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={clearAll}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-[#D7FF1F] focus:ring-offset-2 transition-colors"
              >
                <FiRotateCcw className="w-4 h-4 mr-2" />
                Clear All
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 bg-[#D7FF1F] border border-[#D7FF1F] rounded-lg text-sm font-medium text-gray-900 hover:bg-[#D7FF1F]/90 focus:ring-2 focus:ring-[#D7FF1F] focus:ring-offset-2 transition-colors"
              >
                <FiPrinter className="w-4 h-4 mr-2" />
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Find a task (e.g., venue deposit)"
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-[#D7FF1F]"
                />
              </div>
            </div>

            {/* Show filter */}
            <div className="flex gap-1">
              {(['all', 'completed', 'remaining'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => updateFilter('show', option)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    filters.show === option
                      ? 'bg-[#D7FF1F] border-[#D7FF1F] text-gray-900'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option === 'all' ? 'All' : option === 'completed' ? 'Completed' : 'Remaining'}
                </button>
              ))}
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  filters.categories.includes(category)
                    ? 'bg-[#D7FF1F] border-[#D7FF1F] text-gray-900'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Timeline tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            {CHECKLIST.map((section) => (
              <button
                key={section.slug}
                onClick={() => updateFilter('timeline', filters.timeline === section.slug ? '' : section.slug)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  filters.timeline === section.slug
                    ? 'bg-[#D7FF1F] border-[#D7FF1F] text-gray-900'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {section.badge}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Sections */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {filteredSections.map((section) => {
            const sectionProgress = section.filteredItems.filter(item => checklistState.completed[item.id]).length;
            const sectionTotal = section.filteredItems.length;
            const sectionPercentage = Math.round((sectionProgress / sectionTotal) * 100);

            return (
              <div key={section.slug} className="bg-white rounded-2xl border border-gray-200/70 shadow-sm overflow-hidden">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.slug)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:ring-2 focus:ring-[#D7FF1F] focus:ring-inset transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {expandedSections.has(section.slug) ? (
                        <FiChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <FiChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-lime-100 text-lime-800 border border-lime-200">
                          {section.badge}
                        </span>
                        <h2 className="text-xl font-semibold text-gray-900 mt-2">{section.title}</h2>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">{sectionProgress} of {sectionTotal} completed</div>
                      <div className="w-24 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-[#D7FF1F] h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${sectionPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>

                {/* Section Content */}
                {expandedSections.has(section.slug) && (
                  <div className="px-6 pb-6" data-section-content>
                    <div className="space-y-3">
                      {section.filteredItems.map((item) => (
                        <ChecklistItemComponent
                          key={item.id}
                          item={item}
                          completed={checklistState.completed[item.id] || false}
                          note={checklistState.notes[item.id] || ''}
                          onToggle={() => toggleItem(item.id)}
                          onNoteChange={(note) => updateNote(item.id, note)}
                        />
                      ))}
                    </div>

                    {/* Vendor CTA */}
                    {section.filteredItems.some(item => item.cta) && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {section.filteredItems
                            .filter(item => item.cta && checklistState.completed[item.id])
                            .slice(0, 2)
                            .map(item => item.cta && (
                              <Link
                                key={item.id}
                                href={item.cta.href}
                                className="flex items-center gap-3 p-4 bg-lime-50 border border-lime-200 rounded-lg hover:bg-lime-100 transition-colors"
                              >
                                <div className="w-8 h-8 bg-[#D7FF1F] rounded-full flex items-center justify-center">
                                  <FiCheckCircle className="w-4 h-4 text-gray-900" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{item.cta.label}</div>
                                  <div className="text-sm text-gray-600">Find the perfect {item.category?.toLowerCase()}</div>
                                </div>
                              </Link>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredSections.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FiSearch className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Checklist Item Component
function ChecklistItemComponent({
  item,
  completed,
  note,
  onToggle,
  onNoteChange
}: {
  item: ChecklistItem;
  completed: boolean;
  note: string;
  onToggle: () => void;
  onNoteChange: (note: string) => void;
}) {
  const [showNote, setShowNote] = useState(false);
  const [noteValue, setNoteValue] = useState(note);

  const handleNoteSave = () => {
    onNoteChange(noteValue);
    setShowNote(false);
  };

  return (
    <div className="group flex items-start gap-3 py-2">
      <input
        type="checkbox"
        id={item.id}
        checked={completed}
        onChange={onToggle}
        className="mt-0.5 h-5 w-5 rounded-md border-gray-300 text-[#D7FF1F] focus:ring-[#D7FF1F] focus:ring-offset-2"
      />
      <div className="flex-1 min-w-0">
        <label
          htmlFor={item.id}
          className={`text-[15px] leading-6 text-gray-800 cursor-pointer ${completed ? 'line-through text-gray-500' : ''}`}
        >
          {item.label}
        </label>

        {item.category && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 ml-2">
            {item.category}
          </span>
        )}

        {item.note && (
          <div className="flex items-center gap-1 mt-1">
            <FiInfo className="w-3 h-3 text-gray-400" />
            <span className="text-sm text-gray-500">{item.note}</span>
          </div>
        )}

        {note && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            <strong>Note:</strong> {note}
          </div>
        )}

        {showNote ? (
          <div className="mt-2">
            <textarea
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              placeholder="Add a note..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D7FF1F] focus:border-[#D7FF1F]"
              rows={2}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleNoteSave}
                className="px-3 py-1 bg-[#D7FF1F] text-gray-900 text-sm rounded hover:bg-[#D7FF1F]/90"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setNoteValue(note);
                  setShowNote(false);
                }}
                className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNote(true)}
            className="mt-1 text-xs text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
          >
            <FiPlus className="w-3 h-3" />
            Add note
          </button>
        )}
      </div>
    </div>
  );
}
