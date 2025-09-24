'use client';

interface HeroProps {
  onCategoryClick: (category: string) => void;
  onViewOffers: () => void;
}

const categories = [
  { key: 'venues', label: 'Venues', count: 50 },
  { key: 'catering', label: 'Catering', count: 30 },
  { key: 'photo-video', label: 'Photo & Video', count: 40 },
  { key: 'planning-beauty', label: 'Planning Beauty', count: 25 },
  { key: 'decor', label: 'Decor', count: 35 },
  { key: 'music', label: 'Music', count: 20 },
  { key: 'dresses', label: 'Dresses', count: 45 },
];

export default function Hero({ onCategoryClick, onViewOffers }: HeroProps) {
  return (
    <section className="bg-secondary text-white min-h-[500px] flex items-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="moroccan-pattern w-full h-full"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-amiri font-bold text-primary mb-6 leading-tight">
              Best Wedding Deals on Wervice
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Over 500 Moroccan vendors & packages for your authentic celebration
            </p>

            {/* Cultural Icons */}
            <div className="flex justify-center lg:justify-start space-x-6 mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center text-3xl">
                🖐️
              </div>
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center text-3xl">
                🏮
              </div>
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center text-3xl">
                💍
              </div>
            </div>

            <button
              onClick={onViewOffers}
              className="btn-primary text-lg px-8 py-4"
            >
              View Offers
            </button>
          </div>

          {/* Right Content - Category Chips */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
              {categories.map((category) => (
                <div
                  key={category.key}
                  className="chip text-center"
                  onClick={() => onCategoryClick(category.key)}
                >
                  <div className="font-semibold">{category.label}</div>
                  <div className="text-sm opacity-80">({category.count})</div>
                </div>
              ))}
              <div
                className="chip text-center col-span-2 md:col-span-3 lg:col-span-2 mt-4"
                onClick={() => onCategoryClick('all')}
              >
                Show All
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 border-4 border-primary/20 rounded-full hidden lg:block"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 border-2 border-primary/30 rounded-full hidden lg:block"></div>
    </section>
  );
}
