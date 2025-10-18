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
  { id: 'marrakech', name: 'Marrakech', description: 'The Red City - Traditional and magical' },
  { id: 'casablanca', name: 'Casablanca', description: 'Modern cosmopolitan city' },
  { id: 'rabat', name: 'Rabat', description: 'Capital city with royal charm' },
  { id: 'fes', name: 'Fes', description: 'Ancient medina and cultural heritage' },
  { id: 'tangier', name: 'Tangier', description: 'Coastal city with European influence' },
  { id: 'meknes', name: 'Meknes', description: 'Historic imperial city' },
  { id: 'el-jadida', name: 'El Jadida', description: 'Portuguese colonial architecture' },
  { id: 'kenitra', name: 'Kenitra', description: 'Modern city on the Atlantic coast' },
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
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Search */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wervice-taupe w-5 h-5" />
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputStyles.base} pl-10`}
          />
        </div>
      </div>

      {/* Cities Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCities.map((city) => {
            const isSelected = selectedCity === city.id;

            return (
              <button
                key={city.id}
                type="button"
                onClick={() => handleCitySelect(city.id)}
                className={`p-6 border rounded-xl text-left transition-all hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wervice-lime ${
                  isSelected
                    ? 'bg-wervice-lime text-wervice-ink border-transparent shadow-soft'
                    : 'border-wv-gray3 bg-white hover:border-wervice-lime/50 text-wervice-ink'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-wervice-ink text-wervice-lime' : 'bg-wv-gray2 text-wervice-taupe'
                  }`}>
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1">{city.name}</h4>
                    <p className={`text-sm leading-relaxed ${
                      isSelected ? 'text-wervice-ink/80' : 'text-wervice-taupe'
                    }`}>
                      {city.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-wervice-ink rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-wervice-lime font-bold">✓</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {filteredCities.length === 0 && searchQuery && (
          <div className="text-center py-8 text-wervice-taupe">
            No cities found matching "{searchQuery}"
          </div>
        )}
      </div>
    </motion.form>
  );
}
