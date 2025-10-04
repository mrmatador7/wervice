import { FiStar } from 'react-icons/fi';
import { Vendor } from '@/lib/types';

interface VendorReviewsProps {
  vendor: Vendor;
}

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    author: 'Sarah M.',
    rating: 5,
    date: '2024-01-15',
    comment: 'Absolutely amazing experience! The venue was perfect for our traditional Moroccan wedding. Every detail was taken care of, and the staff was incredibly professional.',
    verified: true,
  },
  {
    id: 2,
    author: 'Ahmed K.',
    rating: 5,
    date: '2024-01-08',
    comment: 'Outstanding service and attention to detail. The photography captured the essence of our special day perfectly. Highly recommend!',
    verified: true,
  },
  {
    id: 3,
    author: 'Fatima L.',
    rating: 4,
    date: '2023-12-20',
    comment: 'Beautiful venue with authentic Moroccan architecture. The team was responsive and helpful throughout the planning process.',
    verified: true,
  },
];

function StarRating({ rating, size = 4 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <FiStar
          key={i}
          className={`w-${size} h-${size} ${
            i < rating ? 'fill-[#D9FF0A] text-[#D9FF0A]' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

export function VendorReviews({ vendor }: VendorReviewsProps) {
  if (!vendor.rating || !vendor.reviewsCount) return null;

  return (
    <section className="py-10 sm:py-12">
      <div className="bg-white rounded-2xl p-8 shadow-[0_6px_18px_rgba(17,25,12,0.06)] ring-1 ring-black/5">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#11190C] mb-2">Reviews & Ratings</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#11190C]">{vendor.rating}</span>
                <StarRating rating={Math.floor(vendor.rating)} size={5} />
              </div>
              <span className="text-[#787664]">
                Based on {vendor.reviewsCount} reviews
              </span>
            </div>
          </div>
          <button className="text-[#D9FF0A] hover:text-[#c4e600] font-medium transition-colors">
            See all reviews →
          </button>
        </div>

        <div className="space-y-6">
          {mockReviews.map((review) => (
            <div key={review.id} className="border-b border-[#CAC4B7]/30 last:border-b-0 pb-6 last:pb-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#D9FF0A] rounded-full flex items-center justify-center font-semibold text-[#11190C]">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-[#11190C]">{review.author}</div>
                    <div className="text-sm text-[#787664]">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} />
                  {review.verified && (
                    <span className="text-xs bg-[#D9FF0A] text-[#11190C] px-2 py-1 rounded-full font-medium">
                      Verified
                    </span>
                  )}
                </div>
              </div>
              <p className="text-[#787664] leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#D9FF0A] text-[#11190C] font-semibold rounded-xl hover:bg-[#c4e600] transition-colors">
            Read All {vendor.reviewsCount} Reviews
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
