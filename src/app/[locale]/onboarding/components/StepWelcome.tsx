'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles, MapPin, Star } from 'lucide-react';
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

  return (
    <motion.form
      id="step-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleContinue();
      }}
      className="text-center space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mx-auto w-24 h-24 bg-wervice-lime rounded-full flex items-center justify-center"
      >
        <Heart className="w-12 h-12 text-wervice-ink" fill="currentColor" />
      </motion.div>

      {/* Main Heading */}
      <div className="space-y-4">
        <h2 className="text-4xl lg:text-5xl font-bold text-wervice-ink leading-tight">
          Welcome to Wervice
          <span className="inline-block ml-2">💐</span>
        </h2>
        <p className="text-xl text-wervice-taupe max-w-lg mx-auto leading-relaxed">
          Let's plan a wedding as beautiful as your story. We'll guide you through every step with personalized recommendations.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white border border-wv-gray3 rounded-xl p-6 shadow-card hover:shadow-cardHover transition-shadow">
          <div className="w-12 h-12 bg-wervice-lime/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-wervice-lime" />
          </div>
          <h3 className="font-semibold text-wervice-ink mb-2">Personalized Experience</h3>
          <p className="text-sm text-wervice-taupe">Get tailored recommendations based on your preferences and location.</p>
        </div>

        <div className="bg-white border border-wv-gray3 rounded-xl p-6 shadow-card hover:shadow-cardHover transition-shadow">
          <div className="w-12 h-12 bg-wervice-lime/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-wervice-lime" />
          </div>
          <h3 className="font-semibold text-wervice-ink mb-2">Local Expertise</h3>
          <p className="text-sm text-wervice-taupe">Connect with trusted Moroccan wedding professionals in your area.</p>
        </div>

        <div className="bg-white border border-wv-gray3 rounded-xl p-6 shadow-card hover:shadow-cardHover transition-shadow">
          <div className="w-12 h-12 bg-wervice-lime/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-wervice-lime" />
          </div>
          <h3 className="font-semibold text-wervice-ink mb-2">Smart Planning</h3>
          <p className="text-sm text-wervice-taupe">AI-powered suggestions and checklists to keep you organized.</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="pt-8">
        <div className="flex justify-center items-center gap-2 text-xs text-wervice-taupe">
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === 0 ? 'bg-wervice-lime' : 'bg-wv-gray3'
                }`}
              />
            ))}
          </div>
          <span className="ml-2">10 steps to your perfect wedding</span>
        </div>
      </div>
    </motion.form>
  );
}
