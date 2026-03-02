'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { X, Upload, Camera } from 'lucide-react';

interface AddVendorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface EditVendorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vendor: {
    id: string;
    name: string;
    city: string;
    category: string;
    email?: string;
    phone?: string;
    plan: string;
    planPrice: number;
    profilePhotoUrl?: string;
    galleryPhotoUrls?: string[];
  };
}

export default function AddVendorDialog({ isOpen, onClose, onSuccess }: AddVendorDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    category: '',
    city: '',
    email: '',
    phone: '',
    plan: '',
    description: ''
  });
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [galleryPhotoPreviews, setGalleryPhotoPreviews] = useState<string[]>([]);

  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const galleryPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-select plan based on category
    if (name === 'category') {
      const categoryToPlan: Record<string, string> = {
        'venues': 'venue-planning',
        'catering': 'venue-planning',
        'photography': 'media-entertainment',
        'music': 'media-entertainment',
        'beauty': 'style-beauty',
        'decor': 'style-beauty',
        'planning': 'venue-planning',
        'dresses': 'style-beauty',
        'eventPlanner': 'venue-planning'
      };
      if (categoryToPlan[value]) {
        setFormData(prev => ({ ...prev, plan: categoryToPlan[value] }));
      }
    }
  };

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryPhotosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const previews: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target?.result as string);
          if (previews.length === files.length) {
            setGalleryPhotoPreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryPhoto = (index: number) => {
    setGalleryPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.businessName || !formData.category || !formData.city || !formData.plan || !formData.phone) {
      toast.error('Please fill in all required fields: business name, category, city, plan, and phone');
      setIsSubmitting(false);
      return;
    }

    console.log("Submitting vendor:", formData);

    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append('firstName', formData.firstName || 'Unknown');
      formDataToSend.append('lastName', formData.lastName || 'Unknown');
      formDataToSend.append('businessName', formData.businessName);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('plan', formData.plan);
      formDataToSend.append('description', formData.description);

      // Add profile photo if selected
      if (profilePhotoInputRef.current?.files?.[0]) {
        formDataToSend.append('profilePhoto', profilePhotoInputRef.current.files[0]);
      }

      // Add gallery photos if selected
      if (galleryPhotoInputRef.current?.files) {
        Array.from(galleryPhotoInputRef.current.files).forEach((file, index) => {
          formDataToSend.append('galleryPhotos', file);
        });
      }

      const response = await fetch('/api/admin/vendors', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create vendor');
      }

      // Success
      toast.success("Vendor added");
      setFormData({
        firstName: '',
        lastName: '',
        businessName: '',
        category: '',
        city: '',
        email: '',
        phone: '',
        plan: '',
        description: ''
      });
      setProfilePhotoPreview(null);
      setGalleryPhotoPreviews([]);
      // Clear file inputs
      if (profilePhotoInputRef.current) profilePhotoInputRef.current.value = '';
      if (galleryPhotoInputRef.current) galleryPhotoInputRef.current.value = '';
      onSuccess();
      onClose();

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold text-wv.text mb-4">Add New Vendor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="w-full px-3 py-2 bg-white border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime focus:border-wv.lime"
            />
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="w-full px-3 py-2 bg-white border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime focus:border-wv.lime"
            />
          </div>
          <input
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            placeholder="Business Name"
            className="w-full px-3 py-2 bg-white border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime focus:border-wv.lime"
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime focus:border-wv.lime"
            required
          >
            <option value="">Select category</option>
            <option value="venues">Venues</option>
            <option value="catering">Catering</option>
            <option value="photography">Photography</option>
            <option value="music">Music</option>
            <option value="beauty">Beauty</option>
            <option value="decor">Decor</option>
            <option value="planning">Planning</option>
            <option value="dresses">Dresses</option>
            <option value="eventPlanner">Event Planner</option>
          </select>
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime focus:border-wv.lime"
            required
          >
            <option value="">Select city</option>
            <option value="marrakech">Marrakech</option>
            <option value="casablanca">Casablanca</option>
            <option value="rabat">Rabat</option>
            <option value="tangier">Tangier</option>
            <option value="agadir">Agadir</option>
            <option value="fes">Fes</option>
            <option value="meknes">Meknes</option>
            <option value="elJadida">El Jadida</option>
            <option value="kenitra">Kenitra</option>
          </select>
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            type="email"
            placeholder="Email (optional)"
            className="w-full px-3 py-2 bg-white border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime focus:border-wv.lime"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            type="tel"
            placeholder="Phone / WhatsApp"
            className="w-full px-3 py-2 bg-white border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime focus:border-wv.lime"
            required
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-wv.text">Plan</label>
            <div className="grid grid-cols-1 gap-2">
              <label className={`p-3 border rounded-lg cursor-pointer transition-all ${
                formData.plan === 'style-beauty' ? 'border-wv.lime bg-lime-50' : 'border-wv.line hover:border-wv.lime/50'
              }`}>
                <input
                  type="radio"
                  name="plan"
                  value="style-beauty"
                  checked={formData.plan === 'style-beauty'}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="font-medium">Style & Beauty</div>
                  <div className="text-sm text-wv.sub">MAD 200/month</div>
                </div>
              </label>
              <label className={`p-3 border rounded-lg cursor-pointer transition-all ${
                formData.plan === 'media-entertainment' ? 'border-wv.lime bg-lime-50' : 'border-wv.line hover:border-wv.lime/50'
              }`}>
                <input
                  type="radio"
                  name="plan"
                  value="media-entertainment"
                  checked={formData.plan === 'media-entertainment'}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="font-medium">Media & Entertainment</div>
                  <div className="text-sm text-wv.sub">MAD 250/month</div>
                </div>
              </label>
              <label className={`p-3 border rounded-lg cursor-pointer transition-all ${
                formData.plan === 'venue-planning' ? 'border-wv.lime bg-lime-50' : 'border-wv.line hover:border-wv.lime/50'
              }`}>
                <input
                  type="radio"
                  name="plan"
                  value="venue-planning"
                  checked={formData.plan === 'venue-planning'}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="font-medium">Venue & Planning</div>
                  <div className="text-sm text-wv.sub">MAD 350/month</div>
                </div>
              </label>
            </div>
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description (optional)"
            rows={3}
            className="w-full px-3 py-2 bg-white border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime focus:border-wv.lime resize-none"
          />

          {/* Profile Photo Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-wv.text">Profile Photo</label>
            <div className="space-y-3">
              <input
                ref={profilePhotoInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => profilePhotoInputRef.current?.click()}
                className="flex items-center gap-3 w-full p-4 border-2 border-dashed border-wv.line rounded-lg hover:border-wv.lime transition-colors"
              >
                <Camera className="w-6 h-6 text-wv.sub" />
                <div className="text-left">
                  <div className="font-medium text-wv.text">Upload Profile Photo</div>
                  <div className="text-sm text-wv.sub">JPG, PNG up to 5MB</div>
                </div>
              </button>
              {profilePhotoPreview && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-wv.line">
                  <Image
                    src={profilePhotoPreview}
                    alt="Profile photo preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Gallery Photos Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-wv.text">Gallery Photos</label>
            <div className="space-y-3">
              <input
                ref={galleryPhotoInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryPhotosChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => galleryPhotoInputRef.current?.click()}
                className="flex items-center gap-3 w-full p-4 border-2 border-dashed border-wv.line rounded-lg hover:border-wv.lime transition-colors"
              >
                <Upload className="w-6 h-6 text-wv.sub" />
                <div className="text-left">
                  <div className="font-medium text-wv.text">Upload Gallery Photos</div>
                  <div className="text-sm text-wv.sub">Up to 10 photos, JPG/PNG up to 5MB each</div>
                </div>
              </button>
              {galleryPhotoPreviews.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {galleryPhotoPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border border-wv.line">
                        <Image
                          src={preview}
                          alt={`Gallery photo ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGalleryPhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-wv.line text-wv.text rounded-lg hover:bg-wv.line font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-wv.lime text-wv.black rounded-lg hover:bg-wv.limeDark font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EditVendorDialog({ isOpen, onClose, onSuccess, vendor }: EditVendorDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: vendor.name,
    category: vendor.category,
    city: vendor.city,
    email: vendor.email || '',
    phone: vendor.phone || '',
    plan: vendor.plan,
    description: ''
  });
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    vendor.profilePhotoUrl || null
  );
  const [galleryPhotoPreviews, setGalleryPhotoPreviews] = useState<string[]>(
    vendor.galleryPhotoUrls || []
  );

  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const galleryPhotoInputRef = useRef<HTMLInputElement>(null);

  // Reset form when dialog opens with vendor data
  useEffect(() => {
    if (isOpen) {
      setFormData({
        businessName: vendor.name,
        category: vendor.category,
        city: vendor.city,
        email: vendor.email || '',
        phone: vendor.phone || '',
        plan: vendor.plan,
        description: ''
      });
      setProfilePhotoPreview(vendor.profilePhotoUrl || null);
      setGalleryPhotoPreviews(vendor.galleryPhotoUrls || []);
      setSubmitError(null);
    }
  }, [isOpen, vendor]);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-select plan based on category
    if (name === 'category') {
      const categoryToPlan: Record<string, string> = {
        'venues': 'venue-planning',
        'catering': 'venue-planning',
        'photography': 'media-entertainment',
        'music': 'media-entertainment',
        'beauty': 'style-beauty',
        'decor': 'style-beauty',
        'planning': 'venue-planning',
        'dresses': 'style-beauty',
        'eventPlanner': 'venue-planning'
      };
      if (categoryToPlan[value]) {
        setFormData(prev => ({ ...prev, plan: categoryToPlan[value] }));
      }
    }
  };

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryPhotosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const previews: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target?.result as string);
          if (previews.length === files.length) {
            setGalleryPhotoPreviews(prev => [...prev, ...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryPhoto = (index: number) => {
    setGalleryPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Validate required fields
    if (!formData.businessName || !formData.category || !formData.city || !formData.plan) {
      setSubmitError('Please fill in all required fields: business name, category, city, and plan');
      setIsSubmitting(false);
      return;
    }

    console.log("Updating vendor:", formData);

    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();

      // Add vendor ID for update
      formDataToSend.append('id', vendor.id);

      // Add text fields
      formDataToSend.append('businessName', formData.businessName);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('plan', formData.plan);
      formDataToSend.append('description', formData.description);

      // Add profile photo if changed
      if (profilePhotoInputRef.current?.files?.[0]) {
        formDataToSend.append('profilePhoto', profilePhotoInputRef.current.files[0]);
      }

      // Add gallery photos if changed
      if (galleryPhotoInputRef.current?.files) {
        Array.from(galleryPhotoInputRef.current.files).forEach((file, index) => {
          formDataToSend.append('galleryPhotos', file);
        });
      }

      const response = await fetch('/api/admin/vendors', {
        method: 'PUT',
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update vendor');
      }

      // Success
      toast.success("Vendor updated");
      setProfilePhotoPreview(null);
      setGalleryPhotoPreviews([]);
      // Clear file inputs
      if (profilePhotoInputRef.current) profilePhotoInputRef.current.value = '';
      if (galleryPhotoInputRef.current) galleryPhotoInputRef.current.value = '';
      onSuccess();
      onClose();

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSubmitError(null);
      setProfilePhotoPreview(null);
      setGalleryPhotoPreviews([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

      {/* Container */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold text-wv.text mb-4">Edit Vendor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            placeholder="Business Name"
            className="w-full px-3 py-2 bg-white border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime focus:border-wv.lime"
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime focus:border-wv.lime"
            required
          >
            <option value="">Select category</option>
            <option value="venues">Venues</option>
            <option value="catering">Catering</option>
            <option value="photography">Photography</option>
            <option value="music">Music</option>
            <option value="beauty">Beauty</option>
            <option value="decor">Decor</option>
            <option value="planning">Planning</option>
            <option value="dresses">Dresses</option>
            <option value="eventPlanner">Event Planner</option>
          </select>
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime focus:border-wv.lime"
            required
          >
            <option value="">Select city</option>
            <option value="marrakech">Marrakech</option>
            <option value="casablanca">Casablanca</option>
            <option value="rabat">Rabat</option>
            <option value="tangier">Tangier</option>
            <option value="agadir">Agadir</option>
            <option value="fes">Fes</option>
            <option value="meknes">Meknes</option>
            <option value="elJadida">El Jadida</option>
            <option value="kenitra">Kenitra</option>
          </select>
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            type="email"
            placeholder="Email (optional)"
            className="w-full px-3 py-2 bg-white border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime focus:border-wv.lime"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            type="tel"
            placeholder="Phone / WhatsApp"
            className="w-full px-3 py-2 bg-white border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime focus:border-wv.lime"
            required
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-wv.text">Plan</label>
            <div className="grid grid-cols-1 gap-2">
              <label className={`p-3 border rounded-lg cursor-pointer transition-all ${
                formData.plan === 'style-beauty' ? 'border-wv.lime bg-lime-50' : 'border-wv.line hover:border-wv.lime/50'
              }`}>
                <input
                  type="radio"
                  name="plan"
                  value="style-beauty"
                  checked={formData.plan === 'style-beauty'}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="font-medium">Style & Beauty</div>
                  <div className="text-sm text-wv.sub">MAD 200/month</div>
                </div>
              </label>
              <label className={`p-3 border rounded-lg cursor-pointer transition-all ${
                formData.plan === 'media-entertainment' ? 'border-wv.lime bg-lime-50' : 'border-wv.line hover:border-wv.lime/50'
              }`}>
                <input
                  type="radio"
                  name="plan"
                  value="media-entertainment"
                  checked={formData.plan === 'media-entertainment'}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="font-medium">Media & Entertainment</div>
                  <div className="text-sm text-wv.sub">MAD 250/month</div>
                </div>
              </label>
              <label className={`p-3 border rounded-lg cursor-pointer transition-all ${
                formData.plan === 'venue-planning' ? 'border-wv.lime bg-lime-50' : 'border-wv.line hover:border-wv.lime/50'
              }`}>
                <input
                  type="radio"
                  name="plan"
                  value="venue-planning"
                  checked={formData.plan === 'venue-planning'}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="font-medium">Venue & Planning</div>
                  <div className="text-sm text-wv.sub">MAD 350/month</div>
                </div>
              </label>
            </div>
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description (optional)"
            rows={3}
            className="w-full px-3 py-2 bg-white border border-wv.line rounded-lg focus:outline-none focus:ring-2 focus:ring-wv.lime focus:border-wv.lime resize-none"
          />

          {/* Profile Photo Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-wv.text">Profile Photo</label>
            <div className="space-y-3">
              <input
                ref={profilePhotoInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => profilePhotoInputRef.current?.click()}
                className="flex items-center gap-3 w-full p-4 border-2 border-dashed border-wv.line rounded-lg hover:border-wv.lime transition-colors"
              >
                <Camera className="w-6 h-6 text-wv.sub" />
                <div className="text-left">
                  <div className="font-medium text-wv.text">Change Profile Photo</div>
                  <div className="text-sm text-wv.sub">JPG, PNG up to 5MB</div>
                </div>
              </button>
              {profilePhotoPreview && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-wv.line">
                  <Image
                    src={profilePhotoPreview}
                    alt="Profile photo preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Gallery Photos Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-wv.text">Gallery Photos</label>
            <div className="space-y-3">
              <input
                ref={galleryPhotoInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryPhotosChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => galleryPhotoInputRef.current?.click()}
                className="flex items-center gap-3 w-full p-4 border-2 border-dashed border-wv.line rounded-lg hover:border-wv.lime transition-colors"
              >
                <Upload className="w-6 h-6 text-wv.sub" />
                <div className="text-left">
                  <div className="font-medium text-wv.text">Add Gallery Photos</div>
                  <div className="text-sm text-wv.sub">Up to 10 photos, JPG/PNG up to 5MB each</div>
                </div>
              </button>
              {galleryPhotoPreviews.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {galleryPhotoPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border border-wv.line">
                        <Image
                          src={preview}
                          alt={`Gallery photo ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGalleryPhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-wv.line text-wv.text rounded-lg hover:bg-wv.line font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-wv.lime text-wv.black rounded-lg hover:bg-wv.limeDark font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export function ImportVendorsDialog({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [folderLink, setFolderLink] = useState('');
  const [googleDriveStatus, setGoogleDriveStatus] = useState<{
    configured: boolean;
    working?: boolean;
    message?: string;
  } | null>(null);
  const [importResults, setImportResults] = useState<{
    total: number;
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [masterFolderLink, setMasterFolderLink] = useState('');
  const [fastImport, setFastImport] = useState(true); // Default ON for 500+ vendors - skip images to avoid timeout
  const [isAttachingImages, setIsAttachingImages] = useState(false);
  const [attachResults, setAttachResults] = useState<{
    total: number;
    matched: number;
    processed: number;
    warnings: string[];
    results: Array<{ vendor: string; folder: string; status: string }>;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check Google Drive API status when dialog opens
  useEffect(() => {
    if (isOpen) {
      checkGoogleDriveStatus();
    }
  }, [isOpen]);

  const checkGoogleDriveStatus = async () => {
    try {
      const response = await fetch('/api/admin/check-google-drive');
      const result = await response.json();
      setGoogleDriveStatus(result);
    } catch (error) {
      setGoogleDriveStatus({
        configured: false,
        message: 'Failed to check Google Drive API status'
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast.error("Please upload a CSV or Excel file (.csv, .xlsx, .xls)");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setImportResults(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fastImport", String(fastImport));
      
      // Add folder link if provided (only used when fastImport=false)
      if (folderLink.trim() && !fastImport) {
        formData.append("folderLink", folderLink.trim());
      }

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch("/api/admin/vendors/import", {
        method: "POST",
        body: formData,
        credentials: 'include', // Important: include cookies for authentication
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Handle authentication errors
      if (response.status === 401) {
        toast.error("Session expired. Please sign in again.");
        // Redirect to signin after a short delay
        setTimeout(() => {
          window.location.href = '/en/auth/signin';
        }, 2000);
        return;
      }

      if (response.status === 403) {
        toast.error("You don't have permission to import vendors.");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Import failed");
      }

      // Ensure result has all required fields
      const importResult = {
        total: result.total || 0,
        successful: result.successful || 0,
        failed: result.failed || 0,
        skipped: result.skipped || 0,
        errors: result.errors || [],
        warnings: result.warnings || [],
        hasMoreErrors: result.hasMoreErrors || false,
        hasMoreWarnings: result.hasMoreWarnings || false
      };

      console.log('Setting import results:', importResult, 'Step 2 should show:', Number(importResult.successful) > 0);
      setImportResults(importResult);
      toast.success(`Imported ${importResult.successful} vendors successfully`);

      if (result.failed > 0) {
        toast.warning(`${result.failed} vendors failed to import. Check errors below.`);
      }

      onSuccess();

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Import failed");
      setImportResults({
        total: 0,
        successful: 0,
        failed: 1,
        errors: [error instanceof Error ? error.message : "Unknown error"]
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create a sample CSV template matching the user's format
    const headers = [
      "Vendor", 
      "Category", 
      "City", 
      "Phone", 
      "Email", 
      "Description",
      "Google Maps",
      "IG"
    ];
    const sampleData = [
      [
        "Traiteur El Amane", 
        "Caterer", 
        "Fes", 
        "212661491997", 
        "contact@traiteur.ma", 
        "Traditional Moroccan catering services",
        "14 lot atef mag",
        "https://www.instagram.com/traiteur_el_amane"
      ],
      [
        "Dar Makhtara", 
        "Venue", 
        "Meknes", 
        "06 26869509", 
        "info@darmakhtara.ma", 
        "Beautiful wedding venue in Meknes",
        "43 Boulevard E",
        "instagram.com/dar_makhtara"
      ],
      [
        "Studio Photo Pro", 
        "Photographer", 
        "Rabat", 
        "06 78 43 07 61", 
        "", 
        "Professional wedding photography",
        "https://maps.app.goo.gl/EXAMPLE",
        "instagram.com/studio_photo_pro"
      ]
    ];

    const csvContent = [headers, ...sampleData]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vendor_import_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-wv.text">Import Vendors</h2>
            <p className="text-sm text-wv.sub mt-1">
              Upload a CSV file to bulk import vendors
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-2 hover:bg-wv.line rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Import Instructions</h3>
            <ul className="text-sm text-blue-800 space-y-1.5">
              <li>• Download the template CSV file below or use your existing spreadsheet</li>
              <li>• Use these <strong>exact column names</strong> (in this order): Vendor, Category, City, Phone, Email, Description, Google Maps, IG</li>
              <li>• <strong>Required columns:</strong> Vendor, Category, City, Phone</li>
              <li>• <strong>Optional columns:</strong> Email, Description, Google Maps, IG (can be left empty)</li>
              <li>• <strong>Phone format:</strong> Accepts various formats (e.g., "212661491997", "06 26869509", "06 78 43 07 61", "+212600000000")</li>
              <li>• <strong>Google Maps:</strong> Can be an address (e.g., "14 lot atef mag") or a URL (e.g., "https://maps.app.goo.gl/...")</li>
              <li>• <strong>IG:</strong> Instagram link or handle (e.g., "https://www.instagram.com/username" or "instagram.com/username")</li>
              <li>• <strong>Categories:</strong> Venue, Caterer, Photographer, Event Planner, Decor, Dresses, Negafa, Beauty, Music, Spa, Artist</li>
              <li>• <strong>Cities:</strong> Fes, Meknes, Casablanca, Marrakech, Rabat, Tangier, Agadir, El Jadida, Kenitra, Bouskoura</li>
              <li>• <strong>500+ vendors?</strong> Enable &quot;Fast import&quot; below to avoid timeout. Attach images in Step 2 after import.</li>
              <li>• <strong>Include column:</strong> Add &quot;Include&quot; with &quot;yes&quot; for rows to import (e.g. green-highlighted rows)</li>
            </ul>
          </div>

          {/* Google Drive API Status */}
          {googleDriveStatus && (
            <div className={`border rounded-lg p-3 ${
              googleDriveStatus.configured && googleDriveStatus.working
                ? 'bg-green-50 border-green-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  googleDriveStatus.configured && googleDriveStatus.working
                    ? 'bg-green-500'
                    : 'bg-yellow-500'
                }`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    googleDriveStatus.configured && googleDriveStatus.working
                      ? 'text-green-900'
                      : 'text-yellow-900'
                  }`}>
                    Google Drive API: {googleDriveStatus.configured && googleDriveStatus.working ? '✅ Configured & Working' : '⚠️ Not Configured'}
                  </p>
                  <p className={`text-xs mt-1 ${
                    googleDriveStatus.configured && googleDriveStatus.working
                      ? 'text-green-700'
                      : 'text-yellow-700'
                  }`}>
                    {googleDriveStatus.message || 'Checking status...'}
                  </p>
                  {(!googleDriveStatus.configured || !googleDriveStatus.working) && (
                    <p className="text-xs mt-1 text-yellow-700">
                      To enable automatic image detection from folders, add <code className="bg-yellow-100 px-1 rounded">GOOGLE_DRIVE_API_KEY</code> to your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Fast Import - for 500+ vendors */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <input
              id="fastImport"
              type="checkbox"
              checked={fastImport}
              onChange={(e) => setFastImport(e.target.checked)}
              className="mt-1 rounded border-gray-300"
            />
            <div>
              <label htmlFor="fastImport" className="block text-sm font-medium text-amber-900">
                Fast import (recommended for 500+ vendors)
              </label>
              <p className="text-xs text-amber-800 mt-0.5">
                Skips image processing to import all vendors quickly without timeout. You can attach images later via Step 2.
              </p>
            </div>
          </div>

          {/* Folder Link Input - only when not fast import */}
          {!fastImport && (
          <div className="space-y-2">
            <label htmlFor="folderLink" className="block text-sm font-medium text-gray-700">
              Google Drive Base Folder Link (Optional)
            </label>
            <input
              id="folderLink"
              type="text"
              value={folderLink}
              onChange={(e) => setFolderLink(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/YOUR_FOLDER_ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isUploading}
            />
            <p className="text-xs text-gray-500">
              {googleDriveStatus?.configured && googleDriveStatus?.working
                ? "Paste your main Google Drive folder link. Each vendor should have a subfolder, or add a folder_link column in your CSV. The first image in each folder will be automatically selected as the profile photo."
                : "Paste your main Google Drive folder link. Each vendor should have a subfolder, or add a folder_link column in your CSV. Note: Automatic image detection requires Google Drive API setup."}
            </p>
          </div>
          )}

          {/* Template Download */}
          <div className="flex justify-center">
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 border border-wv.line text-wv.text rounded-lg hover:bg-wv.line transition-colors"
            >
              <Upload size={16} />
              Download CSV Template
            </button>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-3 p-8 border-2 border-dashed border-wv.line rounded-lg hover:border-wv.lime transition-colors disabled:opacity-50"
            >
              <Upload size={24} className="text-wv.sub" />
              <div className="text-center">
                <div className="font-medium text-wv.text">
                  {isUploading ? "Uploading..." : "Click to upload CSV or Excel file"}
                </div>
                <div className="text-sm text-wv.sub mt-1">
                  Supports .csv, .xlsx, .xls files up to 10MB
                </div>
              </div>
            </button>

            {/* Progress Bar */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-wv.lime h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Import Results */}
          {importResults && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-wv.text mb-3">Import Results</h3>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{importResults.successful}</div>
                  <div className="text-sm text-gray-600">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{importResults.failed || 0}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{importResults.skipped || 0}</div>
                  <div className="text-sm text-gray-600">Skipped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{importResults.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
              {importResults.skipped > 0 && (
                <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                  <strong>Note:</strong> {importResults.skipped} vendors were skipped during validation (check errors below for details)
                </div>
              )}

              {importResults.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    Errors ({importResults.errors.length}):
                  </h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-64 overflow-y-auto">
                    <ul className="text-sm text-red-700 space-y-2">
                      {importResults.errors.map((error, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span className="flex-1 break-words">{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    💡 Tip: Fix these errors in your CSV and re-import the failed vendors. You can export the current vendors list to see the correct format.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Attach Images from Master Folder - Always show if import completed with any success */}
          {(() => {
            const shouldShow = importResults && importResults.total > 0 && Number(importResults.successful) > 0;
            console.log('Step 2 visibility check:', { 
              hasResults: !!importResults, 
              total: importResults?.total, 
              successful: importResults?.successful, 
              shouldShow 
            });
            return shouldShow;
          })() && (
            <div className="mt-6 pt-6 border-t-2 border-wv.lime bg-wv.lime/5 rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">📸</span>
                <h3 className="font-semibold text-wv.text text-lg">Step 2: Attach Images from Master Folder</h3>
              </div>
              <p className="text-sm text-wv.sub mb-4">
                You've successfully imported <strong className="text-green-600">{importResults.successful} vendors</strong>. Now paste your master Google Drive folder link to automatically attach images/videos. The system will match vendor names to subfolders.
              </p>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="masterFolderLink" className="block text-sm font-medium text-wv.text mb-2">
                    Master Google Drive Folder Link
                  </label>
                  <input
                    id="masterFolderLink"
                    type="text"
                    value={masterFolderLink}
                    onChange={(e) => setMasterFolderLink(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/YOUR_FOLDER_ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={isAttachingImages}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This folder should contain subfolders named after your vendors (e.g., "Traiteur El Amane", "Dar Makhtara")
                  </p>
                </div>

                <button
                  onClick={async () => {
                    if (!masterFolderLink.trim()) {
                      toast.error('Please enter a folder link');
                      return;
                    }

                    setIsAttachingImages(true);
                    setAttachResults(null);

                    try {
                      const response = await fetch('/api/admin/vendors/attach-images', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ folderLink: masterFolderLink.trim() }),
                      });

                      const result = await response.json();

                      if (!response.ok) {
                        throw new Error(result.message || 'Failed to attach images');
                      }

                      setAttachResults(result);
                      toast.success(`Matched ${result.matched} vendors and processed ${result.processed} successfully`);
                      
                      if (result.warnings.length > 0) {
                        toast.warning(`${result.warnings.length} warnings. Check details below.`);
                      }

                      onSuccess();
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : 'Failed to attach images');
                    } finally {
                      setIsAttachingImages(false);
                    }
                  }}
                  disabled={isAttachingImages || !masterFolderLink.trim()}
                  className="w-full px-4 py-3 bg-wv.lime text-wv.text rounded-lg hover:bg-[#BEE600] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAttachingImages ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-wv.text"></div>
                      Attaching Images...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Attach Images from Folder
                    </>
                  )}
                </button>
              </div>

              {/* Attach Results */}
              {attachResults && (
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-wv.text mb-3">Attachment Results</h4>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{attachResults.matched}</div>
                      <div className="text-sm text-gray-600">Matched</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{attachResults.processed}</div>
                      <div className="text-sm text-gray-600">Processed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">{attachResults.total}</div>
                      <div className="text-sm text-gray-600">Total Vendors</div>
                    </div>
                  </div>

                  {attachResults.warnings.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-yellow-700 mb-2">Warnings:</h5>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                        <ul className="text-sm text-yellow-700 space-y-1">
                          {attachResults.warnings.slice(0, 10).map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                          {attachResults.warnings.length > 10 && (
                            <li className="text-xs text-yellow-600">... and {attachResults.warnings.length - 10} more</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-wv.line">
            <button
              onClick={onClose}
              disabled={isUploading || isAttachingImages}
              className="px-4 py-2 border border-wv.line text-wv.text rounded-lg hover:bg-wv.line font-medium disabled:opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
