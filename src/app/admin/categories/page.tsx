'use client';

import { useState, useEffect } from 'react';
import { 
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiRefreshCw,
  FiToggleLeft, FiToggleRight, FiImage, FiTag, FiList
} from 'react-icons/fi';
import Link from 'next/link';
import { getSubcategoriesForCategory } from '@/lib/subcategories';

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
  const [categories, setCategories] = useState<DBCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<DBCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedCategory, setSelectedCategory] = useState<DBCategory | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

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

  // Filter categories
  useEffect(() => {
    let result = [...categories];

    // Search filter
    if (searchQuery) {
      result = result.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus === 'active') {
      result = result.filter(cat => cat.is_active !== false);
    } else if (filterStatus === 'inactive') {
      result = result.filter(cat => cat.is_active === false);
    }

    setFilteredCategories(result);
  }, [categories, searchQuery, filterStatus]);

  const handleDeleteCategory = async (category: DBCategory) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (result.success) {
        fetchCategories();
      } else {
        alert(`Failed to delete category: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('An error occurred while deleting the category');
    }
  };

  const handleToggleStatus = async (category: DBCategory) => {
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...category,
          is_active: !category.is_active,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        fetchCategories();
      } else {
        alert('Failed to update category status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Error updating category');
    }
  };

  const activeCount = categories.filter(c => c.is_active !== false).length;
  const inactiveCount = categories.filter(c => c.is_active === false).length;

  return (
    <div className="min-h-screen bg-[#f4f4f4] p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#11190C]">Categories Management</h1>
            <p className="text-gray-600 mt-1">Manage wedding service categories and subcategories</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchCategories}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <Link
              href="/admin/categories/new"
              className="px-4 py-2 bg-[#D9FF0A] text-[#11190C] rounded-xl hover:bg-[#BEE600] transition-colors flex items-center gap-2 font-semibold"
            >
              <FiPlus className="w-4 h-4" />
              Add Category
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Categories</span>
              <FiList className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-[#11190C]">{categories.length}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Active</span>
              <FiToggleRight className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">{activeCount}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Inactive</span>
              <FiToggleLeft className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-600">{inactiveCount}</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories by name, slug, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9FF0A] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No categories found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          {categories.length === 0 && (
            <Link
              href="/admin/categories/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#D9FF0A] text-[#11190C] rounded-xl hover:bg-[#BEE600] transition-colors font-semibold"
            >
              <FiPlus className="w-4 h-4" />
              Create First Category
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCategories.map((category) => {
            const subcategories = getSubcategoriesForCategory(category.slug);
            
            return (
              <div key={category.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Category Header with Cover */}
                <div className="relative h-32 bg-gradient-to-br from-[#D9FF0A]/20 to-[#BEE600]/10">
                  {category.cover_url ? (
                    <img
                      src={category.cover_url}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiImage className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleStatus(category)}
                    className={`absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      category.is_active !== false
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.is_active !== false ? (
                      <>
                        <FiToggleRight className="w-4 h-4" />
                        Active
                      </>
                    ) : (
                      <>
                        <FiToggleLeft className="w-4 h-4" />
                        Inactive
                      </>
                    )}
                  </button>
                </div>

                {/* Category Content */}
                <div className="p-6">
                  {/* Name and Slug */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-[#11190C] mb-1">{category.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiTag className="w-3 h-3" />
                      <span className="font-mono">{category.slug}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                  )}

                  {/* Strapline */}
                  {category.strapline && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 italic">"{category.strapline}"</p>
                    </div>
                  )}

                  {/* Subcategories Count */}
                  <div className="mb-4 p-3 bg-[#D9FF0A]/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 font-medium">Subcategories</span>
                      <span className="text-sm font-bold text-[#11190C]">{subcategories.length}</span>
                    </div>
                    {subcategories.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {subcategories.slice(0, 3).map(sub => (
                          <span key={sub.slug} className="text-xs px-2 py-1 bg-white rounded-full text-gray-600">
                            {sub.name}
                          </span>
                        ))}
                        {subcategories.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-500">
                            +{subcategories.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/en/categories/${category.slug}`}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
                    >
                      <FiEye className="w-4 h-4" />
                      View
                    </Link>
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors text-sm font-medium text-blue-700"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors text-sm font-medium text-red-700"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Results Count */}
      {!isLoading && filteredCategories.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      )}
    </div>
  );
}
