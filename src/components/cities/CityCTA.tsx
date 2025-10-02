import Link from 'next/link';

interface CityCTAProps {
  city: {
    name: string;
    description: string;
    image: string;
  };
}

export default function CityCTA({ city }: CityCTAProps) {
  return (
    <section className="relative bg-gradient-to-r from-wervice-lime via-[#c4e600] to-wervice-lime py-16 lg:py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-white rounded-full"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4">
          Start planning your wedding in {city.name} today
        </h2>

        <p className="text-black/80 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
          Connect with the best vendors and create unforgettable memories in {city.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Explore Vendors
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <Link
            href="/become-vendor"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-black/10"
          >
            Become a Vendor
          </Link>
        </div>

        <div className="mt-8 text-sm text-black/60">
          Join thousands of couples who found their perfect wedding team
        </div>
      </div>
    </section>
  );
}
