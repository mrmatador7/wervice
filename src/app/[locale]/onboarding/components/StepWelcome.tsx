'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles, MapPin, Calendar, CheckCircle2, Palette } from 'lucide-react';
import type { OnboardingData } from '../schemas/onboarding.schemas';

interface StepWelcomeProps {
  data: OnboardingData;
  currentStepData: any;
  onContinue: (data: any) => Promise<boolean>;
  onSkip: () => void;
  isSaving: boolean;
}

export function StepWelcome({ onContinue, isSaving }: StepWelcomeProps) {
  const handleContinue = async () => {
    await onContinue({ started: true });
  };

  const features = [
    {
      icon: Sparkles,
      title: 'Personalized',
      description: 'Tailored recommendations just for you'
    },
    {
      icon: MapPin,
      title: 'Local Vendors',
      description: 'Trusted Moroccan professionals'
    },
    {
      icon: Calendar,
      title: 'Smart Planning',
      description: 'Organized timeline & checklist'
    },
    {
      icon: Palette,
      title: 'Style Match',
      description: 'Find your perfect wedding aesthetic'
    }
  ];

  return (
    <motion.form
      id="step-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleContinue();
      }}
      className="space-y-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <div className="text-center space-y-6">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="mx-auto w-20 h-20 bg-gradient-to-br from-wervice-lime to-lime-400 rounded-full flex items-center justify-center shadow-xl shadow-wervice-lime/20"
        >
          <Heart className="w-10 h-10 text-wervice-ink" fill="currentColor" />
        </motion.div>

        {/* Heading */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-wervice-ink leading-tight">
            Let's Plan Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Dream Wedding
            </span>
            <span className="inline-block ml-2">💐</span>
          </h2>
          <p className="text-lg text-wervice-taupe max-w-2xl mx-auto leading-relaxed">
            In just 10 quick steps, we'll personalize your wedding planning experience
            and connect you with the perfect vendors.
          </p>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-gradient-to-br from-wv-gray1 to-white border border-wv-gray2 rounded-xl p-5 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white border border-wv-gray2 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:border-wervice-lime/50 transition-colors">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-wervice-ink mb-1">{feature.title}</h3>
                  <p className="text-sm text-wervice-taupe leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Time Estimate */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center pt-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-full">
          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-900">
            Takes only 3-5 minutes
          </span>
        </div>
      </motion.div>
    </motion.form>
  );
}
