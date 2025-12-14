'use client';

import { useState, useEffect } from 'react';
import { 
  FiSearch, FiPlus, FiUpload, FiDownload, FiEdit2, FiTrash2, 
  FiEye, FiFilter, FiRefreshCw, FiCheckCircle, FiXCircle, 
  FiClock, FiDollarSign, FiMapPin, FiTag, FiPhone, FiMail,
  FiImage, FiCalendar, FiTrendingUp
} from 'react-icons/fi';
import Link from 'next/link';
import { toast } from 'sonner';
import { ImportVendorsDialog } from '@/components/admin/AddVendorDialog';
import { AttachImagesDialog } from '@/components/admin/AttachImagesDialog';

interface Vendor {
  id: string;
  name: string;
  slug: string;
  city: string;
  category: string;
  subcategory?: string;
  status: string;
  plan: string;
  planPrice: number;
  profilePhotoUrl?: string;
  galleryPhotoUrls?: string[];
  email?: string;
  phone?: string;
  startingPrice?: number;
  description?: string;
  published: boolean;
  createdAt: string;
  updatedAt?: string;
}

type FilterType = 'all' | 'active' | 'pending' | 'inactive';
type SortType = 'newest' | 'oldest' | 'name' | 'price' | 'plan';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [selectedVendors, setSelectedVendors] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAttachImagesDialog, setShowAttachImagesDialog] = useState(false);
  const [syncingVendorId, setSyncingVendorId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0,
    published: 0,
  });

  // Fetch vendors from API
  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/vendors');
      const result = await response.json();

      if (result.success) {
        setVendors(result.vendors);
        calculateStats(result.vendors);
      } else {
        console.error('Failed to fetch vendors');
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (vendorList: Vendor[]) => {
    setStats({
      total: vendorList.length,
      active: vendorList.filter(v => v.status === 'active').length,
      pending: vendorList.filter(v => v.status === 'pending').length,
      inactive: vendorList.filter(v => v.status === 'inactive').length,
      published: vendorList.filter(v => v.published).length,
    });
  };

  // Filter and sort vendors
  useEffect(() => {
    let result = [...vendors];

    // Search filter
    if (searchQuery) {
      result = result.filter(vendor =>
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterType !== 'all') {
      result = result.filter(vendor => vendor.status === filterType);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(vendor => vendor.category === selectedCategory);
    }

    // City filter
    if (selectedCity !== 'all') {
      result = result.filter(vendor => vendor.city === selectedCity);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return (b.startingPrice || 0) - (a.startingPrice || 0);
        case 'plan':
          return b.planPrice - a.planPrice;
        default:
          return 0;
      }
    });

    setFilteredVendors(result);
  }, [vendors, searchQuery, filterType, selectedCategory, selectedCity, sortBy]);

  // Initial load
  useEffect(() => {
    fetchVendors();
  }, []);

  // Get unique categories and cities
  const categories = Array.from(new Set(vendors.map(v => v.category)));
  const cities = Array.from(new Set(vendors.map(v => v.city)));

  // Toggle vendor selection
  const toggleVendorSelection = (id: string) => {
    const newSelected = new Set(selectedVendors);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedVendors(newSelected);
  };

  // Select all visible vendors
  const toggleSelectAll = () => {
    if (selectedVendors.size === filteredVendors.length) {
      setSelectedVendors(new Set());
    } else {
      setSelectedVendors(new Set(filteredVendors.map(v => v.id)));
    }
  };

  // Delete vendor
  const handleDeleteVendor = async (vendorId: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;

    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchVendors();
      } else {
        alert('Failed to delete vendor');
      }
    } catch (error) {
      console.error('Error deleting vendor:', error);
      alert('Error deleting vendor');
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedVendors.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedVendors.size} vendor(s)?`)) return;

    try {
      const deletePromises = Array.from(selectedVendors).map(id =>
        fetch(`/api/admin/vendors/${id}`, { method: 'DELETE' })
      );

      await Promise.all(deletePromises);
      setSelectedVendors(new Set());
      fetchVendors();
    } catch (error) {
      console.error('Error deleting vendors:', error);
      alert('Error deleting vendors');
    }
  };

  // Bulk publish
  const handleBulkPublish = async () => {
    if (selectedVendors.size === 0) return;
    if (!confirm(`Are you sure you want to publish ${selectedVendors.size} vendor(s) to the website?`)) return;

    try {
      const publishPromises = Array.from(selectedVendors).map(id =>
        fetch(`/api/admin/vendors/${id}/publish`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ published: true })
        })
      );

      await Promise.all(publishPromises);
      setSelectedVendors(new Set());
      fetchVendors();
      alert(`Successfully published ${selectedVendors.size} vendor(s)!`);
    } catch (error) {
      console.error('Error publishing vendors:', error);
      alert('Error publishing vendors');
    }
  };

  // Bulk unpublish
  const handleBulkUnpublish = async () => {
    if (selectedVendors.size === 0) return;
    if (!confirm(`Are you sure you want to unpublish ${selectedVendors.size} vendor(s) from the website?`)) return;

    try {
      const unpublishPromises = Array.from(selectedVendors).map(id =>
        fetch(`/api/admin/vendors/${id}/publish`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ published: false })
        })
      );

      await Promise.all(unpublishPromises);
      setSelectedVendors(new Set());
      fetchVendors();
      alert(`Successfully unpublished ${selectedVendors.size} vendor(s)!`);
    } catch (error) {
      console.error('Error unpublishing vendors:', error);
      alert('Error unpublishing vendors');
    }
  };

  // Sync attachments for a single vendor
  const handleSyncAttachments = async (vendorId: string, vendorName: string) => {
    const folderLink = prompt(
      `Sync attachments for "${vendorName}"\n\n` +
      `Enter Google Drive folder link:\n` +
      `• Master folder (with subfolders named after vendors)\n` +
      `• Direct vendor folder link\n\n` +
      `Folder link:`
    );

    if (!folderLink || !folderLink.trim()) {
      return;
    }

    setSyncingVendorId(vendorId);
    toast.loading(`Syncing attachments for "${vendorName}"...`, { id: `sync-${vendorId}` });

    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}/sync-attachments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderLink: folderLink.trim() }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to sync attachments');
      }

      toast.success(
        `Successfully synced "${vendorName}"!\n` +
        `Profile: ${result.profilePhotoUpdated ? 'Updated' : 'No change'} | ` +
        `Gallery: ${result.uploadedGalleryCount} images`,
        { id: `sync-${vendorId}`, duration: 5000 }
      );
      
      // Refresh vendors list
      fetchVendors();
    } catch (error) {
      toast.error(
        `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { id: `sync-${vendorId}`, duration: 5000 }
      );
    } finally {
      setSyncingVendorId(null);
    }
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ['Name', 'Email', 'Phone', 'City', 'Category', 'Status', 'Plan', 'Price', 'Published'];
    const rows = filteredVendors.map(v => [
      v.name,
      v.email || '',
      v.phone || '',
      v.city,
      v.category,
      v.status,
      v.plan,
      v.planPrice.toString(),
      v.published ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendors-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#11190C]">Vendors Management</h1>
            <p className="text-gray-600 mt-1">Manage and monitor all registered vendors</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FiDownload className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => setShowImportDialog(true)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FiUpload className="w-4 h-4" />
              Import CSV
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Attach Images button clicked, setting dialog to true');
                setShowAttachImagesDialog(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 font-semibold cursor-pointer"
            >
              <FiImage className="w-4 h-4" />
              Attach Images
            </button>
            <Link
              href="/admin/vendors/new"
              className="px-4 py-2 bg-[#D9FF0A] text-[#11190C] rounded-xl hover:bg-[#BEE600] transition-colors flex items-center gap-2 font-semibold"
            >
              <FiPlus className="w-4 h-4" />
              Add Vendor
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Vendors</span>
              <FiTrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-[#11190C]">{stats.total}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Active</span>
              <FiCheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pending</span>
              <FiClock className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Inactive</span>
              <FiXCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.inactive}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Published</span>
              <FiEye className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.published}</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
        <div className="flex items-center gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors by name, email, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 ${showFilters ? 'bg-[#D9FF0A] border-[#D9FF0A]' : 'bg-white'}`}
          >
            <FiFilter className="w-5 h-5" />
            Filters
          </button>

          {/* Refresh */}
          <button
            onClick={fetchVendors}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <FiRefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D9FF0A]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D9FF0A]"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D9FF0A]"
              >
                <option value="all">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D9FF0A]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="price">Highest Price</option>
                <option value="plan">Highest Plan</option>
              </select>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedVendors.size > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedVendors.size} vendor(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkPublish}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FiCheckCircle className="w-4 h-4" />
                Publish to Website
              </button>
              <button
                onClick={handleBulkUnpublish}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
              >
                <FiXCircle className="w-4 h-4" />
                Unpublish
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9FF0A]"></div>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="text-center py-12">
            <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No vendors found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedVendors.size === filteredVendors.length && filteredVendors.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Vendor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Gallery</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Plan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedVendors.has(vendor.id)}
                        onChange={() => toggleVendorSelection(vendor.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                          {vendor.profilePhotoUrl ? (
                            <img
                              src={vendor.profilePhotoUrl}
                              alt={vendor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                              {vendor.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-[#11190C]">{vendor.name}</div>
                          {vendor.subcategory && (
                            <div className="text-xs text-gray-500 mt-1">
                              {vendor.subcategory}
                            </div>
                          )}
                          {vendor.published ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                              <FiCheckCircle className="w-3 h-3" />
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <FiXCircle className="w-3 h-3" />
                              Draft
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        {vendor.email && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiMail className="w-3 h-3" />
                            {vendor.email}
                          </div>
                        )}
                        {vendor.phone && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiPhone className="w-3 h-3" />
                            {vendor.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FiMapPin className="w-4 h-4 text-gray-400" />
                        {vendor.city}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiTag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 capitalize">
                          {vendor.category.replace('-', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {vendor.galleryPhotoUrls && vendor.galleryPhotoUrls.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <div className="flex -space-x-2">
                            {vendor.galleryPhotoUrls.slice(0, 3).map((url, index) => (
                              <div
                                key={index}
                                className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200"
                                title={`Gallery photo ${index + 1}`}
                              >
                                <img
                                  src={url}
                                  alt={`Gallery ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                          {vendor.galleryPhotoUrls.length > 3 && (
                            <span className="text-xs text-gray-500 ml-1">
                              +{vendor.galleryPhotoUrls.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No gallery</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-[#11190C] capitalize">
                          {vendor.plan.replace('-', ' ')}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                          <FiDollarSign className="w-3 h-3" />
                          {vendor.planPrice} MAD/mo
                        </div>
                        {vendor.startingPrice && (
                          <div className="text-xs text-gray-500 mt-1">
                            From {vendor.startingPrice} MAD
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        vendor.status === 'active' 
                          ? 'bg-green-100 text-green-700'
                          : vendor.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiCalendar className="w-3 h-3" />
                        {new Date(vendor.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/vendors/${vendor.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <FiEye className="w-4 h-4 text-gray-600" />
                        </Link>
                        <Link
                          href={`/admin/vendors/${vendor.id}/edit`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4 text-blue-600" />
                        </Link>
                        <button
                          onClick={() => handleSyncAttachments(vendor.id, vendor.name)}
                          disabled={syncingVendorId === vendor.id}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Sync Attachments"
                        >
                          <FiRefreshCw className={`w-4 h-4 text-blue-600 ${syncingVendorId === vendor.id ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleDeleteVendor(vendor.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && filteredVendors.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 text-sm text-gray-600">
            Showing {filteredVendors.length} of {vendors.length} vendors
          </div>
        )}
      </div>

      {/* Import Vendors Dialog */}
      <ImportVendorsDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onSuccess={() => {
          setShowImportDialog(false);
          fetchVendors();
        }}
      />

      {/* Attach Images Dialog */}
      <AttachImagesDialog
        isOpen={showAttachImagesDialog}
        onClose={() => setShowAttachImagesDialog(false)}
        onSuccess={() => {
          setShowAttachImagesDialog(false);
          fetchVendors();
        }}
      />
    </div>
  );
}
