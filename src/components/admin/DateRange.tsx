'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeProps {
  value?: string;
  onChange?: (value: string) => void;
}

const presets = [
  'Today',
  'This Week',
  'This Month',
  'Last 30 Days',
  'This Year',
  'Custom'
];

export default function DateRange({ value = 'This Month', onChange }: DateRangeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (preset: string) => {
    onChange?.(preset);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-wv.bg border border-wv.line rounded-lg text-sm hover:bg-wv.line focus:outline-none focus:ring-2 focus:ring-wv.limeDark"
        aria-label="Select date range"
        aria-expanded={isOpen}
      >
        <Calendar size={16} />
        <span>{value}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-wv.card rounded-lg shadow-card border border-wv.line py-2 z-20">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => handleSelect(preset)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-wv.line ${
                  value === preset ? 'text-wv.lime font-medium' : 'text-wv.text'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}





