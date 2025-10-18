'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, MapPin } from 'lucide-react';
import { VendorCarousel } from './VendorCarousel';
import type { OnboardingData } from '../schemas/onboarding.schemas';

interface StepSuggestionsProps {
  data: OnboardingData;
  currentStepData: any;
  onContinue: (data: any) => Promise<boolean>;
  onSkip: () => void;
  isSaving: boolean;
}

// Mock vendor data - in real app this would come from API
const mockVendors = [
  {
    id: '1',
    name: 'Palmera Garden Venue',
    location: 'Marrakech',
    rating: 4.8,
    reviewCount: 124,
    price: 150000,
    image: '/api/placeholder/400/300',
    category: 'venues',
  },
  {
    id: '2',
    name: 'Moroccan Moments Photography',
    location: 'Casablanca',
    rating: 4.9,
    reviewCount: 89,
    price: 25000,
    image: '/api/placeholder/400/300',
    category: 'photography',
  },
  {
    id: '3',
    name: 'Traditional Moroccan Catering',
    location: 'Rabat',
    rating: 4.7,
    reviewCount: 156,
    price: 35000,
    image: '/api/placeholder/400/300',
    category: 'catering',
  },
  {
    id: '4',
    name: 'Elegant Wedding Decor',
    location: 'Marrakech',
    rating: 4.6,
    reviewCount: 78,
    price: 20000,
    image: '/api/placeholder/400/300',
    category: 'decor',
  },
  {
    id: '5',
    name: 'Live Moroccan Music Band',
    location: 'Fes',
    rating: 4.8,
    reviewCount: 92,
    price: 15000,
    image: '/api/placeholder/400/300',
    category: 'music',
  },
  {
    id: '6',
    name: 'Luxury Bridal Salon',
    location: 'Casablanca',
    rating: 4.9,
    reviewCount: 145,
    price: 12000,
    image: '/api/placeholder/400/300',
    category: 'beauty',
  },
];

export function StepSuggestions({ data, currentStepData, onContinue, isSaving }: StepSuggestionsProps) {
  const [acknowledged, setAcknowledged] = useState(currentStepData?.acknowledged || false);

  const handleContinue = async () => {
    await onContinue({ acknowledged: true });
  };

  // Get relevant vendors based on user's selections
  const getRelevantVendors = () => {
    const servicesNeeded = data.servicesNeeded?.services || [];
    const userCity = data.city?.city;
    const userBudget = data.budgetCurrency?.budget || 0;

    return mockVendors.filter(vendor => {
      // Filter by services needed
      if (servicesNeeded.length > 0 && !servicesNeeded.includes(vendor.category as any)) {
        return false;
      }
      // Could add more filters based on city, budget, styles, etc.
      return true;
    }).slice(0, 6); // Show up to 6 vendors
  };

  const relevantVendors = getRelevantVendors();

  return (
    <motion.form
      id="step-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleContinue();
      }}
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-wervice-lime rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-wervice-ink" />
        </div>
        <h3 className="text-xl font-semibold text-wervice-ink">
          Personalized Suggestions
        </h3>
        <p className="text-wervice-taupe max-w-md mx-auto">
          Based on your preferences, here are some amazing vendors that match your wedding vision.
        </p>
      </div>

      {/* Vendor Carousel */}
      {relevantVendors.length > 0 ? (
        <VendorCarousel vendors={relevantVendors} />
      ) : (
        <div className="text-center py-12">
          <p className="text-wervice-taupe">
            We're gathering the perfect recommendations for you. Continue to see more options in your dashboard.
          </p>
        </div>
      )}

      {/* Acknowledgment */}
      <div className="space-y-4">
        <div className="bg-wv-gray1 border border-wv-gray3 rounded-lg p-6">
          <h4 className="font-medium text-wervice-ink mb-2">
            Ready to explore more?
          </h4>
          <p className="text-sm text-wervice-taupe mb-4">
            Your dashboard will have personalized recommendations, planning tools, and direct vendor contact.
          </p>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="w-5 h-5 text-wervice-lime bg-white border-wv-gray3 rounded focus:ring-wervice-lime focus:ring-2"
            />
            <span className="text-sm text-wervice-ink">
              I understand and want to proceed to my dashboard
            </span>
          </label>
        </div>
      </div>
    </motion.form>
  );
}
