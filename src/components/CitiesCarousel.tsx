'use client';

import { useRef, useState } from 'react';
import HeroCityCard from './HeroCityCard';
import SmallCityCard from './SmallCityCard';

interface CityItem {
    name: string;
    slug: string;
    image: string;
    vendors?: number;
}

interface CitiesCarouselProps {
    items?: CityItem[];
    title?: string;
    variant?: 'default' | 'small';
    className?: string;
}

// Sample Moroccan cities data with tint colors
const defaultCities: CityItem[] = [
    {
        name: 'Casablanca',
        slug: 'casablanca',
        image: '/cities/Casablanca.jpg',
        vendors: 245,
    },
    {
        name: 'Marrakech',
        slug: 'marrakech',
        image: '/cities/Marrakech.jpg',
        vendors: 312,
    },
    {
        name: 'Rabat',
        slug: 'rabat',
        image: '/cities/Rabat.jpg',
        vendors: 189,
    },
    {
        name: 'Tangier',
        slug: 'tangier',
        image: '/cities/tanger.jpg',
        vendors: 156,
    },
    {
        name: 'Agadir',
        slug: 'agadir',
        image: '/cities/Marrakech.jpg', // Using Marrakech as fallback
        vendors: 134,
    },
    {
        name: 'Fes',
        slug: 'fes',
        image: '/cities/Fez.jpg',
        vendors: 178,
    },
    {
        name: 'Meknes',
        slug: 'meknes',
        image: '/cities/meknes.jpg',
        vendors: 98,
    },
    {
        name: 'El Jadida',
        slug: 'el-jadida',
        image: '/cities/El Jadida.jpg',
        vendors: 87,
    },
    {
        name: 'Kenitra',
        slug: 'kenitra',
        image: '/cities/Kenitra.webp',
        vendors: 76,
    },
];

// City tint color mapping
const cityTintColors: Record<string, string> = {
    'Casablanca': '#4338CA',
    'Marrakech': '#E11D48',
    'Rabat': '#2563EB',
    'Tangier': '#7C3AED',
    'Agadir': '#F97316',
    'Fes': '#10B981',
    'Meknes': '#14B8A6',
    'El Jadida': '#06B6D4',
    'Kenitra': '#65A30D',
};

// Helper function to get tint color for a city
function getCityTint(cityName: string): string {
    return cityTintColors[cityName] || '#0B0D2E';
}

export default function CitiesCarousel({
    items = defaultCities,
    title = "Popular Cities",
    variant = 'default',
    className = ""
}: CitiesCarouselProps) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollButtons = () => {
        if (!carouselRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    const scrollLeft = () => {
        if (!carouselRef.current) return;
        const cardWidth = variant === 'small' ? 160 : 300; // Approximate card width
        carouselRef.current.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' });
        setTimeout(checkScrollButtons, 300);
    };

    const scrollRight = () => {
        if (!carouselRef.current) return;
        const cardWidth = variant === 'small' ? 160 : 300; // Approximate card width
        carouselRef.current.scrollBy({ left: cardWidth * 2, behavior: 'smooth' });
        setTimeout(checkScrollButtons, 300);
    };

    return (
        <div className={className}>
            {/* Section Title */}
            <div className="text-center mb-8">
                <h2 className="font-inter font-bold text-2xl md:text-3xl text-gray-900 mb-2">
                    {title}
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                    Discover wedding vendors in Morocco&apos;s most beautiful cities
                </p>
            </div>

            {/* Carousel Track with Navigation */}
            <div className="relative">
                    {/* Left Navigation Arrow */}
                    {canScrollLeft && (
                        <button
                            onClick={scrollLeft}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-lime-400 hover:bg-lime-500 border border-lime-300 rounded-full p-2 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lime-400"
                            aria-label="Scroll left"
                        >
                            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Right Navigation Arrow */}
                    {canScrollRight && (
                        <button
                            onClick={scrollRight}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-lime-400 hover:bg-lime-500 border border-lime-300 rounded-full p-2 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lime-400"
                            aria-label="Scroll right"
                        >
                            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* Carousel Container */}
                    <div
                        ref={carouselRef}
                        className="overflow-hidden snap-x snap-mandatory -mx-4 px-4"
                        onScroll={checkScrollButtons}
                    >
                        <div className={`flex pb-4 pr-4 ${variant === 'small' ? 'space-x-3 md:space-x-4' : 'space-x-5 md:space-x-6'}`}>
                            {items.map((city) => (
                                variant === 'small' ? (
                                    <SmallCityCard
                                        key={city.slug}
                                        name={city.name}
                                        slug={city.slug}
                                        image={city.image}
                                        vendors={city.vendors}
                                    />
                                ) : (
                                    <HeroCityCard
                                        key={city.slug}
                                        name={city.name}
                                        slug={city.slug}
                                        image={city.image}
                                        vendors={city.vendors}
                                        tint={getCityTint(city.name)}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                </div>
        </div>
    );
}
