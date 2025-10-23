'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { VendorDetail } from '@/lib/db/vendors';

interface VendorGalleryProps {
  vendor: VendorDetail;
}

export default function VendorGallery({ vendor }: VendorGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Combine profile photo and gallery photos
  const allPhotos: string[] = [];
  if (vendor.profile_photo_url) allPhotos.push(vendor.profile_photo_url);
  if (vendor.gallery_photos) allPhotos.push(...vendor.gallery_photos);

  // Limit to 8 photos for display
  const displayPhotos = allPhotos.slice(0, 8);

  if (displayPhotos.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayPhotos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === displayPhotos.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900 mb-4">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {displayPhotos.map((photo, index) => (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className="relative aspect-square overflow-hidden rounded-lg hover:opacity-90 transition group"
            >
              <Image
                src={photo}
                alt={`${vendor.business_name} - Photo ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </button>
          ))}
        </div>
        {allPhotos.length > 8 && (
          <p className="mt-3 text-sm text-zinc-500 text-center">
            +{allPhotos.length - 8} more photos
          </p>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
            aria-label="Close gallery"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous Button */}
          {displayPhotos.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Image */}
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] mx-4">
            <Image
              src={displayPhotos[currentIndex]}
              alt={`${vendor.business_name} - Photo ${currentIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Next Button */}
          {displayPhotos.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
            {currentIndex + 1} / {displayPhotos.length}
          </div>
        </div>
      )}
    </>
  );
}

