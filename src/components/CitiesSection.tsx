'use client';

import Link from 'next/link';

interface City {
    name: string;
    country: string;
    vendorCount: number;
    image: string;
    href: string;
}

const cities: City[] = [
    {
        name: 'Casablanca',
        country: 'Morocco',
        vendorCount: 245,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        href: '/cities/casablanca',
    },
    {
        name: 'Marrakech',
        country: 'Morocco',
        vendorCount: 312,
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0b7ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        href: '/cities/marrakech',
    },
    {
        name: 'Rabat',
        country: 'Morocco',
        vendorCount: 189,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        href: '/cities/rabat',
    },
    {
        name: 'Tangier',
        country: 'Morocco',
        vendorCount: 156,
        image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        href: '/cities/tangier',
    },
    {
        name: 'Agadir',
        country: 'Morocco',
        vendorCount: 134,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        href: '/cities/agadir',
    },
    {
        name: 'Fes',
        country: 'Morocco',
        vendorCount: 178,
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0b7ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        href: '/cities/fes',
    },
    {
        name: 'Meknes',
        country: 'Morocco',
        vendorCount: 98,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        href: '/cities/meknes',
    },
    {
        name: 'El Jadida',
        country: 'Morocco',
        vendorCount: 87,
        image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        href: '/cities/el-jadida',
    },
    {
        name: 'Kenitra',
        country: 'Morocco',
        vendorCount: 76,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        href: '/cities/kenitra',
    },
];

export default function CitiesSection() {
    return (
        <section className="px-4 md:px-6 lg:px-8 py-12 md:py-16 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-8">
                    <h2 className="font-inter font-bold text-2xl md:text-3xl text-gray-900 mb-4">
                        Explore Cities
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover wedding vendors in Morocco's most beautiful cities
                    </p>
                </div>

                {/* Cities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {cities.map((city) => (
                        <Link
                            key={city.name}
                            href={city.href}
                            className="group relative rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:opacity-92 overflow-hidden"
                            aria-label={`Browse vendors in ${city.name}`}
                        >
                            {/* City Photo Background */}
                            <div className="aspect-[4/3] relative">
                                <img
                                    src={city.image}
                                    alt={`${city.name} cityscape`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                />

                                {/* Text Overlay */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                                        <h3 className="text-gray-900 font-semibold text-lg md:text-xl leading-tight mb-1">
                                            {city.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {city.vendorCount} vendors
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All Cities Link */}
                <div className="text-center mt-12">
                    <Link
                        href="/cities"
                        className="inline-flex items-center gap-2 font-inter font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-6 py-3 hover:bg-blue-50"
                        aria-label="View all cities"
                    >
                        View all cities →
                    </Link>
                </div>
            </div>
        </section>
    );
}
