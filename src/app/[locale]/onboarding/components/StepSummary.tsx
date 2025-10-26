'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Palette,
  Star,
  Sparkles,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import type { OnboardingData } from '../schemas/onboarding.schemas';

interface StepSummaryProps {
  data: OnboardingData;
  currentStepData: any;
  onContinue: (data: any) => Promise<boolean>;
  onSkip: () => void;
  onComplete: () => Promise<boolean>;
  isSaving: boolean;
}

const WEDDING_STYLES: Record<string, string> = {
  modern: 'Modern',
  traditional: 'Traditional',
  luxury: 'Luxury',
  garden: 'Garden',
  beach: 'Beach',
  boho: 'Boho Chic',
  vintage: 'Vintage',
  minimalist: 'Minimalist',
};

const PRIORITIES: Record<string, string> = {
  venue: 'Venue',
  photography: 'Photography',
  decor: 'Décor',
  food: 'Food & Catering',
  music: 'Music & Entertainment',
  beauty: 'Beauty & Hair',
  dress: 'Wedding Dress',
  planner: 'Wedding Planner',
};

const SERVICES: Record<string, string> = {
  venues: 'Venues',
  catering: 'Catering',
  photography: 'Photography',
  beauty: 'Beauty & Hair',
  decor: 'Décor & Flowers',
  music: 'Music & Entertainment',
  planner: 'Wedding Planner',
  dresses: 'Wedding Dresses',
};

interface SuggestedVendor {
  id: string;
  business_name: string;
  category: string;
  city: string;
  starting_price: number;
  profile_photo_url: string;
  slug: string;
}

export function StepSummary({ data, onComplete, isSaving }: StepSummaryProps) {
  const [suggestedVendors, setSuggestedVendors] = useState<SuggestedVendor[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(true);

  const formatCurrency = (amount: number, currency = 'MAD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleComplete = async () => {
    await onComplete();
  };

  // Fetch vendor suggestions based on user data
  useEffect(() => {
    async function fetchSuggestions() {
      try {
        // Get user's selected services
        const services = data.servicesNeeded?.services || [];
        const city = data.city?.city;
        
        if (services.length === 0) {
          setLoadingVendors(false);
          return;
        }

        // Fetch vendors for each service category
        const vendorPromises = services.slice(0, 3).map(async (service) => {
          const params = new URLSearchParams({
            category: service,
            ...(city && { city }),
            limit: '2',
          });

          const response = await fetch(`/api/vendors?${params}`);
          if (response.ok) {
            const result = await response.json();
            return result.vendors || [];
          }
          return [];
        });

        const vendorResults = await Promise.all(vendorPromises);
        const allVendors = vendorResults.flat();
        
        // Remove duplicates and limit to 4 vendors
        const uniqueVendors = Array.from(
          new Map(allVendors.map((v: SuggestedVendor) => [v.id, v])).values()
        ).slice(0, 4);

        setSuggestedVendors(uniqueVendors as SuggestedVendor[]);
      } catch (error) {
        console.error('Error fetching vendor suggestions:', error);
      } finally {
        setLoadingVendors(false);
      }
    }

    fetchSuggestions();
  }, [data]);

  return (
    <motion.form
      id="step-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleComplete();
      }}
      className="max-w-md mx-auto space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon */}
      <div className="w-20 h-20 bg-gradient-to-br from-wervice-lime to-lime-400 rounded-full flex items-center justify-center mx-auto shadow-xl">
        <CheckCircle className="w-10 h-10 text-wervice-ink" />
      </div>

      {/* Title */}
      <div className="text-center space-y-3">
        <h3 className="text-3xl font-bold text-wervice-ink">
          You're All Set!
        </h3>
        <p className="text-gray-500 text-lg">
          Your personalized wedding journey awaits
        </p>
      </div>

      {/* Summary Info */}
      <div className="bg-gradient-to-br from-wv-gray1 to-white border border-wv-gray2 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {data.city && (
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <MapPin className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <div className="text-xs text-gray-500">Location</div>
              <div className="font-semibold text-sm text-wervice-ink capitalize">{data.city.city}</div>
            </div>
          )}

          {data.guests && (
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <Users className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <div className="text-xs text-gray-500">Guests</div>
              <div className="font-semibold text-sm text-wervice-ink">{data.guests.count}</div>
            </div>
          )}

          {data.date && (
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <div className="text-xs text-gray-500">Date</div>
              <div className="font-semibold text-sm text-wervice-ink">{formatDate(data.date.date).split(',')[0]}</div>
            </div>
          )}

          {data.budgetCurrency && (
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <DollarSign className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <div className="text-xs text-gray-500">Budget</div>
              <div className="font-semibold text-sm text-wervice-ink">
                {formatCurrency(data.budgetCurrency.budget, data.budgetCurrency.currency)}
              </div>
            </div>
          )}
        </div>

        {data.servicesNeeded?.services && data.servicesNeeded.services.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Services Selected</div>
            <div className="flex flex-wrap gap-2">
              {data.servicesNeeded.services.slice(0, 4).map(service => (
                <span key={service} className="px-3 py-1 bg-orange-50 text-orange-700 text-xs rounded-full font-medium">
                  {SERVICES[service]}
                </span>
              ))}
              {data.servicesNeeded.services.length > 4 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                  +{data.servicesNeeded.services.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Vendor Suggestions */}
      {suggestedVendors.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-bold text-wervice-ink text-lg text-center">
            🎯 Recommended Vendors for You
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {suggestedVendors.map((vendor) => (
              <Link
                key={vendor.id}
                href={`/en/vendors/${vendor.slug}`}
                className="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-wervice-lime transition-all hover:shadow-lg"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {vendor.profile_photo_url ? (
                    <img
                      src={vendor.profile_photo_url}
                      alt={vendor.business_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-wv-gray1 to-wv-gray2">
                      <Sparkles className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h5 className="font-semibold text-sm text-wervice-ink line-clamp-1 group-hover:text-wervice-lime transition-colors">
                    {vendor.business_name}
                  </h5>
                  <p className="text-xs text-gray-500 capitalize mt-1">
                    {vendor.category.replace('-', ' ')}
                  </p>
                  {vendor.starting_price && (
                    <p className="text-xs text-orange-600 font-medium mt-1">
                      From {formatCurrency(vendor.starting_price, data.budgetCurrency?.currency)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">
              More personalized recommendations available in your dashboard
            </p>
          </div>
        </div>
      )}

      {loadingVendors && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-wervice-lime border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Finding perfect vendors for you...</p>
        </div>
      )}

      {/* Success Message */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">🎉</span>
        </div>
        <h4 className="font-bold text-wervice-ink text-lg mb-2">
          Everything looks perfect!
        </h4>
        <p className="text-sm text-gray-600">
          Click "Explore" to start planning your dream wedding!
        </p>
      </div>
    </motion.form>
  );
}
