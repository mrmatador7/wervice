'use client';

import React from 'react';
import Dropdown, { DropdownProps } from './Dropdown';

const categoryOptions = [
  {
    value: 'venues',
    label: 'Venues',
    iconSrc: '/categories/venues.png'
  },
  {
    value: 'catering',
    label: 'Catering',
    iconSrc: '/categories/Catering.png'
  },
  {
    value: 'planning',
    label: 'Planning',
    iconSrc: '/categories/event planner.png'
  },
  {
    value: 'photo-video',
    label: 'Photo & Video',
    iconSrc: '/categories/photo.png'
  },
  {
    value: 'music',
    label: 'Music',
    iconSrc: '/categories/music.png'
  },
  {
    value: 'decor',
    label: 'Decor',
    iconSrc: '/categories/decor.png'
  },
  {
    value: 'beauty',
    label: 'Beauty',
    iconSrc: '/categories/beauty.png'
  },
  {
    value: 'dresses',
    label: 'Dresses',
    iconSrc: '/categories/Dresses.png'
  }
];

export default function CategoryDropdown(props: Omit<DropdownProps, 'options'>) {
  return (
    <Dropdown
      {...props}
      options={categoryOptions}
      placeholder="Select a category"
      accent="neon"
      iconSrc="/categories/event planner.png"
    />
  );
}
