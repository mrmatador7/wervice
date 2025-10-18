import PageHeader from '@/components/admin/PageHeader';
import StatusPill from '@/components/admin/StatusPill';
import { blogPosts } from '@/lib/mock';
import { MoreHorizontal, Edit, Eye, Plus } from 'lucide-react';

export default function BlogSEOPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog & SEO"
        subtitle="Manage blog posts and SEO settings"
      >
        <button className="flex items-center gap-2 px-4 py-2 bg-wv.lime text-wv.black rounded-lg font-medium hover:bg-wv.limeDark">
          <Plus size={16} />
          New Post
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blog Posts */}
        <div className="bg-wv.card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-wv.text mb-4">Blog Posts</h3>
          <div className="space-y-4">
            {blogPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-wv.bg rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-wv.text">{post.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <StatusPill status={post.status} />
                    <span className="text-sm text-wv.sub">{post.updated}</span>
                    <span className="text-sm text-wv.sub">by {post.author}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-wv.line rounded-lg">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 hover:bg-wv.line rounded-lg">
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-wv.card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-wv.text mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-wv.text mb-2">
                Homepage Title
              </label>
              <input
                type="text"
                defaultValue="Wervice - Moroccan Wedding Planning"
                className="w-full p-3 bg-wv.bg border border-wv.line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wv.limeDark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-wv.text mb-2">
                Homepage Description
              </label>
              <textarea
                defaultValue="Authentic Moroccan weddings made easy with categories like Venues, Dresses, and Decor."
                className="w-full p-3 bg-wv.bg border border-wv.line rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-wv.limeDark"
                rows={3}
              />
            </div>
            <button className="px-4 py-2 bg-wv.lime text-wv.black rounded-lg font-medium hover:bg-wv.limeDark">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
