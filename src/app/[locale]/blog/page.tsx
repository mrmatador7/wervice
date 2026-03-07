import dynamic from 'next/dynamic';

// Dynamically import the client component
const BlogPageContent = dynamic(() => import('./BlogPageContent'), {
  loading: () => (
    <div className="min-h-screen bg-[#f5f5f4] flex items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-800"></div>
    </div>
  )
});

// Export the client component as default
export default function BlogPage() {
  return <BlogPageContent />;
}
