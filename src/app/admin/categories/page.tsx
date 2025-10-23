'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/admin/PageHeader';
import { type Category } from '@/lib/mock';
import StatusPill from '@/components/admin/StatusPill';
import { Edit, Eye, Trash2 } from 'lucide-react';
import CategoryDialog from '@/components/admin/CategoryDialog';

interface DBCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string;
  cover_url?: string | null;
  strapline?: string | null;
  is_active?: boolean;
  created_at?: string;
}

export default function CategoriesPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DBCategory | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [categories, setCategories] = useState<DBCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/categories');
      const result = await response.json();
      
      if (result.success) {
        setCategories(result.categories);
      } else {
        console.error('Failed to fetch categories:', result.error);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setShowDialog(true);
  };

  const handleEditCategory = (category: DBCategory) => {
    setSelectedCategory(category);
    setShowDialog(true);
  };

  const handleViewCategory = (category: DBCategory) => {
    setSelectedCategory(category);
    setShowViewDialog(true);
  };

  const handleDeleteCategory = async (category: DBCategory) => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        const response = await fetch(`/api/admin/categories/${category.id}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        
        if (result.success) {
          // Refresh categories list
          fetchCategories();
        } else {
          alert(`Failed to delete category: ${result.error}`);
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('An error occurred while deleting the category');
      }
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setSelectedCategory(null);
  };

  const handleDialogSuccess = () => {
    // Refresh categories list
    fetchCategories();
    setShowDialog(false);
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        subtitle="Manage wedding service categories"
      >
        <button 
          onClick={handleAddCategory}
          className="px-4 py-2 bg-wv.lime text-wv.black rounded-lg font-medium hover:bg-wv.limeDark"
        >
          Add Category
        </button>
      </PageHeader>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-4 text-wv.sub">Loading categories...</p>
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-wv.sub mb-4">No categories found</p>
          <button 
            onClick={handleAddCategory}
            className="px-4 py-2 bg-wv.lime text-wv.black rounded-lg font-medium hover:bg-wv.limeDark"
          >
            Create your first category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-wv.card rounded-xl p-6 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-wv.lime rounded-lg flex items-center justify-center">
                  <span className="text-wv.black font-bold text-lg">{category.name[0]}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditCategory(category)}
                    className="p-2 hover:bg-wv.line rounded-lg transition-colors"
                    title="Edit category"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleViewCategory(category)}
                    className="p-2 hover:bg-wv.line rounded-lg transition-colors"
                    title="View category"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category)}
                    className="p-2 hover:bg-wv.line rounded-lg text-wv.danger transition-colors"
                    title="Delete category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-wv.text mb-2">{category.name}</h3>
              <p className="text-sm text-wv.sub mb-4">{category.description || 'No description'}</p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-wv.sub">
                  {category.slug}
                </span>
                <StatusPill status={category.is_active === false ? 'Suspended' : 'Active'} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Category Dialog */}
      <CategoryDialog
        isOpen={showDialog}
        onClose={handleDialogClose}
        onSuccess={handleDialogSuccess}
        category={selectedCategory ? {
          id: selectedCategory.id,
          name: selectedCategory.name,
          description: selectedCategory.description || '',
          slug: selectedCategory.slug,
          coverUrl: selectedCategory.cover_url || undefined,
          strapline: selectedCategory.strapline || undefined
        } : null}
      />
    </div>
  );
}
