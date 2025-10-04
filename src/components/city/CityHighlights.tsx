interface CityHighlightsProps {
  city: {
    name: string;
    description: string;
    image: string;
    tagline: string;
  };
}

const highlights = [
  {
    icon: '🏰',
    title: 'Stunning Venues',
    description: 'From historic palaces to modern luxury spaces, find the perfect setting for your celebration.',
  },
  {
    icon: '🍽️',
    title: 'Traditional Catering',
    description: 'Experience authentic Moroccan cuisine prepared by master chefs with modern presentation.',
  },
  {
    icon: '👰',
    title: 'Expert Planners',
    description: 'Work with experienced wedding planners who understand local customs and modern trends.',
  },
];

export default function CityHighlights({ city }: CityHighlightsProps) {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-wervice-ink mb-2">
          Why couples choose {city.name} for weddings
        </h2>
        <p className="text-wervice-taupe max-w-2xl mx-auto">
          Discover what makes {city.name} a perfect destination for your special day
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((highlight, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-wervice-lime/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{highlight.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-wervice-ink mb-2">
                {highlight.title}
              </h3>
              <p className="text-sm text-wervice-taupe leading-relaxed">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
