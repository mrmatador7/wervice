'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: {
    id: string;
    name: string;
    description: string;
    slug: string;
    coverUrl?: string;
    strapline?: string;
  } | null;
}

export default function CategoryDialog({
  isOpen,
  onClose,
  onSuccess,
  category,
}: CategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    coverUrl: '',
    strapline: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!category;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        slug: category.slug,
        coverUrl: category.coverUrl || '',
        strapline: category.strapline || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        slug: '',
        coverUrl: '',
        strapline: '',
      });
    }
    setError(null);
  }, [category, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from name if it's a new category
    if (name === 'name' && !isEditMode) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = isEditMode
        ? `/api/admin/categories/${category.id}`
        : '/api/admin/categories';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || 'Failed to save category');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error saving category:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Dialog */}
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-wv.text">
              {isEditMode ? 'Edit Category' : 'Add Category'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-wv.line rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-wv.text mb-1"
              >
                Category Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime"
                placeholder="e.g., Venues, Catering"
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-wv.text mb-1"
              >
                Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                disabled={isEditMode}
                className="w-full px-3 py-2 border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="e.g., venues, catering"
              />
              <p className="mt-1 text-xs text-wv.sub">
                {isEditMode
                  ? 'Slug cannot be changed after creation'
                  : 'Auto-generated from category name'}
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-wv.text mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime resize-none"
                placeholder="Brief description of the category"
              />
            </div>

            <div>
              <label
                htmlFor="coverUrl"
                className="block text-sm font-medium text-wv.text mb-1"
              >
                Cover Image URL
              </label>
              <input
                type="url"
                id="coverUrl"
                name="coverUrl"
                value={formData.coverUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime"
                placeholder="https://example.com/image.jpg"
              />
              {formData.coverUrl && (
                <div className="mt-2 relative h-24 rounded-lg overflow-hidden border border-wv.line">
                  <img
                    src={formData.coverUrl}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EInvalid URL%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              )}
              <p className="mt-1 text-xs text-wv.sub">
                Optional: URL for the category cover/hero image
              </p>
            </div>

            <div>
              <label
                htmlFor="strapline"
                className="block text-sm font-medium text-wv.text mb-1"
              >
                Strapline
              </label>
              <input
                type="text"
                id="strapline"
                name="strapline"
                value={formData.strapline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime"
                placeholder="e.g., Find your perfect wedding venue"
              />
              <p className="mt-1 text-xs text-wv.sub">
                Optional: Subtitle text shown on the category page
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-wv.line rounded-lg font-medium hover:bg-wv.line transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-wv.lime text-wv.black rounded-lg font-medium hover:bg-wv.limeDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Saving...'
                  : isEditMode
                  ? 'Update'
                  : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

