'use client';

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
    return (
        <section className={`px-4 md:px-6 lg:px-8 py-8 bg-[#F7F8FB] ${className}`}>
            <div className="max-w-7xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-8">
                    <h2 className="font-inter font-bold text-2xl md:text-3xl text-gray-900 mb-2">
                        {title}
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">
                        Discover wedding vendors in Morocco's most beautiful cities
                    </p>
                </div>

                {/* Carousel Track */}
                <div className="relative">
                    <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory -mx-4 px-4">
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
        </section>
    );
}
