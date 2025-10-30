'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import CategoryDropdown from '@/components/ui/CategoryDropdown';
import CityDropdown from '@/components/ui/CityDropdown';

// Category to price mapping
const getCategoryPrice = (category: string): number => {
  const premiumCategories = ['Venues', 'Catering', 'Planning'];
  const standardCategories = ['Photo & Video', 'Music'];
  const basicCategories = ['Decor', 'Beauty', 'Dresses'];

  if (premiumCategories.includes(category)) return 250;
  if (standardCategories.includes(category)) return 200;
  if (basicCategories.includes(category)) return 150;
  return 0;
};

export default function VendorSignupForm() {
  const t = useTranslations('vendor');
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    city: '',
    whatsapp: '',
    email: '',
    startingPrice: '',
    description: ''
  });
  const [showPrice, setShowPrice] = useState(false);

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Show price when category is selected
    if (name === 'category') {
      setShowPrice(value !== '');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreviews(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.businessName || !formData.category || !formData.city || !formData.whatsapp || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    console.log('Images:', images);

    // Redirect to thank you page
    router.push('/become-vendor/success');
  };

  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="font-decorative text-3xl md:text-4xl text-gray-900 mb-4">
              Start Your Vendor Journey
            </h2>
            <p className="text-lg text-slate-600">
              Fill out your business details below to submit your vendor application
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent"
                  placeholder="Your business name"
                />
              </div>

              {/* Category and City Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <CategoryDropdown
                    value={formData.category}
                    onChange={(value: string) => handleInputChange({ target: { name: 'category', value } })}
                    disabled={false}
                  />

                  {/* Dynamic Price Display */}
                  {showPrice && formData.category && (
                    <div className={`mt-4 mb-2 p-4 bg-[#DFFF00]/90 border border-[#DFFF00]/20 rounded-xl shadow-sm hover:shadow-lg hover:shadow-[#DFFF00]/20 transition-all duration-300 ${showPrice ? 'opacity-100 animate-fade-in' : 'opacity-0'}`}>
                      <p className="text-base md:text-lg font-bold text-[#111827] text-center">
                        💳 Vendors in this category subscribe for {getCategoryPrice(formData.category)} DHS / month
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <CityDropdown
                    value={formData.city}
                    onChange={(value) => handleInputChange({ target: { name: 'city', value } })}
                    disabled={false}
                  />
                </div>
              </div>

              {/* Contact Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent"
                    placeholder="+212 6XX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Starting Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Price (MAD) *
                </label>
                <input
                  type="number"
                  name="startingPrice"
                  value={formData.startingPrice}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent"
                  placeholder="5000"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  maxLength={300}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent"
                  placeholder="Tell couples about your services and what makes you special..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.description.length}/300 characters
                </p>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos (Cover + Gallery)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload at least one cover photo. Max 10 photos.
                </p>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>


              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-[#D7FF1F] text-black font-semibold text-lg py-4 px-8 rounded-2xl hover:bg-[#c4e600] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  👉 Submit Vendor Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
