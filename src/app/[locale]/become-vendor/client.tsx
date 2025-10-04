'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiCheck, FiArrowRight, FiMail, FiPhone, FiUser, FiBriefcase, FiMapPin } from 'react-icons/fi';

const benefits = [
  'Reach thousands of engaged couples',
  'Showcase your portfolio professionally',
  'Get direct inquiries and bookings',
  'Build credibility with reviews',
  'Access vendor tools and analytics',
];

const businessTypes = [
  'Venue',
  'Catering',
  'Photography & Video',
  'Event Planning',
  'Beauty & Hair',
  'Decor & Styling',
  'Music & Entertainment',
  'Wedding Dresses',
  'Transportation',
  'Other'
];

export default function VendorSignupClient() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    city: '',
    businessType: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-[#D7FF1F] rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-8 h-8 text-gray-900" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
          <p className="text-slate-600 mb-6">
            Thank you for your interest in joining Wervice. Our team will review your application and contact you within 2-3 business days.
          </p>
          <div className="space-y-3">
            <Link
              href="/vendors"
              className="w-full bg-[#D7FF1F] text-gray-900 font-semibold py-3 px-6 rounded-full hover:bg-[#D7FF1F]/90 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Browse Vendors
              <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="w-full border border-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-full hover:bg-slate-50 transition-colors duration-200 flex items-center justify-center"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Start Your Wedding Business on Wervice
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join Morocco&apos;s premier wedding marketplace and connect with engaged couples looking for your services.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Benefits Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Join Wervice?</h2>
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <FiCheck className="w-5 h-5 text-[#D7FF1F] flex-shrink-0" />
                  <span className="text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Ready to get started?</h3>
              <p className="text-slate-600 text-sm mb-4">
                Fill out the form to begin your journey as a Wervice vendor. We&apos;ll help you set up your profile and start attracting clients.
              </p>
              <div className="text-sm text-slate-500">
                <strong>Free to join • No monthly fees • Success-based pricing</strong>
              </div>
            </div>
          </div>

          {/* Signup Form */}
          <div>
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Your Vendor Account</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                      <FiBriefcase className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-[#D7FF1F]"
                      placeholder="Your Business Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                      <FiUser className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-[#D7FF1F]"
                      placeholder="Your Full Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                        <FiMail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-[#D7FF1F]"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                        <FiPhone className="w-5 h-5" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-[#D7FF1F]"
                        placeholder="+212 XXX XXX XXX"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                        <FiMapPin className="w-5 h-5" />
                      </div>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-[#D7FF1F] appearance-none"
                      >
                        <option value="">Select City</option>
                        <option value="Casablanca">Casablanca</option>
                        <option value="Marrakech">Marrakech</option>
                        <option value="Rabat">Rabat</option>
                        <option value="Tangier">Tangier</option>
                        <option value="Agadir">Agadir</option>
                        <option value="Fes">Fes</option>
                        <option value="Meknes">Meknes</option>
                        <option value="El Jadida">El Jadida</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type *
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D7FF1F] focus:border-[#D7FF1F] appearance-none"
                    >
                      <option value="">Select Type</option>
                      {businessTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D7FF1F] text-gray-900 font-semibold py-4 px-6 rounded-full hover:bg-[#D7FF1F]/90 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Start My Free Account'}
                  {!isSubmitting && <FiArrowRight className="w-5 h-5" />}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  By signing up, you agree to our{' '}
                  <Link href="/terms" className="text-[#D7FF1F] hover:text-[#D7FF1F]/80">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-[#D7FF1F] hover:text-[#D7FF1F]/80">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}