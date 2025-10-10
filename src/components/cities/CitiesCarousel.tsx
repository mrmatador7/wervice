'use client';

import { useRef, useState } from 'react';
import HeroCityCard from '../cards/HeroCityCard';
import SmallCityCard from '../cards/SmallCityCard';
import { useTranslations } from 'next-intl';

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

export default function CitiesCarousel({
    items,
    title,
    variant = 'default',
    className = ""
}: CitiesCarouselProps) {
    const t = useTranslations('home');
    const carouselTitle = title || t('cities.popularCities');

    // Sample Moroccan cities data with tint colors
    const defaultCities: CityItem[] = [
        {
            name: t('cities.names.casablanca'),
            slug: 'casablanca',
            image: '/cities/Casablanca.jpg',
            vendors: 245,
        },
        {
            name: t('cities.names.marrakech'),
            slug: 'marrakech',
            image: '/cities/Marrakech.jpg',
            vendors: 312,
        },
        {
            name: t('cities.names.rabat'),
            slug: 'rabat',
            image: '/cities/Rabat.jpg',
            vendors: 189,
        },
        {
            name: t('cities.names.tangier'),
            slug: 'tangier',
            image: '/cities/tanger.jpg',
            vendors: 156,
        },
        {
            name: t('cities.names.agadir'),
            slug: 'agadir',
            image: '/cities/Marrakech.jpg', // Using Marrakech as fallback
            vendors: 134,
        },
        {
            name: t('cities.names.fes'),
            slug: 'fes',
            image: '/cities/Fez.jpg',
            vendors: 178,
        },
        {
            name: t('cities.names.meknes'),
            slug: 'meknes',
            image: '/cities/meknes.jpg',
            vendors: 98,
        },
        {
            name: t('cities.names.elJadida'),
            slug: 'el-jadida',
            image: '/cities/El Jadida.jpg',
            vendors: 87,
        },
        {
            name: t('cities.names.kenitra'),
            slug: 'kenitra',
            image: '/cities/Kenitra.webp',
            vendors: 76,
        },
    ];

    // City tint color mapping by slug
    const cityTintColors: Record<string, string> = {
        'casablanca': '#4338CA',
        'marrakech': '#E11D48',
        'rabat': '#2563EB',
        'tangier': '#7C3AED',
        'agadir': '#F97316',
        'fes': '#10B981',
        'meknes': '#14B8A6',
        'el-jadida': '#06B6D4',
        'kenitra': '#65A30D',
    };

    // Helper function to get tint color for a city
    function getCityTint(citySlug: string): string {
        return cityTintColors[citySlug] || '#0B0D2E';
    }

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

    const cities = items || defaultCities;

    return (
        <div className={className}>
            {/* Section Title */}
            <div className="text-center mb-8">
                <h2 className="font-inter font-bold text-2xl md:text-3xl text-gray-900 mb-2">
                    {carouselTitle}
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                    {t('cities.subtitle')}
                </p>
            </div>

            {/* Carousel Track with Navigation */}
            <div className="relative">
                {/* Left Navigation Arrow */}
                {canScrollLeft && (
                    <button
                        onClick={scrollLeft}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-lime-400 hover:bg-lime-500 border border-lime-300 rounded-full p-2 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lime-400"
                        aria-label={t('carousel.scrollLeft')}
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
                        aria-label={t('carousel.scrollRight')}
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
                        {cities.map((city) => (
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
                                    tint={getCityTint(city.slug)}
                                />
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}