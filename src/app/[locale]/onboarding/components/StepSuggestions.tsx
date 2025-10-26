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
      className="max-w-md mx-auto space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon */}
      <div className="w-16 h-16 bg-gradient-to-br from-wervice-lime to-lime-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
        <Sparkles className="w-8 h-8 text-wervice-ink" />
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-wervice-ink">
          Personalized Suggestions
        </h3>
        <p className="text-gray-500">
          Based on your preferences, we've curated vendors for you
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-wv-gray1 to-white border border-wv-gray2 rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Star className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h4 className="font-semibold text-wervice-ink mb-2">
              Ready to explore?
            </h4>
            <p className="text-sm text-gray-600">
              Your dashboard will have personalized recommendations, planning tools, and direct vendor contact.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="w-4 h-4 text-orange-500" />
          <span>Local vendors in {data.city?.city || 'your area'}</span>
        </div>
      </div>

      {/* Hidden checkbox for form validation */}
      <input type="hidden" value={acknowledged ? 'true' : 'false'} />
    </motion.form>
  );
}
