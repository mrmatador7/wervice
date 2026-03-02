'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  FiSave, FiX, FiUpload, FiTrash2, FiImage, FiArrowLeft 
} from 'react-icons/fi';
import Link from 'next/link';
import { MOROCCAN_CITIES } from '@/lib/types/vendor';
import { getSubcategoriesForCategory } from '@/lib/subcategories';

interface VendorFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  category: string;
  subcategories: string[]; // Changed from single to array
  description: string;
  startingPrice: string;
  plan: string;
  planPrice: string;
  status: string;
  published: boolean;
  profilePhotoUrl: string;
  galleryPhotoUrls: string[];
}

const CATEGORIES = [
  { value: 'florist', label: 'Florist' },
  { value: 'dresses', label: 'Dresses' },
  { value: 'venues', label: 'Venue' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'photography', label: 'Photo & Film' },
  { value: 'catering', label: 'Caterer' },
  { value: 'decor', label: 'Decor' },
  { value: 'negafa', label: 'Negafa' },
  { value: 'music', label: 'Artist' },
  { value: 'planning', label: 'Event Planner' },
  { value: 'cakes', label: 'Cakes' },
];

const PLANS = [
  { value: 'free', label: 'Free', price: 0 },
  { value: 'basic', label: 'Basic', price: 299 },
  { value: 'premium', label: 'Premium', price: 599 },
  { value: 'elite', label: 'Elite', price: 999 },
];

const STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'inactive', label: 'Inactive' },
];

export default function EditVendorPage() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<VendorFormData>({
    name: '',
    email: '',
    phone: '',
    city: '',
    category: '',
    subcategories: [], // Changed to array
    description: '',
    startingPrice: '',
    plan: 'free',
    planPrice: '0',
    status: 'pending',
    published: false,
    profilePhotoUrl: '',
    galleryPhotoUrls: [],
  });
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [subcategories, setSubcategories] = useState<Array<{ slug: string; name: string }>>([]);

  // Fetch vendor data
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch(`/api/admin/vendors/${vendorId}`);
        const result = await response.json();

        if (result.success && result.vendor) {
          const vendor = result.vendor;
          // Handle subcategories - can be string, array, or null
          let subcategoriesArray: string[] = [];
          if (vendor.subcategory) {
            if (Array.isArray(vendor.subcategory)) {
              subcategoriesArray = vendor.subcategory;
            } else if (typeof vendor.subcategory === 'string') {
              subcategoriesArray = [vendor.subcategory];
            }
          }

          setFormData({
            name: vendor.name || '',
            email: vendor.email || '',
            phone: vendor.phone || '',
            city: vendor.city || '',
            category: vendor.category || '',
            subcategories: subcategoriesArray,
            description: vendor.description || '',
            startingPrice: vendor.startingPrice?.toString() || '',
            plan: vendor.plan || 'free',
            planPrice: vendor.planPrice?.toString() || '0',
            status: vendor.status || 'pending',
            published: vendor.published || false,
            profilePhotoUrl: vendor.profilePhotoUrl || '',
            galleryPhotoUrls: vendor.galleryPhotoUrls || [],
          });

          // Load subcategories for the vendor's category
          if (vendor.category) {
            const subs = getSubcategoriesForCategory(vendor.category);
            setSubcategories(subs);
          }
        } else {
          alert('Vendor not found');
          router.push('/admin/vendors');
        }
      } catch (error) {
        console.error('Error fetching vendor:', error);
        alert('Failed to load vendor data');
        router.push('/admin/vendors');
      } finally {
        setIsLoading(false);
      }
    };

    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId, router]);

  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      const subs = getSubcategoriesForCategory(formData.category);
      setSubcategories(subs);
      // Reset subcategories if they don't exist in new category
      const validSubcategories = formData.subcategories.filter(subcat => 
        subs.find(s => s.slug === subcat)
      );
      if (validSubcategories.length !== formData.subcategories.length) {
        setFormData(prev => ({ ...prev, subcategories: validSubcategories }));
      }
    } else {
      setSubcategories([]);
    }
  }, [formData.category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPlan = PLANS.find(p => p.value === e.target.value);
    setFormData(prev => ({
      ...prev,
      plan: e.target.value,
      planPrice: selectedPlan ? selectedPlan.price.toString() : '0',
    }));
  };

  const handleAddGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        galleryPhotoUrls: [...prev.galleryPhotoUrls, newGalleryUrl.trim()],
      }));
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryPhotoUrls: prev.galleryPhotoUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubcategoryToggle = (subcategorySlug: string) => {
    setFormData(prev => {
      const isSelected = prev.subcategories.includes(subcategorySlug);
      if (isSelected) {
        return {
          ...prev,
          subcategories: prev.subcategories.filter(s => s !== subcategorySlug)
        };
      } else {
        return {
          ...prev,
          subcategories: [...prev.subcategories, subcategorySlug]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          startingPrice: formData.startingPrice ? parseFloat(formData.startingPrice) : null,
          planPrice: parseFloat(formData.planPrice),
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Vendor updated successfully!');
        router.push('/admin/vendors');
      } else {
        alert(result.error || 'Failed to update vendor');
      }
    } catch (error) {
      console.error('Error updating vendor:', error);
      alert('Failed to update vendor');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9FF0A]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] p-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/vendors"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#11190C] mb-4 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Vendors
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#11190C]">Edit Vendor</h1>
            <p className="text-gray-600 mt-1">Update vendor information and settings</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/vendors"
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FiX className="w-4 h-4" />
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-4 py-2 bg-[#D9FF0A] text-[#11190C] rounded-xl hover:bg-[#BEE600] transition-colors flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#11190C]"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-[#11190C] mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
                  placeholder="Enter business name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
                    placeholder="contact@vendor.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
                    placeholder="+212 XXX XXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors resize-none"
                  placeholder="Describe the vendor's services..."
                />
              </div>
            </div>
          </div>

          {/* Location & Category */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-[#11190C] mb-4">Location & Category</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
                  >
                    <option value="">Select city</option>
                    {MOROCCAN_CITIES.map(city => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {subcategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Subcategories (select all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-200">
                    {subcategories.map(sub => (
                      <label
                        key={sub.slug}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-[#D9FF0A] hover:bg-[#D9FF0A]/5 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.subcategories.includes(sub.slug)}
                          onChange={() => handleSubcategoryToggle(sub.slug)}
                          className="w-5 h-5 rounded border-gray-300 text-[#D9FF0A] focus:ring-[#D9FF0A]"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {sub.name}
                        </span>
                      </label>
                    ))}
                  </div>
                  {formData.subcategories.length > 0 && (
                    <div className="mt-3 text-sm text-gray-600">
                      Selected: {formData.subcategories.length} subcategory(ies)
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-[#11190C] mb-4">Gallery</h2>
            
            {/* Profile Photo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo URL
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  name="profilePhotoUrl"
                  value={formData.profilePhotoUrl}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              {formData.profilePhotoUrl && (
                <div className="mt-3">
                  <img
                    src={formData.profilePhotoUrl}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-xl object-cover border-2 border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Gallery Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Photos
              </label>
              <div className="flex gap-3 mb-3">
                <input
                  type="url"
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
                  placeholder="https://example.com/gallery-photo.jpg"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryImage}
                  className="px-4 py-3 bg-[#D9FF0A] text-[#11190C] rounded-xl hover:bg-[#BEE600] transition-colors flex items-center gap-2 font-semibold"
                >
                  <FiImage className="w-4 h-4" />
                  Add
                </button>
              </div>

              {formData.galleryPhotoUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {formData.galleryPhotoUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-32 rounded-xl object-cover border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-[#11190C] mb-4">Pricing</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Price (MAD)
                </label>
                <input
                  type="number"
                  name="startingPrice"
                  value={formData.startingPrice === '0' ? '' : formData.startingPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
                  placeholder="Leave empty for 'Contact for Quote'"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {formData.startingPrice && formData.startingPrice !== '0' 
                    ? `Starting from ${formData.startingPrice} MAD` 
                    : 'Will show "Contact for Quote" to customers'}
                </p>
              </div>
            </div>
          </div>

          {/* Plan */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-[#11190C] mb-4">Subscription Plan</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan *
                </label>
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handlePlanChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
                >
                  {PLANS.map(plan => (
                    <option key={plan.value} value={plan.value}>
                      {plan.label} - {plan.price} MAD/month
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Price (MAD/month)
                </label>
                <input
                  type="number"
                  name="planPrice"
                  value={formData.planPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
                  placeholder="299"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-[#11190C] mb-4">Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D9FF0A] transition-colors"
                >
                  {STATUSES.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-[#D9FF0A] focus:ring-[#D9FF0A]"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                  Published (visible to customers)
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

