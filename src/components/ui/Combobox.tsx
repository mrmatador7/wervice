'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { useFloating, shift, offset, flip, autoUpdate } from '@floating-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';

type Item = { name: string; slug: string };

type ComboboxProps = {
  label: string;
  placeholder: string;
  items: Item[];
  selected?: Item | null;
  onSelect: (item: Item) => void;
  icon?: React.ReactNode;
  className?: string;
};

export default function Combobox({
  label,
  placeholder,
  items,
  selected,
  onSelect,
  icon,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  // Filter items
  const filtered = React.useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(i => i.name.toLowerCase().includes(q));
  }, [items, query]);

  // Floating UI for robust positioning
  const { refs, floatingStyles, update } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(6), flip(), shift({ padding: 10 })],
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
  });

  // Lock body scroll when menu open (prevents "scrolling page with dropdown open")
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onWheelOrScroll = () => setOpen(false); // close on scroll/wheel
    window.addEventListener('scroll', onWheelOrScroll, { passive: true });
    window.addEventListener('wheel', onWheelOrScroll, { passive: true });
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('scroll', onWheelOrScroll);
      window.removeEventListener('wheel', onWheelOrScroll);
    };
  }, [open]);

  // Close on Escape / outside
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (buttonRef.current?.contains(t)) return;
      if (listRef.current?.contains(t)) return;
      setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  // Virtualize long lists
  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 44,
    overscan: 6,
  });

  return (
    <div className={`w-full ${className ?? ''}`}>
      <label className="sr-only">{label}</label>
      <button
        ref={(node) => {
          buttonRef.current = node;
          (refs as any).setReference(node);
        }}
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex h-12 w-full items-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-left text-sm text-[#11190C] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9FF0A] focus-visible:ring-offset-2"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {icon ? <span className="shrink-0 opacity-70">{icon}</span> : null}
        <span className={`truncate ${selected ? '' : 'text-black/50'}`}>
          {selected ? selected.name : placeholder}
        </span>
        <span className="ml-auto opacity-60">▾</span>
      </button>

      {open && typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={(node) => {
              (refs as any).setFloating(node);
              listRef.current = node as HTMLDivElement;
            }}
            style={floatingStyles}
            className="z-[60] w-[min(92vw,36rem)] rounded-xl border border-black/10 bg-white shadow-2xl"
          >
            <div className="p-2">
              <input
                autoFocus
                value={query}
                onChange={(e) => { setQuery(e.target.value); update?.(); }}
                placeholder={`Search ${label.toLowerCase()}…`}
                className="h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#D9FF0A]"
              />
            </div>

            <div
              className="max-h-[56vh] overscroll-contain overflow-auto"
              role="listbox"
              aria-label={label}
            >
              <div
                style={{ height: rowVirtualizer.getTotalSize() }}
                className="relative"
              >
                {rowVirtualizer.getVirtualItems().map(v => {
                  const item = filtered[v.index];
                  return (
                    <div
                      key={item.slug}
                      role="option"
                      aria-selected={selected?.slug === item.slug}
                      className="absolute left-0 right-0 top-0"
                      style={{ transform: `translateY(${v.start}px)` }}
                    >
                      <button
                        className="flex h-11 w-full items-center gap-2 px-3 text-sm hover:bg-[#F6F7F5] focus:bg-[#F6F7F5] focus:outline-none"
                        onClick={() => { onSelect(item); setOpen(false); }}
                      >
                        <span className="truncate">{item.name}</span>
                        {selected?.slug === item.slug && (
                          <span className="ml-auto text-xs text-black/60">Selected</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body
        )
      }
    </div>
  );
}
