import { notFound } from 'next/navigation';

// City data and validation
const VALID_CITIES = {
  casablanca: {
    name: 'Casablanca',
    description: 'the Economic Hub',
    image: '/cities/Casablanca.jpg',
  },
  marrakech: {
    name: 'Marrakech',
    description: 'the Red City',
    image: '/cities/Marrakech.jpg',
  },
};

interface PageProps {
  params: Promise<{ city: string }>;
}

export default async function CityPage({ params }: PageProps) {
  const { city } = await params;
  const citySlug = city.toLowerCase();
  const cityData = VALID_CITIES[citySlug as keyof typeof VALID_CITIES];

  if (!cityData) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <div className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center">
            Welcome to {cityData.name}
          </h1>
          <p className="text-center mt-4">
            {cityData.description}
          </p>
        </div>
      </div>
    </main>
  );
}

// Generate static params for all valid cities
// export async function generateStaticParams() {
//   return Object.keys(VALID_CITIES).map((city) => ({
//     city,
//   }));
// }
