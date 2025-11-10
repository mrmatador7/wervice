'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { useTranslations } from 'next-intl';
import { VALID_CATEGORY_SLUGS, labelForCategory } from '@/lib/categories';


interface Category {
    name: string;
    count: number;
    image: string;
    href: string;
    color?: string;
    gradient?: string;
}


export default function CategoriesSection() {
    const { locale } = useLocale();
    const t = useTranslations('home');

    const categories: Category[] = VALID_CATEGORY_SLUGS.map(slug => {
        // Map slugs to their display URLs, images, and colors (muted, sophisticated gradients)
        const categoryMappings: Record<string, { href: string; image: string; count: number; color: string; gradient: string }> = {
            venues: { href: 'venues', image: '/categories/venues.png', count: 124, color: 'bg-rose-500', gradient: 'from-[#E8A3A3] to-[#C67373]' },
            catering: { href: 'catering', image: '/categories/Catering.png', count: 87, color: 'bg-blue-500', gradient: 'from-[#7BA8D4] to-[#4A7BA7]' },
            photo_video: { href: 'photo-video', image: '/categories/photo.png', count: 156, color: 'bg-purple-500', gradient: 'from-[#B89FD9] to-[#8B6DB8]' },
            event_planner: { href: 'planning', image: '/categories/event-planner.png', count: 92, color: 'bg-amber-500', gradient: 'from-[#E8C47C] to-[#C9A053]' },
            beauty: { href: 'beauty', image: '/categories/beauty.png', count: 78, color: 'bg-pink-500', gradient: 'from-[#E8A8C9] to-[#C57BA3]' },
            decor: { href: 'decor', image: '/categories/decor.png', count: 134, color: 'bg-emerald-500', gradient: 'from-[#7BC5A8] to-[#4A9B7F]' },
            music: { href: 'music', image: '/categories/music.png', count: 67, color: 'bg-red-500', gradient: 'from-[#E88F8F] to-[#C95D5D]' },
            dresses: { href: 'dresses', image: '/categories/Dresses.png', count: 189, color: 'bg-indigo-500', gradient: 'from-[#8B9FD9] to-[#5C6DB8]' },
        };

        const mapping = categoryMappings[slug];
        return {
            name: labelForCategory(slug),
            count: mapping.count,
            image: mapping.image,
            href: `/${locale}/categories/${mapping.href}`,
            color: mapping.color,
            gradient: mapping.gradient,
        };
    });

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="w-full">
                {/* Section Title */}
                <div className="text-center mb-8">
                    <h2 className="font-inter font-bold text-2xl md:text-3xl text-gray-900 mb-4">
                        {t('categories.browseByCategory')}
                    </h2>
                </div>

                {/* Categories - Horizontal Scroll on Mobile, Grid on Desktop */}
                <div className="overflow-x-auto scrollbar-hide md:overflow-visible">
                    <div className="flex md:grid md:grid-cols-8 gap-3 sm:gap-4 md:gap-5 lg:gap-6 min-w-max md:min-w-0 px-4 md:px-0">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                href={category.href}
                                className="group relative flex flex-col items-center flex-shrink-0 w-[100px] sm:w-[110px] md:w-auto pointer-events-auto"
                                aria-label={`Browse ${category.name}`}
                            >
                            {/* Clean Card */}
                            <div className="relative w-full aspect-[5/6] rounded-xl sm:rounded-2xl md:rounded-3xl bg-[#F5F5F7] group-hover:bg-[#ECECEE] shadow-[0_4px_16px_rgb(0,0,0,0.08)] group-hover:shadow-[0_8px_24px_rgb(0,0,0,0.12)] transition-all duration-300 overflow-hidden flex flex-col items-center justify-between p-2 sm:p-4 md:p-5 lg:p-6">
                                
                                {/* 3D Icon - Top Center */}
                                <div className="flex-1 flex items-center justify-center w-full group-hover:scale-105 transition-transform duration-300">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        loading="lazy"
                                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain drop-shadow-lg"
                                    />
                                </div>
                                
                                {/* Category Name - Bottom Center */}
                                <div className="flex-none text-center w-full min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center px-1">
                                    <h3 className="font-bold text-[10px] sm:text-xs md:text-sm lg:text-base leading-tight text-zinc-900">
                                        {category.name}
                                    </h3>
                                </div>
                            </div>
                        </Link >
                        ))
                        }
                    </div>
                </div >

                {/* See All Categories Link */}
                < div className="text-center mt-12" >
                    <Link
                        href="/categories"
                        className="inline-flex items-center gap-2 font-inter font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-6 py-3 hover:bg-blue-50"
                        aria-label="View all categories"
                    >
                        See all categories →
                    </Link>
                </div>
            </div>
        </div>
    );
}
