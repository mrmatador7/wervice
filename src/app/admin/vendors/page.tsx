'use client';

import { useState, useEffect } from 'react';
import {
  FiSearch, FiPlus, FiUpload, FiDownload, FiEdit2, FiTrash2,
  FiEye, FiFilter, FiRefreshCw, FiCheckCircle, FiXCircle,
  FiClock, FiDollarSign, FiMapPin, FiTag, FiPhone, FiMail,
  FiImage, FiCalendar, FiTrendingUp, FiFolder
} from 'react-icons/fi';
import { FiVideo } from 'react-icons/fi';
import { useRef } from 'react';
import Link from 'next/link';
import { ImportVendorsDialog } from '@/components/admin/AddVendorDialog';
import { WERVICE_CATEGORIES } from '@/lib/categories';
import { MOROCCAN_CITIES } from '@/lib/types/vendor';

const UNIDENTIFIED_VALUE = '__unidentified__';

const ADMIN_CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  ...WERVICE_CATEGORIES.map((c) => ({ value: c.dbCategory, label: c.label })),
  { value: UNIDENTIFIED_VALUE, label: 'Unidentified (no category)' },
];

const ADMIN_CITY_OPTIONS = [
  { value: 'all', label: 'All Cities' },
  ...MOROCCAN_CITIES.filter((c) => c.value !== 'all').map((c) => ({ value: c.label, label: c.label })),
  { value: UNIDENTIFIED_VALUE, label: 'Unidentified (no city)' },
];

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
const ROWS_PER_PAGE = 50;

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVendors, setSelectedVendors] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAttachDialog, setShowAttachDialog] = useState(false);
  const [attachLoading, setAttachLoading] = useState(false);
  const [attachResult, setAttachResult] = useState<{ processed: number; uploaded: number; results: { folder: string; vendor: string; profile: boolean; gallery: number; error?: string }[] } | null>(null);
  const [syncMediaLoading, setSyncMediaLoading] = useState(false);
  const [publishAllLoading, setPublishAllLoading] = useState(false);
  const attachFolderRef = useRef<HTMLInputElement>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState('');
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);
  const [deleteAllError, setDeleteAllError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0,
    published: 0,
  });

  const isVideoUrl = (url: string) => /\.(mp4|mov|webm|avi|m4v)(\?|$)/i.test(url);
  const getPreviewUrl = (url: string) => {
    if (!url) return url;
    return url;
  };

  const totalPages = Math.max(1, Math.ceil(filteredVendors.length / ROWS_PER_PAGE));
  const pageStartIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const pageEndIndex = pageStartIndex + ROWS_PER_PAGE;
  const paginatedVendors = filteredVendors.slice(pageStartIndex, pageEndIndex);
  const isCurrentPageAllSelected =
    paginatedVendors.length > 0 && paginatedVendors.every((v) => selectedVendors.has(v.id));

  // Fetch vendors from API
  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      const response = await fetch('/api/admin/vendors');
      const result = await response.json();

      if (!response.ok) {
        const message = result?.message || `Request failed (${response.status})`;
        setFetchError(message);
        console.error('Failed to fetch vendors:', message);
        return;
      }

      if (result.success && Array.isArray(result.vendors)) {
        setVendors(result.vendors);
        calculateStats(result.vendors);
      } else {
        const message = result?.message || 'Invalid response from server';
        setFetchError(message);
        console.error('Failed to fetch vendors:', message);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network or unexpected error';
      setFetchError(message);
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
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (vendor) =>
          vendor.name?.toLowerCase().includes(q) ||
          vendor.email?.toLowerCase().includes(q) ||
          (vendor.city && vendor.city.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (filterType !== 'all') {
      result = result.filter((vendor) => vendor.status === filterType);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === UNIDENTIFIED_VALUE) {
        result = result.filter((v) => !v.category || String(v.category).trim() === '');
      } else {
        result = result.filter((v) => v.category === selectedCategory);
      }
    }

    // City filter
    if (selectedCity !== 'all') {
      if (selectedCity === UNIDENTIFIED_VALUE) {
        result = result.filter((v) => !v.city || String(v.city).trim() === '');
      } else {
        result = result.filter((v) => v.city === selectedCity);
      }
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
    setCurrentPage(1);
  }, [vendors, searchQuery, filterType, selectedCategory, selectedCity, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Initial load
  useEffect(() => {
    fetchVendors();
  }, []);

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
    const newSelected = new Set(selectedVendors);
    if (isCurrentPageAllSelected) {
      paginatedVendors.forEach((v) => newSelected.delete(v.id));
    } else {
      paginatedVendors.forEach((v) => newSelected.add(v.id));
    }
    setSelectedVendors(newSelected);
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

  // Delete all vendors (website + database)
  const handleDeleteAllVendors = async () => {
    if (deleteAllConfirm !== 'DELETE') return;
    setDeleteAllError(null);
    setDeleteAllLoading(true);
    try {
      const res = await fetch('/api/admin/vendors/delete-all', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setDeleteAllError(data?.message || 'Delete failed');
        return;
      }
      setShowDeleteAllModal(false);
      setDeleteAllConfirm('');
      fetchVendors();
    } catch (e) {
      setDeleteAllError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setDeleteAllLoading(false);
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

  const handleAttachFromFolder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const path = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
      if (path.includes('/')) formData.append(path, file);
    }
    setAttachLoading(true);
    setAttachResult(null);
    setShowAttachDialog(true);
    try {
      const res = await fetch('/api/admin/vendors/attach-from-folder', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setAttachResult({ processed: data.processed, uploaded: data.uploaded, results: data.results ?? [] });
        fetchVendors();
      } else {
        setAttachResult({ processed: 0, uploaded: 0, results: [{ folder: '-', vendor: '-', profile: false, gallery: 0, error: data.message }] });
      }
    } catch (err) {
      setAttachResult({ processed: 0, uploaded: 0, results: [{ folder: '-', vendor: '-', profile: false, gallery: 0, error: err instanceof Error ? err.message : 'Request failed' }] });
    } finally {
      setAttachLoading(false);
      e.target.value = '';
    }
  };

  const handleSyncR2Media = async () => {
    if (!confirm('Sync vendor images/videos from media_files (R2) now?')) return;
    setSyncMediaLoading(true);
    try {
      const res = await fetch('/api/admin/vendors/sync-media-files', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data?.message || 'Failed to sync R2 media');
        return;
      }
      fetchVendors();
      alert(
        `R2 sync complete.\nProcessed: ${data.processed}\nUpdated: ${data.updated}\nMatched: ${data.matched}\nSkipped: ${data.skipped}`
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to sync R2 media');
    } finally {
      setSyncMediaLoading(false);
    }
  };

  const handlePublishAll = async () => {
    if (!confirm('Publish ALL vendors to website now?')) return;
    setPublishAllLoading(true);
    try {
      if (!vendors.length) {
        alert('No vendors available to publish.');
        return;
      }

      let successCount = 0;
      let failCount = 0;
      const batchSize = 40;
      const ids = vendors.map((v) => v.id).filter(Boolean);

      for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map((id) =>
            fetch(`/api/admin/vendors/${id}/publish`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ published: true }),
            })
          )
        );

        for (const res of batchResults) {
          if (res.ok) successCount++;
          else failCount++;
        }
      }

      await fetchVendors();
      if (failCount > 0) {
        alert(`Publish finished. Success: ${successCount}, Failed: ${failCount}`);
      } else {
        alert(`Published ${successCount} vendors successfully.`);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to publish all vendors');
    } finally {
      setPublishAllLoading(false);
    }
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
            <input
              ref={(el) => {
                attachFolderRef.current = el;
                if (el) el.setAttribute('webkitdirectory', '');
              }}
              type="file"
              multiple
              className="hidden"
              onChange={handleAttachFromFolder}
            />
            <button
              onClick={() => attachFolderRef.current?.click()}
              disabled={attachLoading}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              <FiFolder className="w-4 h-4" />
              {attachLoading ? 'Attaching…' : 'Attach images'}
            </button>
            <button
              onClick={handleSyncR2Media}
              disabled={syncMediaLoading}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              <FiRefreshCw className={`w-4 h-4 ${syncMediaLoading ? 'animate-spin' : ''}`} />
              {syncMediaLoading ? 'Syncing R2…' : 'Sync R2 Media'}
            </button>
            <button
              onClick={handlePublishAll}
              disabled={publishAllLoading}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              <FiCheckCircle className={`w-4 h-4 ${publishAllLoading ? 'animate-pulse' : ''}`} />
              {publishAllLoading ? 'Publishing…' : 'Publish All'}
            </button>
            <button
              onClick={() => setShowImportDialog(true)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FiUpload className="w-4 h-4" />
              Import CSV
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
                {ADMIN_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
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
                {ADMIN_CITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
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

      {/* Danger zone: Delete all vendors */}
      <div className="mb-6 p-6 bg-white rounded-2xl border border-red-200 border-dashed">
        <h3 className="text-sm font-semibold text-red-700 mb-1">Danger zone</h3>
        <p className="text-sm text-gray-600 mb-3">
          Permanently remove all vendors from the website and database (public.vendors, vendor_leads, vendor_gallery). This cannot be undone.
        </p>
        <button
          type="button"
          onClick={() => { setShowDeleteAllModal(true); setDeleteAllError(null); setDeleteAllConfirm(''); }}
          className="px-4 py-2 text-red-700 border border-red-300 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium"
        >
          Delete all vendors
        </button>
      </div>

      {/* Fetch error banner */}
      {fetchError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-4">
          <p className="text-red-800 text-sm">
            <strong>Could not load vendors:</strong> {fetchError}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFetchError(null)}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <FiXCircle className="w-5 h-5" />
            </button>
            <button
              onClick={fetchVendors}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
            >
              <FiRefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Vendors Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9FF0A]"></div>
          </div>
        ) : fetchError ? (
          <div className="text-center py-12">
            <FiXCircle className="w-12 h-12 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Unable to load vendors</h3>
            <p className="text-gray-500 mb-4">{fetchError}</p>
            <button
              onClick={fetchVendors}
              className="px-4 py-2 bg-[#D9FF0A] text-[#11190C] rounded-xl hover:bg-[#BEE600] transition-colors font-medium"
            >
              Retry
            </button>
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
                      checked={isCurrentPageAllSelected}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Vendor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Plan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedVendors.map((vendor) => (
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
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Profile photo */}
                          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            {vendor.profilePhotoUrl ? (
                              <img
                                src={getPreviewUrl(vendor.profilePhotoUrl)}
                                alt={vendor.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                                {vendor.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          {/* Gallery thumbnails */}
                          {vendor.galleryPhotoUrls && vendor.galleryPhotoUrls.length > 0 && (
                            <div className="flex gap-1">
                              {vendor.galleryPhotoUrls.slice(0, 4).map((url, idx) => (
                                <div
                                  key={idx}
                                  className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200"
                                >
                                  {isVideoUrl(url) ? (
                                    <div className="w-full h-full bg-gray-900 text-white flex items-center justify-center">
                                      <FiVideo className="w-3 h-3" />
                                    </div>
                                  ) : (
                                    <img
                                      src={getPreviewUrl(url)}
                                      alt={`Gallery ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                              ))}
                              {vendor.galleryPhotoUrls.length > 4 && (
                                <div className="w-8 h-8 rounded-md bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0 border border-gray-200">
                                  +{vendor.galleryPhotoUrls.length - 4}
                                </div>
                              )}
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
                          <div className="flex items-center gap-2 mt-1">
                            {vendor.published ? (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                <FiCheckCircle className="w-3 h-3" />
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                <FiXCircle className="w-3 h-3" />
                                Draft
                              </span>
                            )}
                            {vendor.galleryPhotoUrls && vendor.galleryPhotoUrls.length > 0 && (
                              <span className="text-xs text-gray-500">
                                <FiImage className="w-3 h-3 inline mr-0.5" />
                                {vendor.galleryPhotoUrls.length} photos
                              </span>
                            )}
                          </div>
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
          <div className="px-6 py-4 border-t border-gray-100 text-sm text-gray-600 flex items-center justify-between">
            <span>
              Showing {pageStartIndex + 1}–{Math.min(pageEndIndex, filteredVendors.length)} of {filteredVendors.length} vendors
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Prev
              </button>
              <span className="text-xs text-gray-500 min-w-[86px] text-center">
                Page {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete all confirmation modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-red-700 mb-2">Delete all vendors</h3>
            <p className="text-sm text-gray-600 mb-4">
              This will remove every vendor from the website and database. Type <strong>DELETE</strong> below to confirm.
            </p>
            <input
              type="text"
              value={deleteAllConfirm}
              onChange={(e) => setDeleteAllConfirm(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:border-red-500"
            />
            {deleteAllError && (
              <p className="text-sm text-red-600 mb-4">{deleteAllError}</p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => { setShowDeleteAllModal(false); setDeleteAllConfirm(''); setDeleteAllError(null); }}
                className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAllVendors}
                disabled={deleteAllConfirm !== 'DELETE' || deleteAllLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteAllLoading ? 'Deleting…' : 'Delete all'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attach images dialog */}
      {showAttachDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#11190C]">Attach images from folder</h2>
              <p className="text-sm text-gray-500 mt-1">
                Subfolders must match vendor names exactly (e.g. MyFolder/<strong>Vendor Name</strong>/image.jpg). First image = profile, rest = gallery.
              </p>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {attachLoading ? (
                <div className="text-center py-8 text-gray-500">Uploading and attaching images…</div>
              ) : attachResult ? (
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    {attachResult.processed} vendor(s) updated, {attachResult.uploaded} files uploaded.
                  </p>
                  <div className="space-y-1 max-h-48 overflow-y-auto text-sm">
                    {attachResult.results.map((r, i) => (
                      <div key={i} className="flex justify-between gap-2 py-1 border-b border-gray-50 last:border-0">
                        <span className="font-medium truncate">{r.folder}</span>
                        <span className={r.error ? 'text-red-500' : 'text-green-600'}>
                          {r.error ?? (r.profile || r.gallery ? `✓ ${r.vendor}` : r.vendor)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Select a folder to attach images to vendors.</p>
              )}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => { setShowAttachDialog(false); setAttachResult(null); }}
                className="w-full py-2.5 bg-[#11190C] text-white rounded-xl hover:bg-[#1a2610]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Dialog */}
      <ImportVendorsDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onSuccess={() => {
          setShowImportDialog(false);
          fetchVendors(); // Refresh the vendors list after successful import
        }}
      />
    </div>
  );
}
