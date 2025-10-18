import Image from 'next/image';
import { ReactNode } from 'react';

const categoryIcons: Record<string, string> = {
  'venues': '/categories/venues.png',
  'catering': '/categories/Catering.png',
  'photo-video': '/categories/photo.png',
  'planning': '/categories/event planner.png',
  'beauty': '/categories/beauty.png',
  'decor': '/categories/decor.png',
  'music': '/categories/music.png',
  'dresses': '/categories/Dresses.png',
};

interface IconForCategoryProps {
  category: string;
  size?: number;
  className?: string;
}

export default function IconForCategory({
  category,
  size = 16,
  className = ""
}: IconForCategoryProps): ReactNode {
  const iconSrc = categoryIcons[category.toLowerCase()];

  if (!iconSrc) {
    // Fallback to a generic icon or return null
    return null;
  }

  return (
    <Image
      src={iconSrc}
      alt={`${category} icon`}
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
    />
  );
}

