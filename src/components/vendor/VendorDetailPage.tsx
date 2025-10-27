'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiPhone, FiChevronRight } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';

interface VendorDetailPageProps {
  name: string;
  city: string;
  category: string;
  priceFrom: number;
  phone: string;
  whatsapp: string;
  packages: string[];
  guests: string[];
  highlights: string[];
  amenities: string[];
  policies: string[];
  images: string[];
  videoUrl?: string;
  mapEmbedUrl?: string;
  isVerified?: boolean;
  badges?: string[];
  locale?: string;
}

export default function VendorDetailPage({
  name,
  city,
  category,
  priceFrom,
  phone,
  whatsapp,
  packages,
  guests,
  highlights,
  amenities,
  policies,
  images,
  videoUrl,
  mapEmbedUrl,
  isVerified = true,
  badges = [],
  locale = 'en'
}: VendorDetailPageProps) {
  const [mainImage, setMainImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'amenities' | 'policies' | 'location'>('details');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const whatsappMessage = encodeURIComponent(
    `Hello! I found ${name} on Wervice and would like to check availability.`
  );

  const allMediaItems = [...images];
  if (videoUrl) {
    allMediaItems.push(videoUrl);
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % allMediaItems.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + allMediaItems.length) % allMediaItems.length);
  };

  const priceDisplay = priceFrom > 0 ? `${priceFrom.toLocaleString()} MAD` : 'Contact for quote';

  // Generate description from highlights
  const description = highlights.slice(0, 2).join('. ') + '. Perfect for weddings, receptions, and private events.';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5FBFF] via-white to-[#F5FBFF]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN - Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <button
              onClick={() => openLightbox(mainImage)}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] w-full cursor-pointer group"
            >
              {allMediaItems[mainImage] === videoUrl ? (
                <div className="relative w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <>
                  <Image
                    src={allMediaItems[mainImage]}
                    alt={`${name}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
                </>
              )}
              
              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white transition-colors shadow-md">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </button>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {allMediaItems.slice(0, 5).map((item, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white shadow-md transition-all ${
                    mainImage === index 
                      ? 'ring-2 ring-emerald-600 scale-105' 
                      : 'hover:ring-2 hover:ring-gray-300'
                  }`}
                >
                  {item === videoUrl ? (
                    <div className="relative w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  ) : (
                    <Image
                      src={item}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Custom scrollbar hide */}
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
          </div>

          {/* RIGHT COLUMN - Info Card */}
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-6 lg:p-8 h-fit">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <Link href={`/${locale}`} className="hover:text-gray-900">Home</Link>
              <FiChevronRight className="w-3 h-3" />
              <Link href={`/${locale}/vendors`} className="hover:text-gray-900">Vendors</Link>
              <FiChevronRight className="w-3 h-3" />
              <Link href={`/${locale}/categories/${category.toLowerCase()}`} className="hover:text-gray-900">{category}</Link>
              <FiChevronRight className="w-3 h-3" />
              <span className="text-gray-900 font-medium">{name}</span>
            </div>

            {/* Vendor Name */}
            <div className="flex items-start gap-3 mb-2">
              <h1 className="text-3xl font-semibold text-gray-900 leading-tight">{name}</h1>
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full mt-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>

            {/* Subline */}
            <p className="text-gray-600 mb-3">{category} · {city}</p>

            {/* Price */}
            <p className="text-2xl font-bold text-gray-900 mb-4">Starting from {priceDisplay}</p>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6 text-sm">
              {description}
            </p>

            {/* Attributes */}
            {badges.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Attributes</h3>
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Type */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Type</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium">
                  Direct Vendor
                </span>
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                  Response within 24h
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-4">
              <a
                href={`tel:${phone}`}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#D9FF0A] hover:bg-[#C5E808] text-[#11190C] font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <FiPhone className="w-5 h-5" />
                Call Vendor
              </a>

              <a
                href={`https://wa.me/${whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <BsWhatsapp className="w-5 h-5" />
                WhatsApp Vendor
              </a>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 text-center">
              Vendor will respond directly via phone or WhatsApp.
            </p>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
                activeTab === 'details'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
              {activeTab === 'details' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('amenities')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
                activeTab === 'amenities'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Amenities
              {activeTab === 'amenities' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
                activeTab === 'policies'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Policies
              {activeTab === 'policies' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
                activeTab === 'location'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Location
              {activeTab === 'location' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'details' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Highlights</h3>
                <ul className="space-y-3">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                {packages.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Packages & Inclusions</h3>
                    <ul className="space-y-2">
                      {packages.map((pkg, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          {pkg}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'amenities' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'policies' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Policies</h3>
                <ul className="space-y-3">
                  {policies.map((policy, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>{policy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'location' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Venue Location</h3>
                <p className="text-gray-600 mb-4">{city}, Morocco</p>
                {mapEmbedUrl ? (
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <iframe
                      src={mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-xl bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">Map not available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Customer Reviews</h2>
          
          {/* Reviews Summary */}
          <div className="flex flex-col md:flex-row gap-8 pb-8 mb-8 border-b border-gray-200">
            <div className="text-center md:text-left">
              <div className="text-5xl font-bold text-gray-900 mb-2">4.8</div>
              <div className="flex items-center gap-1 justify-center md:justify-start mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-sm text-gray-600">Based on 24 reviews</div>
            </div>
            
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-gray-600 w-12">{rating} stars</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 transition-all" 
                      style={{ width: rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '5%' : '3%' }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{rating === 5 ? '17' : rating === 4 ? '5' : rating === 3 ? '1' : '1'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {/* Review 1 */}
            <div className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah & Ahmed</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">2 weeks ago</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Absolutely stunning venue! The garden was perfect for our ceremony and the staff was incredibly helpful throughout the planning process. Our guests loved the ambiance and the food was exceptional. Highly recommend for anyone looking for an elegant outdoor wedding venue.
              </p>
            </div>

            {/* Review 2 */}
            <div className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Fatima & Youssef</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">1 month ago</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Beautiful venue with great facilities. The only minor issue was parking could have been better organized, but overall it was a wonderful experience. The team was professional and accommodating to all our requests.
              </p>
            </div>

            {/* Review 3 */}
            <div className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Leila & Karim</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">2 months ago</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Perfect venue for our dream wedding! Everything from the décor to the service was top-notch. The venue coordinator was amazing and helped us with every detail. Our wedding day was magical thanks to this beautiful venue.
              </p>
            </div>
          </div>

          {/* View All Reviews Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button className="w-full md:w-auto px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
              View All 24 Reviews
            </button>
          </div>
        </div>

        {/* Similar Listings Section */}
        <div className="mt-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Similar Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-xl transition-all group">
                <div className="relative aspect-[4/3] bg-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-sm font-medium">Similar Venue {item}</span>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">Venue Name {item}</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{category} · {city}</p>
                  <p className="text-xl font-bold text-gray-900 mb-3">Starting from 8,000 MAD</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">Garden</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">Rooftop</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50">
        <div className="flex gap-3">
          <a
            href={`tel:${phone}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#D9FF0A] text-[#11190C] font-semibold rounded-xl shadow-md"
          >
            <FiPhone className="w-5 h-5" />
            Call
          </a>
          <a
            href={`https://wa.me/${whatsapp}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white font-semibold rounded-xl shadow-md"
          >
            <BsWhatsapp className="w-5 h-5" />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
            {lightboxIndex + 1} / {allMediaItems.length}
          </div>

          {/* Previous Button */}
          {allMediaItems.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {allMediaItems.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Media Content */}
          <div className="relative w-full h-full flex items-center justify-center p-16">
            {allMediaItems[lightboxIndex] === videoUrl ? (
              <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  src={videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={allMediaItems[lightboxIndex]}
                  alt={`${name} - Image ${lightboxIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 max-w-5xl w-full px-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide justify-center">
              {allMediaItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setLightboxIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    index === lightboxIndex 
                      ? 'border-white scale-110 shadow-xl' 
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  {item === videoUrl ? (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  ) : (
                    <Image
                      src={item}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom scrollbar hide */}
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
