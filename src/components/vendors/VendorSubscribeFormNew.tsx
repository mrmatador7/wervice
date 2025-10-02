'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

// Authoritative category to price mapping (single source of truth)
const categoryPricing: { [key: string]: { name: string; price: number; icon: string } } = {
  'venues': { name: 'Venues', price: 250, icon: '/categories/venues.png' },
  'catering': { name: 'Catering', price: 250, icon: '/categories/Catering.png' },
  'planning': { name: 'Planning', price: 250, icon: '/categories/event planner.png' },
  'photo-video': { name: 'Photo & Video', price: 200, icon: '/categories/photo.png' },
  'music': { name: 'Music', price: 200, icon: '/categories/music.png' },
  'decor': { name: 'Decor', price: 150, icon: '/categories/decor.png' },
  'beauty': { name: 'Beauty', price: 150, icon: '/categories/beauty.png' },
  'dresses': { name: 'Dresses', price: 150, icon: '/categories/Dresses.png' }
};

const cities = [
  'Casablanca', 'Marrakech', 'Rabat', 'Tanger', 'Agadir', 'Fes', 'Meknes', 'El Jadida', 'Kenitra'
];

// Helper function to get price from category slug
const getPriceFromCategory = (categorySlug: string): number => {
  return categoryPricing[categorySlug]?.price || 0;
};

// Helper function to get category data from slug
const getCategoryData = (categorySlug: string) => {
  return categoryPricing[categorySlug];
};

interface FormData {
  businessName: string;
  category: string;
  city: string;
  whatsapp: string;
  email: string;
  website: string;
  instagram: string;
  startingPrice: string;
  description: string;
  plan: 'monthly';
  consent: boolean;
  honeypot: string;
}

interface FormErrors {
  [key: string]: string;
}

interface VendorSubscribeFormProps {
  defaultCategory?: string;
}

export default function VendorSubscribeForm({
  defaultCategory
}: VendorSubscribeFormProps) {
  const router = useRouter();
  const t = useTranslations('vendor');
  const ts = useTranslations('vendor.subscribe');

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to get current price based on selected category
  const getCurrentPrice = (): number => {
    const categorySlug = Object.keys(categoryPricing).find(
      slug => categoryPricing[slug].name === formData.category
    );
    return categorySlug ? getPriceFromCategory(categorySlug) : 0;
  };

  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    category: defaultCategory ? categoryPricing[defaultCategory]?.name || defaultCategory : '',
    city: '',
    whatsapp: '',
    email: '',
    website: '',
    instagram: '',
    startingPrice: '',
    description: '',
    plan: 'monthly',
    consent: false,
    honeypot: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  // Validate WhatsApp number (E.164 format)
  const validateWhatsApp = (value: string) => {
    const cleanNumber = value.replace(/\s+/g, '');
    const e164Regex = /^\+212[6-7]\d{8}$/;
    return e164Regex.test(cleanNumber);
  };

  // Format WhatsApp number
  const formatWhatsApp = (value: string) => {
    const cleanNumber = value.replace(/\D/g, '');
    if (cleanNumber.startsWith('212')) {
      return `+${cleanNumber}`;
    }
    if (cleanNumber.startsWith('0')) {
      return `+212${cleanNumber.substring(1)}`;
    }
    if (!cleanNumber.startsWith('+')) {
      return `+212${cleanNumber}`;
    }
    return value;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let processedValue = value;

    if (name === 'whatsapp') {
      processedValue = formatWhatsApp(value);
    }

    if (name === 'email') {
      processedValue = value.toLowerCase();
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle blur for validation
  const handleBlur = (field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    // Validate specific field
    switch (field) {
      case 'whatsapp':
        if (!validateWhatsApp(formData.whatsapp)) {
          setErrors(prev => ({
            ...prev,
            whatsapp: 'Please enter a valid Moroccan WhatsApp number (+212 6XX XXX XXX)'
          }));
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setErrors(prev => ({
            ...prev,
            email: 'Please enter a valid email address'
          }));
        }
        break;
      case 'website':
        if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
          setErrors(prev => ({
            ...prev,
            website: 'Please enter a valid URL (https://...)'
          }));
        }
        break;
    }
  };

  // Validate step 1
  const validateStep1 = () => {
    const newErrors: FormErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.city) {
      newErrors.city = 'Please select a city';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required';
    } else if (!validateWhatsApp(formData.whatsapp)) {
      newErrors.whatsapp = 'Please enter a valid Moroccan WhatsApp number (+212 6XX XXX XXX)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate step 2
  const validateStep2 = () => {
    const newErrors: FormErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 300) {
      newErrors.description = 'Description must be 300 characters or less';
    }

    if (images.length === 0) {
      newErrors.images = 'Please upload at least one image';
    }

    if (!formData.consent) {
      newErrors.consent = 'You must agree to the terms and consent to being contacted';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(1);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 3 * 1024 * 1024) { // 3MB
        alert(`${file.name} is too large. Max size is 3MB.`);
        return false;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert(`${file.name} is not a valid image type. Only JPG and PNG are allowed.`);
        return false;
      }
      return true;
    });

    if (validFiles.length + images.length > 7) {
      alert('You can upload a maximum of 7 images.');
      return;
    }

    setImages(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Clear errors
    if (errors.images) {
      setErrors(prev => ({
        ...prev,
        images: ''
      }));
    }
  };

  // Handle remove image
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      submitData.append('businessName', formData.businessName);
      submitData.append('category', formData.category);
      submitData.append('city', formData.city);
      submitData.append('whatsapp', formData.whatsapp);
      submitData.append('email', formData.email);
      submitData.append('website', formData.website);
      submitData.append('instagram', formData.instagram);
      submitData.append('profileStartingPrice', formData.startingPrice);
      submitData.append('profileDescription', formData.description);
      submitData.append('subscriptionCadence', formData.plan);
      submitData.append('subscriptionPriceDhs', getCurrentPrice().toString());
      submitData.append('source', 'vendors_subscribe_page');

      // Add images
      images.forEach((image, index) => {
        submitData.append(`image_${index}`, image);
      });

      // Add honeypot for spam prevention
      submitData.append('honeypot', formData.honeypot);

      const response = await fetch('/api/vendor-leads', {
        method: 'POST',
        body: submitData
      });

      if (response.ok) {
        // Store summary for success page
        localStorage.setItem('wervice_vendor_lead_summary', JSON.stringify({
          businessName: formData.businessName,
          category: formData.category,
          city: formData.city,
          whatsapp: formData.whatsapp,
          email: formData.email,
          price: getCurrentPrice()
        }));

        router.push('/vendors/subscribe/success');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit application. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                  currentStep >= 1 ? 'bg-[#D7FF1F] text-black' : 'bg-gray-200 text-gray-500'
                }`}>
                  1
                </div>
                <div className={`h-1 w-16 ${
                  currentStep >= 2 ? 'bg-[#D7FF1F]' : 'bg-gray-200'
                }`} />
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                  currentStep >= 2 ? 'bg-[#D7FF1F] text-black' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
              </div>
              <div className="ml-4 text-sm text-gray-600">
                Step {currentStep} of 2
              </div>
            </div>

            {/* Step 1: Business Basics */}
            {currentStep === 1 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Business Basics</h2>
                  <p className="text-sm text-gray-600">Tell us about your business</p>
                </div>
                <form className="space-y-6">
                  {/* Business Name */}
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('businessName')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent ${
                        errors.businessName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your Business Name"
                      aria-describedby={errors.businessName ? "businessName-error" : undefined}
                    />
                    {errors.businessName && (
                      <p id="businessName-error" className="mt-1 text-sm text-red-600">{errors.businessName}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('category')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                      aria-describedby={errors.category ? "category-error" : undefined}
                    >
                      <option value="">Select a category</option>
                      {Object.entries(categoryPricing).map(([slug, data]) => (
                        <option key={slug} value={data.name}>
                          {data.name} — {data.price} DHS/month
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p id="category-error" className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('city')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      aria-describedby={errors.city ? "city-error" : undefined}
                    >
                      <option value="">Select a city</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    {errors.city && (
                      <p id="city-error" className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number *
                    </label>
                    <input
                      id="whatsapp"
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('whatsapp')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent ${
                        errors.whatsapp ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+212 6XX XXX XXX"
                      aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
                    />
                    {errors.whatsapp && (
                      <p id="whatsapp-error" className="mt-1 text-sm text-red-600">{errors.whatsapp}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('email')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your@email.com"
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Website */}
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      id="website"
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('website')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent ${
                        errors.website ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="https://yourwebsite.com"
                      aria-describedby={errors.website ? "website-error" : undefined}
                    />
                    {errors.website && (
                      <p id="website-error" className="mt-1 text-sm text-red-600">{errors.website}</p>
                    )}
                  </div>

                  {/* Instagram */}
                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      id="instagram"
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('instagram')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent ${
                        errors.instagram ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="@yourhandle"
                      aria-describedby={errors.instagram ? "instagram-error" : undefined}
                    />
                    {errors.instagram && (
                      <p id="instagram-error" className="mt-1 text-sm text-red-600">{errors.instagram}</p>
                    )}
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!validateStep1()}
                      className="bg-[#D7FF1F] text-black font-semibold px-8 py-3 rounded-xl hover:bg-[#c4e600] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Profile & Plan */}
            {currentStep === 2 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile & Plan</h2>
                  <p className="text-sm text-gray-600">Complete your vendor profile</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Starting Price */}
                  <div>
                    <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700 mb-2">
                      Starting Price (MAD)
                    </label>
                    <input
                      id="startingPrice"
                      type="number"
                      name="startingPrice"
                      value={formData.startingPrice}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('startingPrice')}
                      min="0"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent ${
                        errors.startingPrice ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="5000"
                      aria-describedby={errors.startingPrice ? "startingPrice-error" : undefined}
                    />
                    <p className="mt-1 text-xs text-gray-500">Optional: Price shown on your public vendor profile</p>
                    {errors.startingPrice && (
                      <p id="startingPrice-error" className="mt-1 text-sm text-red-600">{errors.startingPrice}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('description')}
                      rows={4}
                      maxLength={300}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Tell us about your business..."
                      aria-describedby={`description-count ${errors.description ? "description-error" : ""}`}
                    />
                    <div className="flex justify-between mt-1">
                      <div>
                        {errors.description && (
                          <p id="description-error" className="text-sm text-red-600">{errors.description}</p>
                        )}
                      </div>
                      <div id="description-count" className="text-xs text-gray-500">
                        {formData.description.length}/300
                      </div>
                    </div>
                  </div>

                  {/* Images Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Images (Cover + Gallery) *
                    </label>
                    <div className="space-y-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        multiple
                        accept="image/*"
                        className="hidden"
                        aria-describedby="imageHelp"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#D7FF1F] transition-colors"
                        aria-describedby="imageHelp"
                      >
                        <div className="text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-600">Upload at least one cover photo. Max 7 photos total, 3MB each (JPG/PNG only).</p>
                        </div>
                      </button>

                      {/* Image Previews */}
                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={`Remove image ${index + 1}`}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.images && (
                      <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                    )}
                  </div>

                  {/* Plan Display */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Your Plan</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{formData.category || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly price:</span>
                        <span className="font-medium">{getCurrentPrice()} DHS</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cadence:</span>
                        <span className="font-medium">Monthly</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Subscription amount is determined by your category.</p>
                  </div>

                  {/* Consent Checkbox */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        id="consent"
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('consent')}
                        className="mt-1 text-[#D7FF1F] focus:ring-[#D7FF1F]"
                        aria-describedby={errors.consent ? "consent-error" : undefined}
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the Terms & Privacy and consent to being contacted by Wervice.
                      </span>
                    </label>
                    {errors.consent && (
                      <p id="consent-error" className="mt-1 text-sm text-red-600">{errors.consent}</p>
                    )}
                  </div>

                  {/* Honeypot field */}
                  <input type="text" name="honeypot" value={formData.honeypot} onChange={handleInputChange} className="hidden" aria-hidden="true" />

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    <button type="button" onClick={handlePrevious} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200">
                      Previous
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !validateStep2()}
                      className="bg-[#D7FF1F] text-black font-semibold px-8 py-3 rounded-xl hover:bg-[#c4e600] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        `Submit — ${getCurrentPrice()} DHS / month`
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Plan</h3>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Selected Category</div>
                <div className="font-medium text-gray-900">
                  {formData.category || 'Not selected'}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Monthly Price</div>
                <div className="text-2xl font-bold text-gray-900">
                  {getCurrentPrice()} DHS
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Cadence</div>
                <div className="font-medium text-gray-900">Monthly</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Billing</div>
                <div className="text-sm text-gray-700">We'll contact you to activate</div>
              </div>
            </div>

            <hr className="my-4" />

            <div className="text-xs text-gray-500 text-center space-y-1">
              <div>No commissions • Cancel anytime • Invoices in DHS (MAD)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      {currentStep === 2 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
          <button
            type="button"
            onClick={() => document.querySelector('form')?.requestSubmit()}
            disabled={isSubmitting || !validateStep2()}
            className="w-full bg-[#D7FF1F] text-black font-semibold py-3 rounded-xl hover:bg-[#c4e600] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : `Submit — ${getCurrentPrice()} DHS / month`}
          </button>
        </div>
      )}
    </div>
  );
}
