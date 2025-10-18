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
          What services do you need?
        </h3>
        <p className="text-wervice-taupe max-w-md mx-auto">
          Select all the services you'll need for your wedding. We'll recommend the best vendors in your area.
        </p>
      </div>

      {/* Essential Services */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-wervice-lime rounded-full"></div>
          <h4 className="font-medium text-wervice-ink">Essential Services</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {essentialServices.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedServices.includes(service.id);

            return (
              <button
                key={service.id}
                onClick={() => handleServiceToggle(service.id)}
                aria-pressed={isSelected}
                role="button"
                className={cn(
                  'p-6 border rounded-xl text-left transition-all hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wervice-lime h-full',
                  isSelected
                    ? 'bg-wervice-lime text-wervice-ink border-transparent shadow-soft'
                    : 'border-wv-gray3 bg-white hover:border-wervice-lime/50 text-wervice-ink'
                )}
              >
                <div className="flex items-start gap-4 h-full">
                  <div className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                    isSelected ? 'bg-wervice-ink text-wervice-lime' : 'bg-wv-gray2 text-wervice-taupe'
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold mb-1">{service.label}</h5>
                    <p className={cn(
                      'text-sm leading-relaxed',
                      isSelected ? 'text-wervice-ink/80' : 'text-wervice-taupe'
                    )}>
                      {service.description}
                    </p>
                  </div>
                  <div className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                    isSelected
                      ? 'border-transparent bg-wervice-ink'
                      : 'border-wv-gray3'
                  )}>
                    {isSelected && (
                      <span className="text-xs text-wervice-lime font-bold">✓</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Services */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <h4 className="font-medium text-wervice-ink">Additional Services</h4>
          <span className="text-sm text-wervice-taupe">Optional enhancements</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {additionalServices.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedServices.includes(service.id);

            return (
              <button
                key={service.id}
                onClick={() => handleServiceToggle(service.id)}
                aria-pressed={isSelected}
                role="button"
                className={cn(
                  'p-4 border rounded-xl text-left transition-all hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wervice-lime',
                  isSelected
                    ? 'bg-wervice-lime text-wervice-ink border-transparent shadow-soft'
                    : 'border-wv-gray3 bg-white hover:border-wervice-lime/50 text-wervice-ink'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                    isSelected ? 'bg-wervice-ink text-wervice-lime' : 'bg-wv-gray2 text-wervice-taupe'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{service.label}</h5>
                    <p className={cn(
                      'text-xs mt-1',
                      isSelected ? 'text-wervice-ink/80' : 'text-wervice-taupe'
                    )}>
                      {service.description}
                    </p>
                  </div>
                  <div className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0',
                    isSelected
                      ? 'border-transparent bg-wervice-ink'
                      : 'border-wv-gray3'
                  )}>
                    {isSelected && (
                      <span className="text-xs text-wervice-lime font-bold">✓</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.form>
  );
}
