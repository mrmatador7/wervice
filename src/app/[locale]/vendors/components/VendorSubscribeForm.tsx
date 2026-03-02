'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { categoryPricing, getPriceFromCategory, getCategoryData } from '@/lib/categoryPricing';
import { MOROCCAN_CITIES } from '@/lib/types/vendor';

// Centralized pricing table (single source of truth)
const PRICING = {
  styleBeauty: { // Beauty, Decor, Dresses
    monthly: 200,
  },
  mediaEntertainment: { // Photo & Video, Music
    monthly: 250,
  },
  venuePlanning: { // Venues, Catering, Planning
    monthly: 350,
  },
} as const;

// Category name/label to plan family mapping (Wervice 11 categories)
const CATEGORY_TO_PLAN: Record<string, keyof typeof PRICING> = {
  Beauty: 'styleBeauty',
  Decor: 'styleBeauty',
  Dresses: 'styleBeauty',
  Florist: 'styleBeauty',
  Negafa: 'styleBeauty',
  Cakes: 'styleBeauty',
  'Photo & Film': 'mediaEntertainment',
  Artist: 'mediaEntertainment',
  Venue: 'venuePlanning',
  Caterer: 'venuePlanning',
  'Event Planner': 'venuePlanning',
};

const getBaseMonthlyPrice = (categorySlugOrName: string): number => {
  const name = categoryPricing[categorySlugOrName]?.name ?? categorySlugOrName;
  const planFamily = CATEGORY_TO_PLAN[name];
  return planFamily ? PRICING[planFamily].monthly : 0;
};

// Helper function to get effective monthly price (with discounts applied) based on cadence
const getEffectiveMonthlyPrice = (categoryName: string, cadence: string): number => {
  const basePrice = getBaseMonthlyPrice(categoryName);
  switch (cadence) {
    case '6m':
      return Math.round(basePrice * 0.9); // 10% discount
    case 'annual':
      return Math.round(basePrice * 0.8); // 20% discount
    default:
      return basePrice; // monthly - no discount
  }
};

const categories = Object.values(categoryPricing).map(cat => cat.name);
const categorySlugToName: { [key: string]: string } = Object.fromEntries(
  Object.entries(categoryPricing).map(([slug, data]) => [slug, data.name])
);

const cities = MOROCCAN_CITIES.filter((c) => c.value !== 'all').map((c) => c.label);

interface FormData {
  firstName: string;
  lastName: string;
  businessName: string;
  category: string;
  city: string;
  whatsapp: string;
  email: string;
  instagram: string;
  startingPrice: string;
  description: string;
  plan: 'monthly' | '6m' | 'annual';
  logoFile: File | null;
  galleryFiles: File[];
  serviceArea: string[];
  languages: string[];
  consent: boolean;
  honeypot: string;
  domainPerk: {
    enabled: boolean;
    requestedDomain: string;
    tld: '.ma' | '.com';
  };
}

interface FormErrors {
  [key: string]: string;
}

interface VendorSubscribeFormProps {
  defaultCategory?: string;
  defaultCadence?: string;
}

export default function VendorSubscribeForm({
  defaultCategory,
  defaultCadence
}: VendorSubscribeFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('vendor');
  const ts = useTranslations('vendor.subscribe');

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>(() => ({
    firstName: '',
    lastName: '',
    businessName: '',
    category: defaultCategory ? categoryPricing[defaultCategory]?.name || defaultCategory : '',
    city: '',
    whatsapp: '',
    email: '',
    instagram: '',
    startingPrice: '',
    description: '',
    plan: (defaultCadence === '6m' ? '6m' : defaultCadence === 'annual' ? 'annual' : 'monthly'),
    logoFile: null,
    galleryFiles: [],
    serviceArea: [],
    languages: [],
    consent: false,
    honeypot: '',
    domainPerk: {
      enabled: false,
      requestedDomain: '',
      tld: '.ma'
    }
  }));

  // Calculate base price using centralized pricing system
  const basePrice = useMemo(() => {
    return getBaseMonthlyPrice(formData.category);
  }, [formData.category]);

  // Calculate current price (with discounts applied)
  const currentPrice = useMemo(() => {
    // Apply discounts based on plan duration
    switch (formData.plan) {
      case '6m':
        return Math.round(basePrice * 0.9); // 10% discount
      case 'annual':
        return Math.round(basePrice * 0.8); // 20% discount
      default:
        return basePrice; // monthly - no discount
    }
  }, [basePrice, formData.plan]);

  // Calculate total and equivalent prices for 6M/Annual plans
  const planTotals = useMemo(() => {
    if (!basePrice) return null;

    switch (formData.plan) {
      case '6m':
        const total6m = Math.round(basePrice * 6 * 0.9);
        const equiv6m = Math.round(total6m / 6);
        return { total: total6m, equivalent: equiv6m, months: 6 };
      case 'annual':
        const totalAnnual = Math.round(basePrice * 12 * 0.8);
        const equivAnnual = Math.round(totalAnnual / 12);
        return { total: totalAnnual, equivalent: equivAnnual, months: 12 };
      default:
        return null; // Monthly has no total
    }
  }, [basePrice, formData.plan]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

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
      case 'firstName':
        if (!formData.firstName.trim()) {
          setErrors(prev => ({
            ...prev,
            firstName: 'First name is required'
          }));
        } else if (!/^[a-zA-Z\s\u0600-\u06FF]+$/.test(formData.firstName.trim()) || formData.firstName.trim().length > 60) {
          setErrors(prev => ({
            ...prev,
            firstName: 'Please enter a valid first name (letters only, max 60 characters)'
          }));
        }
        break;
      case 'lastName':
        if (!formData.lastName.trim()) {
          setErrors(prev => ({
            ...prev,
            lastName: 'Last name is required'
          }));
        } else if (!/^[a-zA-Z\s\u0600-\u06FF]+$/.test(formData.lastName.trim()) || formData.lastName.trim().length > 60) {
          setErrors(prev => ({
            ...prev,
            lastName: 'Please enter a valid last name (letters only, max 60 characters)'
          }));
        }
        break;
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
    }
  };

  // Memoized validation functions to prevent infinite loops
  const isStep1Valid = useMemo(() => {
    if (!formData.firstName.trim()) return false;
    if (!formData.lastName.trim()) return false;
    if (!formData.businessName.trim()) return false;
    if (!formData.category) return false;
    if (!formData.city) return false;
    if (!formData.whatsapp.trim()) return false;
    if (!validateWhatsApp(formData.whatsapp)) return false;
    if (!formData.email.trim()) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return false;
    return true;
  }, [formData.firstName, formData.lastName, formData.businessName, formData.category, formData.city, formData.whatsapp, formData.email]);

  const isStep2Valid = useMemo(() => {
    if (!formData.description.trim()) return false;
    if (formData.description.length > 300) return false;
    if (!logoPreview) return false; // Logo is required
    if (formData.galleryFiles.length === 0) return false; // Gallery is required
    if (formData.serviceArea.length === 0) return false; // Service area is required
    if (formData.languages.length === 0) return false; // Languages are required
    if (!formData.startingPrice.trim()) return false; // Starting price is required
    if (!formData.consent) return false;
    return true;
  }, [formData.description, logoPreview, formData.galleryFiles.length, formData.serviceArea.length, formData.languages.length, formData.startingPrice, formData.consent]);

  // Validation functions that update error state
  const validateStep1 = () => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (!/^[a-zA-Z\s\u0600-\u06FF]+$/.test(formData.firstName.trim()) || formData.firstName.trim().length > 60) {
      newErrors.firstName = 'Please enter a valid first name (letters only, max 60 characters)';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (!/^[a-zA-Z\s\u0600-\u06FF]+$/.test(formData.lastName.trim()) || formData.lastName.trim().length > 60) {
      newErrors.lastName = 'Please enter a valid last name (letters only, max 60 characters)';
    }

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

    if (!logoPreview) {
      newErrors.logo = 'Business logo is required';
    }

    if (formData.galleryFiles.length === 0) {
      newErrors.gallery = 'Please upload at least one gallery image';
    }

    if (formData.serviceArea.length === 0) {
      newErrors.serviceArea = 'Please select at least one service area';
    }

    if (formData.languages.length === 0) {
      newErrors.languages = 'Please select at least one language';
    }

    if (!formData.startingPrice.trim()) {
      newErrors.startingPrice = 'Starting price is required';
    }

    if (!formData.consent) {
      newErrors.consent = 'You must agree to the terms and consent to being contacted';
    }

    // Domain validation for 6-month and annual plans
    if (formData.plan === '6m' || formData.plan === 'annual') {
      if (formData.domainPerk.requestedDomain && formData.domainPerk.requestedDomain.length < 3) {
        newErrors.domain = 'Domain name must be at least 3 characters long.';
      } else if (formData.domainPerk.requestedDomain && formData.domainPerk.requestedDomain.length > 63) {
        newErrors.domain = 'Domain name must be 63 characters or less.';
      } else if (formData.domainPerk.requestedDomain && /^-.*-|.*-$/.test(formData.domainPerk.requestedDomain)) {
        newErrors.domain = 'Domain name cannot start or end with a hyphen.';
      }
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
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Navigate back to pricing page or previous step
      window.history.back();
    }
  };


  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (1MB max)
    if (file.size > 1 * 1024 * 1024) {
      alert('Logo file size must be less than 1MB.');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      alert('Logo must be a JPG or PNG file.');
      return;
    }

    setFormData(prev => ({ ...prev, logoFile: file }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle gallery upload
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setFormData(prev => ({
      ...prev,
      galleryFiles: [...prev.galleryFiles, ...validFiles].slice(0, 7) // Max 7 files
    }));

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setGalleryPreviews(prev => [...prev, result].slice(0, 7));
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle remove logo
  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logoFile: null }));
    setLogoPreview('');
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  // Handle city selection
  const handleCityToggle = (city: string) => {
    setFormData(prev => {
      if (city === 'All Cities (Nationwide)') {
        // If selecting "All Cities", clear all other selections
        const isSelected = prev.serviceArea.includes(city);
        return {
          ...prev,
          serviceArea: isSelected ? [] : [city]
        };
      } else {
        // For individual cities, remove "All Cities" if it was selected
        const newCities = prev.serviceArea.includes(city)
          ? prev.serviceArea.filter(c => c !== city)
          : [...prev.serviceArea.filter(c => c !== 'All Cities (Nationwide)'), city];

        return {
          ...prev,
          serviceArea: newCities
        };
      }
    });
  };


  // Generate slug from business name
  const generateBusinessSlug = (businessName: string): string => {
    return businessName
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric/hyphen chars
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  // Get current business slug
  const businessSlug = useMemo(() => {
    return generateBusinessSlug(formData.businessName || '');
  }, [formData.businessName]);

  // Clear domain data when switching to monthly plan
  useEffect(() => {
    if (formData.plan === 'monthly') {
      setFormData(prev => ({
        ...prev,
        domainPerk: {
          enabled: false,
          requestedDomain: '',
          tld: '.ma'
        }
      }));
    }
  }, [formData.plan]);

  // Handle domain input change
  const handleDomainChange = (value: string) => {
    // Strip whitespace, lowercase, and remove invalid chars
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '');

    setFormData(prev => ({
      ...prev,
      domainPerk: {
        ...prev.domainPerk,
        requestedDomain: cleanValue
      }
    }));

    // Clear errors
    if (errors.domain) {
      setErrors(prev => ({
        ...prev,
        domain: ''
      }));
    }
  };

  // Handle TLD change
  const handleTldChange = (tld: '.ma' | '.com') => {
    setFormData(prev => ({
      ...prev,
      domainPerk: {
        ...prev.domainPerk,
        tld
      }
    }));
  };

  // Handle use domain selection
  const handleUseDomain = () => {
    setFormData(prev => ({
      ...prev,
      domainPerk: {
        ...prev.domainPerk,
        enabled: true
      }
    }));
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

      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('businessName', formData.businessName);
      submitData.append('category', formData.category);
      submitData.append('city', formData.city);
      submitData.append('whatsapp', formData.whatsapp);
      submitData.append('email', formData.email);
      submitData.append('instagram', formData.instagram);
      submitData.append('profileStartingPrice', formData.startingPrice);
      submitData.append('profileDescription', formData.description);
      submitData.append('subscriptionCadence', formData.plan);
      submitData.append('subscriptionPriceDhs', currentPrice.toString());

      // Required fields
      if (formData.logoFile) {
        submitData.append('logoFile', formData.logoFile);
      }
      submitData.append('serviceArea', JSON.stringify(formData.serviceArea));
      submitData.append('languagesSpoken', JSON.stringify(formData.languages));

      submitData.append('source', 'vendors_subscribe_page');

      // Add domain data for 6-month and annual plans
      submitData.append('domainPerkEnabled', formData.domainPerk.enabled.toString());
      if (formData.domainPerk.requestedDomain) {
        submitData.append('domainPerkRequestedDomain', formData.domainPerk.requestedDomain);
        submitData.append('domainPerkTld', formData.domainPerk.tld);
      }

      // Add gallery images (required)
      formData.galleryFiles.forEach((file, index) => {
        submitData.append(`gallery_${index}`, file);
      });


      // Add honeypot for spam prevention
      submitData.append('honeypot', formData.honeypot);

      // API has been removed - show error message for now
      alert('Vendor registration is currently unavailable. Please contact us directly at contact@wervice.ma');
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Failed to submit application. Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your connection and try again.`);
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
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${currentStep >= 1 ? 'bg-[#D7FF1F] text-black' : 'bg-gray-200 text-gray-500'
                  }`}>
                  1
                </div>
                <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-[#D7FF1F]' : 'bg-gray-200'
                  }`} />
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${currentStep >= 2 ? 'bg-[#D7FF1F] text-black' : 'bg-gray-200 text-gray-500'
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
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-wervice-ink mb-2">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('firstName')}
                      className={`w-full px-4 py-3 bg-wervice-shell border border-wervice-sand/70 text-wervice-ink rounded-xl focus:ring-2 focus:ring-wervice-sand/40 focus:border-wervice-sand transition-all duration-200 hover:bg-wervice-shell/80 ${errors.firstName ? 'border-red-500' : ''
                        }`}
                      placeholder="Your first name"
                      aria-describedby={errors.firstName ? "firstName-error" : undefined}
                    />
                    {errors.firstName && (
                      <p id="firstName-error" className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-wervice-ink mb-2">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('lastName')}
                      className={`w-full px-4 py-3 bg-wervice-shell border border-wervice-sand/70 text-wervice-ink rounded-xl focus:ring-2 focus:ring-wervice-sand/40 focus:border-wervice-sand transition-all duration-200 hover:bg-wervice-shell/80 ${errors.lastName ? 'border-red-500' : ''
                        }`}
                      placeholder="Your last name"
                      aria-describedby={errors.lastName ? "lastName-error" : undefined}
                    />
                    {errors.lastName && (
                      <p id="lastName-error" className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>

                  {/* Business Name */}
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-wervice-ink mb-2">
                      Business Name *
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('businessName')}
                      className={`w-full px-4 py-3 bg-wervice-shell border border-wervice-sand/70 text-wervice-ink rounded-xl focus:ring-2 focus:ring-wervice-sand/40 focus:border-wervice-sand transition-all duration-200 hover:bg-wervice-shell/80 ${errors.businessName ? 'border-red-500' : ''
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
                    <label htmlFor="category" className="block text-sm font-medium text-wervice-ink mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('category')}
                      className={`w-full px-4 py-3 bg-wervice-shell border border-wervice-sand/70 text-wervice-ink rounded-xl focus:ring-2 focus:ring-wervice-sand/40 focus:border-wervice-sand transition-all duration-200 hover:bg-wervice-shell/80 ${errors.category ? 'border-red-500' : ''
                        }`}
                      aria-describedby={errors.category ? "category-error" : undefined}
                    >
                      <option value="">Select a category</option>
                      {Object.entries(categoryPricing).map(([slug, data]) => {
                        const effectivePrice = getEffectiveMonthlyPrice(data.name, formData.plan);
                        return (
                          <option key={slug} value={slug}>
                            {data.name} — {effectivePrice.toLocaleString()} MAD/month
                          </option>
                        );
                      })}
                    </select>
                    {errors.category && (
                      <p id="category-error" className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-wervice-ink mb-2">
                      City *
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('city')}
                      className={`w-full px-4 py-3 bg-wervice-shell border border-wervice-sand/70 text-wervice-ink rounded-xl focus:ring-2 focus:ring-wervice-sand/40 focus:border-wervice-sand transition-all duration-200 hover:bg-wervice-shell/80 ${errors.city ? 'border-red-500' : ''
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent ${errors.whatsapp ? 'border-red-500' : 'border-gray-300'
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="your@email.com"
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>


                  {/* Instagram */}
                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-wervice-ink mb-2">
                      Instagram
                    </label>
                    <input
                      id="instagram"
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('instagram')}
                      className={`w-full px-4 py-3 bg-wervice-shell border border-wervice-sand/70 text-wervice-ink rounded-xl focus:ring-2 focus:ring-wervice-sand/40 focus:border-wervice-sand transition-all duration-200 hover:bg-wervice-shell/80 ${errors.instagram ? 'border-red-500' : ''
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
                    <label htmlFor="startingPrice" className="block text-sm font-medium text-wervice-ink mb-2">
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
                      className={`w-full px-4 py-3 bg-wervice-shell border border-wervice-sand/70 text-wervice-ink rounded-xl focus:ring-2 focus:ring-wervice-sand/40 focus:border-wervice-sand transition-all duration-200 hover:bg-wervice-shell/80 ${errors.startingPrice ? 'border-red-500' : ''
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
                    <label htmlFor="description" className="block text-sm font-medium text-wervice-ink mb-2">
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
                      className={`w-full px-4 py-3 bg-wervice-shell border border-wervice-sand/70 text-wervice-ink rounded-xl focus:ring-2 focus:ring-wervice-sand/40 focus:border-wervice-sand transition-all duration-200 hover:bg-wervice-shell/80 ${errors.description ? 'border-red-500' : ''
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

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-wervice-ink mb-2">
                      Business Logo (Optional)
                    </label>
                    <div className="space-y-4">
                      <input
                        type="file"
                        ref={logoInputRef}
                        onChange={handleLogoUpload}
                        accept="image/*"
                        className="hidden"
                        aria-describedby="logoHelp"
                      />
                      <div className="space-y-3">
                        {logoPreview ? (
                          <div className="flex flex-col items-center space-y-3 p-4 border-2 border-solid border-wervice-sand/30 rounded-xl bg-wervice-shell/30">
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="w-16 h-16 object-cover rounded-lg border border-wervice-sand/30"
                            />
                            <p className="text-sm text-wervice-ink font-medium">Logo uploaded successfully</p>
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              className="text-xs text-red-600 hover:text-red-800 underline px-3 py-1 rounded hover:bg-red-50 transition-colors"
                            >
                              Remove logo
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => logoInputRef.current?.click()}
                            className="w-full p-4 border-2 border-dashed border-wervice-sand/70 rounded-xl hover:border-wervice-sand transition-all duration-200 hover:bg-wervice-shell/50"
                            aria-describedby="logoHelp"
                          >
                            <div className="text-center">
                              <svg className="mx-auto h-12 w-12 text-wervice-sand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="mt-2 text-sm text-wervice-ink">Upload your business logo</p>
                              <p className="text-xs text-gray-500">Square image, max 1MB (JPG/PNG)</p>
                            </div>
                          </button>
                        )}
                      </div>
                      <div id="logoHelp" className="text-xs text-gray-500 text-center">
                        Appears on your vendor profile and listings
                      </div>
                    </div>
                  </div>

                  {/* Gallery */}
                  <div>
                    <label className="block text-sm font-medium text-wervice-ink mb-2">
                      Gallery *
                    </label>
                    <div className="space-y-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleGalleryUpload}
                        multiple
                        accept="image/*"
                        className="hidden"
                        aria-describedby="galleryHelp"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-4 border-2 border-dashed border-wervice-sand/70 rounded-xl hover:border-wervice-sand transition-all duration-200 hover:bg-wervice-shell/50"
                        aria-describedby="galleryHelp"
                      >
                        <div className="text-center">
                          <svg className="mx-auto h-12 w-12 text-wervice-sand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="mt-2 text-sm text-wervice-ink">Upload gallery images</p>
                          <p className="text-xs text-gray-500">Showcase your work (max 7 images, 3MB each)</p>
                        </div>
                      </button>

                      {/* Gallery Previews */}
                      {galleryPreviews.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {galleryPreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-wervice-sand/30"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
                                  setFormData(prev => ({
                                    ...prev,
                                    galleryFiles: prev.galleryFiles.filter((_, i) => i !== index)
                                  }));
                                }}
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
                    <div id="galleryHelp" className="text-xs text-gray-500 text-center mt-2">
                      Displayed on your vendor profile to showcase your services
                    </div>
                  </div>

                  {/* Service Area / Cities Covered */}
                  <div>
                    <label className="block text-sm font-medium text-wervice-ink mb-3">
                      Service Area / Cities Covered
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {/* All Cities option */}
                      <button
                        type="button"
                        onClick={() => handleCityToggle('All Cities (Nationwide)')}
                        className={`flex items-center justify-center px-3 py-2 rounded-full border-2 transition-all duration-200 text-center ${formData.serviceArea.includes('All Cities (Nationwide)')
                            ? 'bg-[#D9FF0A] border-[#D9FF0A] text-black font-bold'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                          }`}
                        aria-pressed={formData.serviceArea.includes('All Cities (Nationwide)')}
                      >
                        <span className="text-sm font-medium">🌍 All Cities</span>
                      </button>

                      {/* Individual cities */}
                      {[...cities, 'Essaouira'].map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => handleCityToggle(city)}
                          disabled={formData.serviceArea.includes('All Cities (Nationwide)')}
                          className={`flex items-center justify-center px-3 py-2 rounded-full border-2 transition-all duration-200 text-center ${formData.serviceArea.includes(city) && !formData.serviceArea.includes('All Cities (Nationwide)')
                              ? 'bg-[#D9FF0A] border-[#D9FF0A] text-black font-bold'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
                            }`}
                          aria-pressed={formData.serviceArea.includes(city)}
                        >
                          <span className="text-sm font-medium">{city}</span>
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-gray-500 text-center">Helps couples find vendors in their area</p>
                  </div>

                  {/* Languages Spoken */}
                  <div>
                    <label className="block text-sm font-medium text-wervice-ink mb-3">
                      Languages Spoken
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const isSelected = formData.languages.includes('ar');
                          setFormData(prev => ({
                            ...prev,
                            languages: isSelected
                              ? prev.languages.filter(lang => lang !== 'ar')
                              : [...prev.languages, 'ar']
                          }));
                        }}
                        className={`flex items-center justify-center px-3 py-2 rounded-full border-2 transition-all duration-200 text-center ${formData.languages.includes('ar')
                            ? 'bg-[#D9FF0A] border-[#D9FF0A] text-black font-bold'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                          }`}
                        aria-pressed={formData.languages.includes('ar')}
                      >
                        <span className="text-sm font-medium">🇲🇦 Arabic</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const isSelected = formData.languages.includes('fr');
                          setFormData(prev => ({
                            ...prev,
                            languages: isSelected
                              ? prev.languages.filter(lang => lang !== 'fr')
                              : [...prev.languages, 'fr']
                          }));
                        }}
                        className={`flex items-center justify-center px-3 py-2 rounded-full border-2 transition-all duration-200 text-center ${formData.languages.includes('fr')
                            ? 'bg-[#D9FF0A] border-[#D9FF0A] text-black font-bold'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                          }`}
                        aria-pressed={formData.languages.includes('fr')}
                      >
                        <span className="text-sm font-medium">🇫🇷 French</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const isSelected = formData.languages.includes('en');
                          setFormData(prev => ({
                            ...prev,
                            languages: isSelected
                              ? prev.languages.filter(lang => lang !== 'en')
                              : [...prev.languages, 'en']
                          }));
                        }}
                        className={`flex items-center justify-center px-3 py-2 rounded-full border-2 transition-all duration-200 text-center ${formData.languages.includes('en')
                            ? 'bg-[#D9FF0A] border-[#D9FF0A] text-black font-bold'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                          }`}
                        aria-pressed={formData.languages.includes('en')}
                      >
                        <span className="text-sm font-medium">🇬🇧 English</span>
                      </button>
                    </div>
                    <p className="mt-3 text-xs text-gray-500 text-center">Select one or more languages you speak fluently.</p>
                  </div>

                  {/* Free Domain Section - Only show for 6-month and annual plans */}
                  {(formData.plan === '6m' || formData.plan === 'annual') && (
                    <div className="bg-white rounded-lg p-6 border border-wervice-sand/30 shadow-sm">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Free Domain (6-month/Annual perk)
                        </h3>
                        <p className="text-sm text-gray-600">
                          Claim your free .ma or .com domain for your business (1st year included).
                        </p>
                      </div>

                      {/* TLD Toggle */}
                      <div className="flex gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => handleTldChange('.ma')}
                          aria-pressed={formData.domainPerk.tld === '.ma'}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.domainPerk.tld === '.ma'
                              ? 'bg-[#D9FF0A] text-black border-2 border-[#D9FF0A]'
                              : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
                            }`}
                        >
                          .ma
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTldChange('.com')}
                          aria-pressed={formData.domainPerk.tld === '.com'}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.domainPerk.tld === '.com'
                              ? 'bg-[#D9FF0A] text-black border-2 border-[#D9FF0A]'
                              : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
                            }`}
                        >
                          .com
                        </button>
                      </div>

                      {/* Domain Input */}
                      <div className="mb-4">
                        <div className="flex">
                          <input
                            type="text"
                            value={formData.domainPerk.requestedDomain}
                            onChange={(e) => handleDomainChange(e.target.value)}
                            placeholder={`Enter your desired domain (e.g. ${businessSlug || 'ma-journeys'})`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#D9FF0A] focus:border-[#D9FF0A] outline-none"
                            maxLength={63}
                          />
                          <div className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600 font-medium">
                            {formData.domainPerk.tld}
                          </div>
                        </div>
                        {errors.domain && (
                          <p className="mt-1 text-sm text-red-600">{errors.domain}</p>
                        )}
                        <p className="mt-2 text-sm text-gray-600">
                          Your free domain will point to your Wervice profile, making it easier to share.<br />
                          Example: www.{(formData.domainPerk.requestedDomain || businessSlug || 'ma-journeys')}{formData.domainPerk.tld} instead of www.wervice.com/vendor/{businessSlug || 'ma-journeys'}.
                        </p>
                      </div>

                      {/* Live Domain Preview */}
                      {formData.domainPerk.requestedDomain && (
                        <div className="mb-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-800 mb-3">Domain Preview</h4>
                            <div className="space-y-3">
                              <div className="bg-white rounded border border-blue-100 p-3">
                                <div className="text-blue-800 font-mono text-sm font-medium">
                                  www.{formData.domainPerk.requestedDomain}{formData.domainPerk.tld}
                                </div>
                              </div>
                              <div className="text-sm text-blue-700">
                                This domain will redirect to your Wervice profile:
                              </div>
                              <div className="bg-gray-50 rounded border p-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-gray-700 font-mono">
                                    www.{formData.domainPerk.requestedDomain}{formData.domainPerk.tld}
                                  </span>
                                  <span className="text-gray-400">→</span>
                                  <span className="text-gray-700 font-mono">
                                    www.wervice.com/vendor/{businessSlug || 'your-business'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Use Domain Button */}
                      {formData.domainPerk.requestedDomain && !formData.domainPerk.enabled && (
                        <div className="mb-4">
                          <button
                            type="button"
                            onClick={handleUseDomain}
                            className="w-full bg-[#D9FF0A] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#c4e600] transition-colors"
                          >
                            Use this domain
                          </button>
                        </div>
                      )}

                      {/* Domain Selected Confirmation */}
                      {formData.domainPerk.enabled && (
                        <div className="mb-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600 text-lg">✓</span>
                              <span className="text-green-800 font-medium">
                                Domain selected: {formData.domainPerk.requestedDomain}{formData.domainPerk.tld}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}


                      {/* Info Text */}
                      <p className="text-xs text-gray-500">
                        1st year included. Auto-renew at standard rate. You can connect later or forward to your Instagram/website.
                      </p>
                    </div>
                  )}

                  {/* Monthly Plan Upsell Note */}
                  {formData.plan === 'monthly' && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-600 text-center">
                        Free domain is included with 6-month or annual plans.
                      </p>
                    </div>
                  )}

                  {/* Preview Card */}
                  {(formData.businessName || formData.category || formData.city || currentPrice) && (
                    <div className="bg-white rounded-lg p-4 border border-wervice-sand/30 shadow-sm">
                      <h4 className="text-sm font-medium text-wervice-ink mb-3">Live Preview</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-wervice-shell rounded-lg flex items-center justify-center flex-shrink-0">
                            {logoPreview ? (
                              <img
                                src={logoPreview}
                                alt="Logo"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-wervice-sand/30 rounded"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-semibold text-gray-900 truncate">
                              {formData.businessName || 'Your Business Name'}
                            </h5>
                            <p className="text-xs text-gray-600 truncate">
                              {formData.category || 'Category'} • {formData.city || 'City'}
                            </p>
                            {currentPrice > 0 && (
                              <p className="text-xs font-medium text-wervice-ink mt-1">
                                From {currentPrice.toLocaleString()} MAD
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">How your listing will appear to couples</p>
                    </div>
                  )}

                  {/* Plan Display */}
                  <div className="bg-gray-100 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Your Plan</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{formData.category || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly price:</span>
                        <span className="font-medium">{currentPrice.toLocaleString()} MAD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cadence:</span>
                        <span className="font-medium">
                          {formData.plan === '6m' ? '6 Months' : formData.plan === 'annual' ? 'Annual' : 'Monthly'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Subscription amount is determined by your category.</p>
                  </div>

                  {/* Trust & Transparency Section */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-800 text-center">
                      <span className="inline-flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Wervice manually reviews every profile within 24 hours to ensure quality and authenticity.
                      </span>
                    </p>
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
                  <div className={`flex pt-6 ${String(currentStep) === '1' ? 'justify-between' : 'justify-between'}`}>
                    <button type="button" onClick={handlePrevious} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200">
                      Previous
                    </button>
                    {String(currentStep) === '1' ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="bg-[#D7FF1F] text-black font-semibold px-8 py-3 rounded-xl hover:bg-[#c4e600] transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
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
                          `Submit — ${currentPrice.toLocaleString()} MAD / month (${formData.plan === '6m' ? '6 Months' : formData.plan === 'annual' ? 'Annual' : 'Monthly'} Plan)`
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-1">
          <div className="sidebar-sticky">
            <div className="bg-white rounded-2xl shadow-lg p-6">
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
                    {currentPrice.toLocaleString()} MAD
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Cadence</div>
                  <div className="font-medium text-gray-900">
                    {formData.plan === '6m' ? '6 Months' : formData.plan === 'annual' ? 'Annual' : 'Monthly'}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Billing</div>
                  <div className="text-sm text-gray-700">We&apos;ll contact you to activate</div>
                </div>

                {/* Total and Perks for 6M/Annual plans */}
                {planTotals && (
                  <div className="bg-[#F7F8FB] rounded-lg border border-gray-200 p-4 space-y-3">
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        Total for {planTotals.months} months: {planTotals.total.toLocaleString()} MAD
                      </div>
                      <div className="text-sm text-gray-600">
                        ≈ {planTotals.equivalent.toLocaleString()} MAD / month
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Included perks
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="text-green-600 text-xs">✓</span>
                          <span>{formData.plan === '6m' ? '-10%' : '-20%'} automatically applied</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="text-green-600 text-xs">✓</span>
                          <span>
                            {formData.domainPerk.enabled && formData.domainPerk.requestedDomain
                              ? `Free domain: ${formData.domainPerk.requestedDomain}${formData.domainPerk.tld}`
                              : 'Free .ma/.com domain'
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="text-green-600 text-xs">✓</span>
                          <span>Social Boost on Instagram & TikTok</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 text-center space-y-1">
                <div>No commissions • Cancel anytime • Invoices in DHS (MAD)</div>
              </div>
            </div>

            {/* Profile Completion Card - Separate Block */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Progress</span>
                    <span className="text-sm font-bold text-gray-900">
                      {Math.round(
                        (formData.description.trim() ? 17 : 0) + // Description → +17%
                        (logoPreview ? 17 : 0) + // Logo → +17%
                        (formData.galleryFiles.length > 0 ? 17 : 0) + // Gallery → +17%
                        (formData.serviceArea.length > 0 ? 16 : 0) + // Service Area → +16%
                        (formData.languages.length > 0 ? 16 : 0) + // Languages → +16%
                        (formData.startingPrice.trim() ? 17 : 0) // Starting Price → +17%
                      )}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-[#D7FF1F] h-3 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.round(
                          (formData.description.trim() ? 17 : 0) + // Description → +17%
                          (logoPreview ? 17 : 0) + // Logo → +17%
                          (formData.galleryFiles.length > 0 ? 17 : 0) + // Gallery → +17%
                          (formData.serviceArea.length > 0 ? 16 : 0) + // Service Area → +16%
                          (formData.languages.length > 0 ? 16 : 0) + // Languages → +16%
                          (formData.startingPrice.trim() ? 17 : 0) // Starting Price → +17%
                        )}%`
                      }}
                    ></div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Complete all required fields to reach 100% and get verified faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handlePrevious}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            Back
          </button>
          {currentStep !== 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 bg-[#D7FF1F] text-black font-semibold py-3 rounded-xl hover:bg-[#c4e600] transition-all duration-200 shadow-lg"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit({ preventDefault: () => { } } as React.FormEvent);
              }}
              disabled={isSubmitting}
              className="flex-1 bg-[#D7FF1F] text-black font-semibold py-3 rounded-xl hover:bg-[#c4e600] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : `Submit — ${currentPrice.toLocaleString()} MAD / month`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
