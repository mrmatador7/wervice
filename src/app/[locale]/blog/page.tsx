import dynamic from 'next/dynamic';

// Dynamically import the client component
const BlogPageContent = dynamic(() => import('./BlogPageContent'), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#D7FF1F]"></div>
    </div>
  )
});

// Export the client component as default
export default function BlogPage() {
  return <BlogPageContent />;
}
