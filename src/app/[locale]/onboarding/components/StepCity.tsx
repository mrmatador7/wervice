'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { inputStyles } from '../utils/classes';
import type { OnboardingData } from '../schemas/onboarding.schemas';

interface StepCityProps {
  data: OnboardingData;
  currentStepData: any;
  onContinue: (data: any) => Promise<boolean>;
  onSkip: () => void;
  isSaving: boolean;
}

const MOROCCAN_CITIES = [
  { id: 'marrakech', name: 'Marrakech', description: 'The Red City - Traditional & magical', emoji: '🕌' },
  { id: 'casablanca', name: 'Casablanca', description: 'Modern & cosmopolitan', emoji: '🏙️' },
  { id: 'rabat', name: 'Rabat', description: 'Capital with royal charm', emoji: '👑' },
  { id: 'fes', name: 'Fes', description: 'Ancient medina & culture', emoji: '🏛️' },
  { id: 'tangier', name: 'Tangier', description: 'Coastal Mediterranean beauty', emoji: '🌊' },
  { id: 'meknes', name: 'Meknes', description: 'Historic imperial city', emoji: '🏰' },
  { id: 'el-jadida', name: 'El Jadida', description: 'Portuguese heritage', emoji: '⛱️' },
  { id: 'kenitra', name: 'Kenitra', description: 'Atlantic coast charm', emoji: '🌅' },
];

export function StepCity({ data, currentStepData, onContinue, isSaving }: StepCityProps) {
  const [selectedCity, setSelectedCity] = useState(currentStepData?.city || '');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = MOROCCAN_CITIES.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinue = async () => {
    if (!selectedCity) return;
    await onContinue({ city: selectedCity });
  };

  const handleCitySelect = (cityId: string) => {
    setSelectedCity(cityId);
  };

  return (
    <motion.form
      id="step-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleContinue();
      }}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-wervice-taupe w-5 h-5 pointer-events-none" />
        <input
          type="text"
          placeholder="Search for a city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 border border-wv-gray3 rounded-xl focus:ring-2 focus:ring-wervice-lime focus:border-transparent transition-all outline-none text-base bg-wv-gray1/30"
        />
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredCities.map((city, index) => {
          const isSelected = selectedCity === city.id;

          return (
            <motion.button
              key={city.id}
              type="button"
              onClick={() => handleCitySelect(city.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group p-5 border-2 rounded-xl text-left transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 ${
                isSelected
                  ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-600 shadow-md scale-[1.02]'
                  : 'border-wv-gray2 bg-white hover:border-indigo-200 hover:shadow-sm hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Emoji Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl transition-all ${
                  isSelected 
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg scale-110' 
                    : 'bg-wv-gray1 group-hover:bg-wv-gray2 group-hover:scale-105'
                }`}>
                  {city.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-base mb-1 ${isSelected ? 'text-indigo-900' : 'text-wervice-ink'}`}>
                    {city.name}
                  </h4>
                  <p className={`text-sm leading-relaxed ${
                    isSelected ? 'text-indigo-700' : 'text-wervice-taupe'
                  }`}>
                    {city.description}
                  </p>
                </div>

                {/* Checkmark */}
                {isSelected && (
                  <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-sm text-white font-bold">✓</span>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* No Results Message */}
      {filteredCities.length === 0 && searchQuery && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-wv-gray1 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-wervice-taupe" />
          </div>
          <p className="text-wervice-taupe">
            No cities found matching <span className="font-semibold">"{searchQuery}"</span>
          </p>
        </motion.div>
      )}
    </motion.form>
  );
}
