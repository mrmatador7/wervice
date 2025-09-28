'use client';

import Link from 'next/link';

interface Category {
    name: string;
    count: number;
    image: string;
    href: string;
    gradient: string;
}

const categories: Category[] = [
    {
        name: 'Venues',
        count: 124,
        image: '/categories/venues.png',
        href: '/categories/venues',
        gradient: 'bg-gradient-to-br from-purple-400 to-blue-600',
    },
    {
        name: 'Catering',
        count: 87,
        image: '/categories/Catering.png',
        href: '/categories/catering',
        gradient: 'bg-gradient-to-br from-orange-400 to-yellow-500',
    },
    {
        name: 'Photo & Video',
        count: 156,
        image: '/categories/Photo & Video.png',
        href: '/categories/photo-video',
        gradient: 'bg-gradient-to-br from-pink-400 to-purple-600',
    },
    {
        name: 'Event Planner',
        count: 92,
        image: '/categories/Event Planner.png',
        href: '/categories/planning',
        gradient: 'bg-gradient-to-br from-blue-500 to-indigo-700',
    },
    {
        name: 'Beauty',
        count: 78,
        image: '/categories/beauty.png',
        href: '/categories/beauty',
        gradient: 'bg-gradient-to-br from-pink-400 to-rose-500',
    },
    {
        name: 'Decor',
        count: 134,
        image: '/categories/decor.png',
        href: '/categories/decor',
        gradient: 'bg-gradient-to-br from-green-400 to-teal-600',
    },
    {
        name: 'Music',
        count: 67,
        image: '/categories/music.png',
        href: '/categories/music',
        gradient: 'bg-gradient-to-br from-red-400 to-orange-500',
    },
    {
        name: 'Dresses',
        count: 189,
        image: '/categories/Dresses.png',
        href: '/categories/dresses',
        gradient: 'bg-gradient-to-br from-rose-400 to-pink-600',
    },
];

export default function CategoriesSection() {
    return (
        <section className="px-4 py-16 md:px-8 lg:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="font-inter font-bold text-2xl md:text-3xl text-gray-900 mb-4">
                        Browse by Category
                    </h2>
                </div>

                {/* Categories Container */}
                <div className="rounded-3xl p-8 md:p-12">
                    {/* Categories Grid - Images */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 md:gap-12 mb-8">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                href={category.href}
                                className={`group flex flex-col items-center justify-center p-4 rounded-2xl ${category.gradient} transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 hover:scale-105`}
                                aria-label={`View ${category.name} category`}
                            >
                                {/* Image Container */}
                                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                                </div>

                                {/* Category Name */}
                                <span className="mt-3 text-sm md:text-base font-medium text-white transition-colors duration-300 text-center">
                                    {category.name}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* See All Categories Link */}
                    <div className="text-center">
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
        </section>
    );
}
