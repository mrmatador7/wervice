'use client';

import React from 'react';
import WervSelect, { WervSelectOption } from './WervSelect';

const categoryOptions: WervSelectOption[] = [
  {
    value: 'venues',
    label: 'Venues'
  },
  {
    value: 'catering',
    label: 'Catering'
  },
  {
    value: 'planning',
    label: 'Planning'
  },
  {
    value: 'photo-video',
    label: 'Photo & Video'
  },
  {
    value: 'music',
    label: 'Music'
  },
  {
    value: 'decor',
    label: 'Decor'
  },
  {
    value: 'beauty',
    label: 'Beauty'
  },
  {
    value: 'dresses',
    label: 'Dresses'
  }
];

interface CategoryDropdownProps {
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function CategoryDropdown({ value, onChange, disabled = false, className }: CategoryDropdownProps) {
  return (
    <WervSelect
      value={value}
      onChange={onChange}
      options={categoryOptions}
      placeholder="Select a category"
      accent="neon"
      className={className}
    />
  );
}
