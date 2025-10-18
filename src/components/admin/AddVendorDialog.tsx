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
  const [importResults, setImportResults] = useState<{
    total: number;
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch("/api/admin/vendors/import", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Import failed");
      }

      setImportResults(result);
      toast.success(`Imported ${result.successful} vendors successfully`);

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
    // Create a sample CSV template
    const headers = ["business_name", "category", "city", "email", "phone", "description"];
    const sampleData = [
      ["Beautiful Wedding Venue", "venues", "marrakech", "contact@venue.com", "+212600000000", "Stunning garden venue for weddings"],
      ["Chef Mohamed Catering", "catering", "casablanca", "info@catering.ma", "+212611111111", "Traditional Moroccan cuisine"],
      ["Studio Photo Pro", "photography", "rabat", "hello@studiophoto.ma", "+212622222222", "Professional wedding photography"]
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
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
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
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Download the template CSV file below</li>
              <li>• Fill in your vendor data using the exact column names</li>
              <li>• Required columns: business_name, category, city, phone</li>
              <li>• Optional columns: email, description</li>
              <li>• Categories: venues, catering, photography, music, beauty, decor, planning, dresses, eventPlanner</li>
              <li>• Cities: marrakech, casablanca, rabat, tangier, agadir, fes, meknes, elJadida, kenitra</li>
            </ul>
          </div>

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
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{importResults.successful}</div>
                  <div className="text-sm text-gray-600">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{importResults.failed}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{importResults.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>

              {importResults.errors.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Errors:</h4>
                  <ul className="text-sm text-red-600 space-y-1 max-h-32 overflow-y-auto">
                    {importResults.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-wv.line">
            <button
              onClick={onClose}
              disabled={isUploading}
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
