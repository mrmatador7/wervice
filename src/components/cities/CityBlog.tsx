import Image from 'next/image';
import Link from 'next/link';

interface CityBlogProps {
  city: {
    name: string;
    description: string;
    image: string;
  };
}

const blogPosts = [
  {
    id: '1',
    title: `Wedding Venues in ${city?.name || 'Morocco'}: A Complete Guide`,
    excerpt: 'Discover the most stunning wedding venues in the city, from historic palaces to modern luxury spaces perfect for your special day.',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop&w=600&h=400',
    slug: 'wedding-venues-guide',
    readTime: 8,
  },
  {
    id: '2',
    title: `Traditional Wedding Customs in ${city?.name || 'Morocco'}`,
    excerpt: 'Learn about the beautiful cultural traditions and ceremonies that make Moroccan weddings truly unique and memorable.',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop&w=600&h=400',
    slug: 'wedding-traditions-guide',
    readTime: 6,
  },
  {
    id: '3',
    title: `Planning Your Dream Wedding in ${city?.name || 'Morocco'}: Tips & Advice`,
    excerpt: 'Get expert advice on planning your perfect wedding, from choosing vendors to creating unforgettable moments.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop&w=600&h=400',
    slug: 'wedding-planning-tips',
    readTime: 10,
  },
];

export default function CityBlog({ city }: CityBlogProps) {
  // Update titles with actual city name
  const cityPosts = blogPosts.map(post => ({
    ...post,
    title: post.title.replace('Morocco', city.name),
    excerpt: post.excerpt.replace('Morocco', city.name),
  }));

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-wervice-ink mb-2">
          Wedding Guides in {city.name}
        </h2>
        <p className="text-wervice-taupe">
          Expert advice and inspiration for planning your wedding in {city.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cityPosts.map((post) => (
          <article
            key={post.id}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
          >
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-wervice-lime transition-colors leading-tight">
                  {post.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {post.readTime} min read
                  </div>

                  <span className="text-sm font-medium text-wervice-lime group-hover:text-wervice-ink transition-colors">
                    Read more →
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
