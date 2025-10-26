'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Utensils,
  Camera,
  Sparkles,
  Music,
  Scissors,
  Heart,
  ClipboardList
} from 'lucide-react';
import { cn } from '../utils/classes';
import type { OnboardingData, WeddingService } from '../schemas/onboarding.schemas';

interface StepServicesNeededProps {
  data: OnboardingData;
  currentStepData: any;
  onContinue: (data: any) => Promise<boolean>;
  onSkip: () => void;
  isSaving: boolean;
}

const WEDDING_SERVICES: Array<{
  id: WeddingService;
  label: string;
  icon: any;
  description: string;
  essential: boolean;
}> = [
  {
    id: 'venues',
    label: 'Venues',
    icon: MapPin,
    description: 'Wedding locations and ceremony spaces',
    essential: true,
  },
  {
    id: 'catering',
    label: 'Catering',
    icon: Utensils,
    description: 'Food, beverages, and dining services',
    essential: true,
  },
  {
    id: 'photography',
    label: 'Photography',
    icon: Camera,
    description: 'Capture your special moments',
    essential: true,
  },
  {
    id: 'beauty',
    label: 'Beauty & Hair',
    icon: Scissors,
    description: 'Makeup artists and hair stylists',
    essential: false,
  },
  {
    id: 'decor',
    label: 'Décor & Flowers',
    icon: Sparkles,
    description: 'Florists and wedding decorators',
    essential: false,
  },
  {
    id: 'music',
    label: 'Music & Entertainment',
    icon: Music,
    description: 'DJ, bands, and entertainment',
    essential: false,
  },
  {
    id: 'planner',
    label: 'Wedding Planner',
    icon: ClipboardList,
    description: 'Professional coordination services',
    essential: false,
  },
  {
    id: 'dresses',
    label: 'Wedding Dresses',
    icon: Heart,
    description: 'Bridal wear and accessories',
    essential: false,
  },
];

export function StepServicesNeeded({ data, currentStepData, onContinue, isSaving }: StepServicesNeededProps) {
  const [selectedServices, setSelectedServices] = useState<WeddingService[]>(
    currentStepData?.services || ['venues', 'catering', 'photography']
  );

  const handleServiceToggle = (serviceId: WeddingService) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleContinue = async () => {
    await onContinue({ services: selectedServices });
  };

  const essentialServices = WEDDING_SERVICES.filter(service => service.essential);
  const additionalServices = WEDDING_SERVICES.filter(service => !service.essential);

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
          What services do you need?
        </h3>
        <p className="text-gray-500">
          Select all services you'll need for your wedding
        </p>
      </div>

      {/* Services Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {WEDDING_SERVICES.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedServices.includes(service.id);

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => handleServiceToggle(service.id)}
                className={`p-4 border-2 rounded-xl text-center transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-orange-50 to-white border-orange-500 shadow-md'
                    : 'border-gray-200 bg-white hover:border-orange-200'
                }`}
              >
                <Icon className={`w-7 h-7 mx-auto mb-2 ${isSelected ? 'text-orange-500' : 'text-gray-400'}`} />
                <div className="font-medium text-sm text-wervice-ink">{service.label}</div>
                {isSelected && (
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mx-auto mt-2">
                    <span className="text-xs text-white font-bold">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Count */}
        {selectedServices.length > 0 && (
          <div className="bg-gradient-to-r from-wv-gray1 to-white border border-wv-gray2 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">
              <span className="font-bold text-wervice-ink">{selectedServices.length}</span> service{selectedServices.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </div>
    </motion.form>
  );
}
