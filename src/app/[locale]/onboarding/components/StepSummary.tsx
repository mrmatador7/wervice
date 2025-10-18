'use client';

import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Palette,
  Star,
  Sparkles,
  CheckCircle
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

export function StepSummary({ data, onComplete, isSaving }: StepSummaryProps) {
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

  return (
    <motion.form
      id="step-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleComplete();
      }}
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-wervice-lime rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-wervice-ink" />
        </div>
        <h3 className="text-xl font-semibold text-wervice-ink">
          Ready to start planning?
        </h3>
        <p className="text-wervice-taupe max-w-md mx-auto">
          Review your preferences and let's begin your wedding journey.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6">
        {/* Basic Info */}
        {data.basicInfo && (
          <SummaryCard
            icon={<Users className="w-5 h-5" />}
            title="Planning Details"
            items={[
              data.basicInfo.partnerName ? `Partner: ${data.basicInfo.partnerName}` : undefined,
              `Intent: ${data.basicInfo.intent === 'planning' ? 'Actively Planning' :
                       data.basicInfo.intent === 'exploring' ? 'Exploring Options' : 'Wedding Vendor'}`,
            ].filter((item): item is string => item !== undefined)}
          />
        )}

        {/* Wedding City */}
        {data.city && (
          <SummaryCard
            icon={<MapPin className="w-5 h-5" />}
            title="Wedding Location"
            items={[data.city.city]}
          />
        )}

        {/* Wedding Date */}
        {data.date && (
          <SummaryCard
            icon={<Calendar className="w-5 h-5" />}
            title="Wedding Date"
            items={[formatDate(data.date.date)]}
          />
        )}

        {/* Guest Count */}
        {data.guests && (
          <SummaryCard
            icon={<Users className="w-5 h-5" />}
            title="Guest Count"
            items={[`${data.guests.count} guests`]}
          />
        )}

        {/* Budget */}
        {data.budgetCurrency && (
          <SummaryCard
            icon={<DollarSign className="w-5 h-5" />}
            title="Budget"
            items={[formatCurrency(data.budgetCurrency.budget, data.budgetCurrency.currency)]}
          />
        )}

        {/* Wedding Styles */}
        {data.stylePriorities?.styles && data.stylePriorities.styles.length > 0 && (
          <SummaryCard
            icon={<Palette className="w-5 h-5" />}
            title="Wedding Styles"
            items={data.stylePriorities.styles.map(style => WEDDING_STYLES[style] || style)}
          />
        )}

        {/* Top Priorities */}
        {data.stylePriorities?.topPriorities && data.stylePriorities.topPriorities.length > 0 && (
          <SummaryCard
            icon={<Star className="w-5 h-5" />}
            title="Top Priorities"
            items={data.stylePriorities.topPriorities.map(priority => PRIORITIES[priority] || priority)}
          />
        )}

        {/* Services Needed */}
        {data.servicesNeeded?.services && data.servicesNeeded.services.length > 0 && (
          <SummaryCard
            icon={<Sparkles className="w-5 h-5" />}
            title="Services Needed"
            items={data.servicesNeeded.services.map(service => SERVICES[service] || service)}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="bg-wervice-lime/5 border border-wervice-lime/20 rounded-lg p-6 text-center space-y-4">
        <h4 className="font-semibold text-wervice-ink">
          Everything looks perfect!
        </h4>
        <p className="text-sm text-wervice-taupe">
          Your personalized dashboard is ready with recommendations, planning tools, and vendor connections.
        </p>

      </div>
    </motion.form>
  );
}

function SummaryCard({
  icon,
  title,
  items
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="bg-white border border-wv-gray3 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-wervice-lime/10 rounded-lg flex items-center justify-center text-wervice-lime">
          {icon}
        </div>
        <h4 className="font-semibold text-wervice-ink">{title}</h4>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 bg-wervice-lime rounded-full flex-shrink-0" />
            <span className="text-wervice-ink">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
