'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';


interface Category {
    name: string;
    count: number;
    image: string;
    href: string;
}

const categories: Category[] = [
    {
        name: 'Venues',
        count: 124,
        image: '/categories/venues.png',
        href: '/categories/venues',
    },
    {
        name: 'Catering',
        count: 87,
        image: '/categories/Catering.png',
        href: '/categories/catering',
    },
    {
        name: 'Photo & Video',
        count: 156,
        image: '/categories/photo.png',
        href: '/categories/photo-video',
    },
    {
        name: 'Event Planner',
        count: 92,
        image: '/categories/event planner.png',
        href: '/categories/planning',
    },
    {
        name: 'Beauty',
        count: 78,
        image: '/categories/beauty.png',
        href: '/categories/beauty',
    },
    {
        name: 'Decor',
        count: 134,
        image: '/categories/decor.png',
        href: '/categories/decor',
    },
    {
        name: 'Music',
        count: 67,
        image: '/categories/music.png',
        href: '/categories/music',
    },
    {
        name: 'Dresses',
        count: 189,
        image: '/categories/Dresses.png',
        href: '/categories/dresses',
    },
];

export default function CategoriesSection() {
    const locale = useLocale();

    const categories: Category[] = [
        {
            name: 'Venues',
            count: 124,
            image: '/categories/venues.png',
            href: `/${locale}/categories/venues`,
        },
        {
            name: 'Catering',
            count: 87,
            image: '/categories/Catering.png',
            href: `/${locale}/categories/catering`,
        },
        {
            name: 'Photo & Video',
            count: 156,
            image: '/categories/photo.png',
            href: `/${locale}/categories/photo-video`,
        },
        {
            name: 'Event Planner',
            count: 92,
            image: '/categories/event planner.png',
            href: `/${locale}/categories/planning`,
        },
        {
            name: 'Beauty',
            count: 78,
            image: '/categories/beauty.png',
            href: `/${locale}/categories/beauty`,
        },
        {
            name: 'Decor',
            count: 134,
            image: '/categories/decor.png',
            href: `/${locale}/categories/decor`,
        },
        {
            name: 'Music',
            count: 67,
            image: '/categories/music.png',
            href: `/${locale}/categories/music`,
        },
        {
            name: 'Dresses',
            count: 189,
            image: '/categories/Dresses.png',
            href: `/${locale}/categories/dresses`,
        },
    ];

    return (
        <section className="pt-12 md:pt-16 px-4 md:px-6 lg:px-8 bg-[#F7F8FB]">
            <div className="max-w-7xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-8">
                    <h2 className="font-inter font-bold text-2xl md:text-3xl text-gray-900 mb-4">
                        Browse by Category
                    </h2>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:opacity-92 overflow-hidden"
                            aria-label={`Browse ${category.name}`}
                        >
                            {/* Card Content */}
                            <div className="h-36 md:h-40 p-6 relative">

                                {/* Top-left: Category Name */}
                                <div className="flex flex-col mb-4">
                                    <h3 className="text-black font-semibold text-lg leading-tight mb-1">
                                        {category.name}
                                    </h3>
                                    {category.count && (
                                        <p className="text-gray-500 text-sm">
                                            {category.count} vendors
                                        </p>
                                    )}
                                </div>

                                {/* CTA Button */}
                                <div className="absolute bottom-4 left-4">
                                    <div className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-200">
                                        <span>View All</span>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Right/Bottom-right: 3D Illustration */}
                                <div className="absolute bottom-4 right-4">
                                    <div className="w-16 h-16 md:w-20 md:h-20">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            loading="lazy"
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Link >
                    ))
                    }
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
                    </div >
            </div >
        </section >
    );
}
