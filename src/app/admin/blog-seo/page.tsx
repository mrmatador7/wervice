'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/admin/PageHeader';
import StatusPill from '@/components/admin/StatusPill';
import { Edit, Eye, Plus } from 'lucide-react';

type BlogPost = {
  slug: string;
  title: string;
  excerpt?: string;
  cover?: string;
  author?: string;
  date: string;
  status?: 'Draft' | 'Published';
  tags?: string[];
  content: string;
  source: 'admin' | 'website';
};

type SeoSettings = {
  homepageTitle: string;
  homepageDescription: string;
};

const ARTICLE_TEMPLATE = `# {{title}}

Start with a short opening paragraph that explains why this topic matters for couples planning a Moroccan wedding.

## {{city}} Wedding Spotlight

Describe one strong option in the same tone and depth used on the website.

[Browse related vendors](/en/categories/{{category}}?city={{city}})

## Another Recommended Option

Add practical details about planning, guest flow, price expectations, and timing.

[Browse related vendors](/en/categories/{{category}}?city={{city}})

## Conclusion

Summarize key choices and what couples should do next.

## Frequently Asked Questions

**When should we book this vendor category?**  
Add a short and practical answer.

**What should we compare before booking?**  
Add a short and practical answer.
`;

const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  cover: '',
  author: 'Wervice Editorial',
  date: new Date().toISOString().slice(0, 16),
  status: 'Published' as 'Draft' | 'Published',
  tags: 'venues,marrakech,wedding,morocco',
  content: '',
};

export default function BlogSEOPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingSeo, setSavingSeo] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [seo, setSeo] = useState<SeoSettings>({
    homepageTitle: '',
    homepageDescription: '',
  });

  const publishedCount = useMemo(
    () => posts.filter((post) => (post.status || 'Published') === 'Published').length,
    [posts]
  );

  const loadBlogData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/blog', { cache: 'no-store' });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch blog data');
      }

      setPosts(Array.isArray(result.posts) ? result.posts : []);
      setSeo(result.seo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogData();
  }, []);

  const saveSeoSettings = async () => {
    try {
      setSavingSeo(true);
      const response = await fetch('/api/admin/blog/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seo),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to save SEO settings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save SEO settings');
    } finally {
      setSavingSeo(false);
    }
  };

  const createPost = async () => {
    try {
      setCreatingPost(true);
      setError(null);
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          date: new Date(form.date).toISOString(),
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create post');
      }

      setForm(EMPTY_FORM);
      setShowCreateForm(false);
      await loadBlogData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setCreatingPost(false);
    }
  };

  const applyTemplate = () => {
    const title = form.title || 'Best Wedding Venues in Marrakech (2026 Guide)';
    const firstTag = form.tags.split(',')[0]?.trim() || 'venues';
    const secondTag = form.tags.split(',')[1]?.trim() || 'Marrakech';
    const city = secondTag.charAt(0).toUpperCase() + secondTag.slice(1);

    setForm((prev) => ({
      ...prev,
      content: ARTICLE_TEMPLATE.replaceAll('{{title}}', title)
        .replaceAll('{{category}}', firstTag)
        .replaceAll('{{city}}', city),
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog & SEO"
        subtitle="Manage live blog content and SEO settings"
      >
        <button
          onClick={() => setShowCreateForm((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-wv.lime px-4 py-2 font-medium text-wv.black hover:bg-wv.limeDark"
        >
          <Plus size={16} />
          New Post
        </button>
      </PageHeader>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div className="rounded-xl bg-wv.card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-wv.text">Create Website-Style Article</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-wv.text">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-lg border border-wv.line bg-wv.bg p-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-wv.text">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="leave empty to auto-generate"
                className="w-full rounded-lg border border-wv.line bg-wv.bg p-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-wv.text">Author</label>
              <input
                value={form.author}
                onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                className="w-full rounded-lg border border-wv.line bg-wv.bg p-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-wv.text">Publish Date</label>
              <input
                type="datetime-local"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full rounded-lg border border-wv.line bg-wv.bg p-3 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-wv.text">Excerpt</label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                className="w-full rounded-lg border border-wv.line bg-wv.bg p-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-wv.text">Cover URL</label>
              <input
                value={form.cover}
                onChange={(e) => setForm((prev) => ({ ...prev, cover: e.target.value }))}
                placeholder="https://..."
                className="w-full rounded-lg border border-wv.line bg-wv.bg p-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-wv.text">Tags (comma-separated)</label>
              <input
                value={form.tags}
                onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                className="w-full rounded-lg border border-wv.line bg-wv.bg p-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-wv.text">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as 'Draft' | 'Published' }))}
                className="w-full rounded-lg border border-wv.line bg-wv.bg p-3 text-sm"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-sm font-medium text-wv.text">Article Content (Markdown)</label>
                <button
                  type="button"
                  onClick={applyTemplate}
                  className="rounded-lg border border-wv.line px-3 py-1 text-xs font-medium text-wv.text hover:bg-wv.bg"
                >
                  Use Website Template
                </button>
              </div>
              <textarea
                rows={16}
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                className="w-full rounded-lg border border-wv.line bg-wv.bg p-3 font-mono text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={createPost}
              disabled={creatingPost}
              className="rounded-lg bg-wv.black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {creatingPost ? 'Creating...' : 'Create Post'}
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="rounded-lg border border-wv.line px-4 py-2 text-sm font-medium text-wv.text hover:bg-wv.bg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-wv.card p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-wv.text">Current Website Articles</h3>
            <span className="text-sm text-wv.sub">
              {publishedCount} published / {posts.length} total
            </span>
          </div>

          {loading ? (
            <div className="text-sm text-wv.sub">Loading posts...</div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.slug} className="flex items-center justify-between rounded-lg bg-wv.bg p-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-wv.text">{post.title}</h4>
                    <div className="mt-1 flex flex-wrap items-center gap-3">
                      <StatusPill status={post.status || 'Published'} />
                      <span className="text-sm text-wv.sub">{new Date(post.date).toLocaleDateString()}</span>
                      <span className="text-sm text-wv.sub">by {post.author || 'Wervice Editorial'}</span>
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                        {post.source}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/en/blog/${post.slug}`} target="_blank" className="rounded-lg p-2 hover:bg-wv.line">
                      <Eye size={16} />
                    </Link>
                    <button className="rounded-lg p-2 text-zinc-400" disabled>
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-wv.card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-wv.text">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-wv.text">Homepage Title</label>
              <input
                type="text"
                value={seo.homepageTitle}
                onChange={(e) => setSeo((prev) => ({ ...prev, homepageTitle: e.target.value }))}
                className="w-full rounded-lg border border-wv.line bg-wv.bg p-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-wv.text">Homepage Description</label>
              <textarea
                value={seo.homepageDescription}
                onChange={(e) => setSeo((prev) => ({ ...prev, homepageDescription: e.target.value }))}
                className="w-full resize-none rounded-lg border border-wv.line bg-wv.bg p-3 text-sm"
                rows={3}
              />
            </div>
            <button
              onClick={saveSeoSettings}
              disabled={savingSeo}
              className="rounded-lg bg-wv.lime px-4 py-2 font-medium text-wv.black hover:bg-wv.limeDark disabled:opacity-50"
            >
              {savingSeo ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
