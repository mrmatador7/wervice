'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface OnboardingOverlayProps {
  userName: string;
  userEmail: string;
  locale: string;
}

interface OnboardingData {
  eventDate?: string;
  guestCount?: number;
  budget?: string;
  city?: string;
  categories?: string[];
  style?: string[];
}

export default function OnboardingOverlay({ userName, userEmail, locale }: OnboardingOverlayProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [tasksCompleted, setTasksCompleted] = useState(0);

  const steps = [
    {
      id: 'welcome',
      title: `Hello, ${userName.split(' ')[0]}! 👋`,
      subtitle: "Let's plan your perfect Moroccan wedding",
      component: WelcomeStep
    },
    {
      id: 'date',
      title: "When's the big day?",
      subtitle: "Help us find the best vendors for your timeline",
      component: DateStep
    },
    {
      id: 'guests',
      title: "How many guests?",
      subtitle: "This helps us recommend the right venues",
      component: GuestsStep
    },
    {
      id: 'budget',
      title: "What's your budget?",
      subtitle: "We'll show you vendors that match",
      component: BudgetStep
    },
    {
      id: 'city',
      title: "Where are you planning?",
      subtitle: "Choose your preferred city",
      component: CityStep
    },
    {
      id: 'categories',
      title: "What do you need?",
      subtitle: "Select the services you're looking for",
      component: CategoriesStep
    },
    {
      id: 'style',
      title: "What's your style?",
      subtitle: "Help us personalize your recommendations",
      component: StyleStep
    },
    {
      id: 'complete',
      title: "You're all set!",
      subtitle: "Let's find your perfect vendors",
      component: CompleteStep
    }
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = (data?: Partial<OnboardingData>) => {
    if (data) {
      setOnboardingData(prev => ({ ...prev, ...data }));
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setTasksCompleted(prev => prev + 1);
    } else {
      // Save to database and redirect to dashboard
      saveOnboardingData();
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      if (tasksCompleted > 0) {
        setTasksCompleted(prev => prev - 1);
      }
    }
  };

  const saveOnboardingData = async () => {
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData)
      });
      router.push(`/${locale}/vendors`);
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
      router.push(`/${locale}/vendors`);
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-purple-50 to-blue-50 overflow-y-auto">
      <div className="min-h-full p-8 flex flex-col">
        {/* Header - Back Button & Task Counter */}
        <div className="flex items-center justify-between mb-6">
          {/* Back Button */}
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-semibold">Back</span>
            </button>
          )}
          
          {/* Spacer when no back button */}
          {currentStep === 0 && <div></div>}
          
          {/* Task Counter */}
          <div className="bg-wervice-lime rounded-full w-12 h-12 flex items-center justify-center">
            <span className="text-lg font-bold text-black">{tasksCompleted}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {/* Step Title */}
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {steps[currentStep].title}
                </h1>
                <p className="text-base text-gray-600">
                  {steps[currentStep].subtitle}
                </p>
              </div>

              {/* Step Component */}
              <div className="flex-1 overflow-y-auto">
                <CurrentStepComponent 
                  onNext={handleNext}
                  onSkip={handleSkip}
                  data={onboardingData}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'w-8 bg-wervice-lime' 
                  : index < currentStep
                  ? 'w-2 bg-gray-400'
                  : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Step Components
function WelcomeStep({ onNext }: any) {
  return (
    <div className="space-y-4">
      {/* Card 1 */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl p-6 cursor-pointer"
        onClick={() => onNext()}
      >
        <div className="flex items-center gap-4">
          <div className="text-4xl">📝</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Quick Setup</h3>
            <p className="text-sm text-gray-600">Get started in 2 minutes</p>
          </div>
        </div>
      </motion.div>

      {/* Card 2 */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-6 cursor-pointer"
        onClick={() => onNext()}
      >
        <div className="flex items-center gap-4">
          <div className="text-4xl">🎯</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Personalized</h3>
            <p className="text-sm text-gray-600">Vendors matched to you</p>
          </div>
        </div>
      </motion.div>

      {/* Card 3 */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl p-6 cursor-pointer"
        onClick={() => onNext()}
      >
        <div className="flex items-center gap-4">
          <div className="text-4xl">✨</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Easy Planning</h3>
            <p className="text-sm text-gray-600">All in one place</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DateStep({ onNext, onSkip }: any) {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex-1 flex items-start pt-12">
        <div className="w-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-gray-200">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full text-xl font-semibold py-4 border-0 focus:ring-0 outline-none bg-transparent"
            placeholder="dd/mm/yyyy"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between pb-8 pt-8 mt-8">
        <button
          onClick={onSkip}
          className="text-lg text-gray-600 font-semibold hover:text-gray-900 transition-colors"
        >
          Skip
        </button>
        <button
          onClick={() => onNext({ eventDate: selectedDate })}
          disabled={!selectedDate}
          className="text-lg text-gray-900 font-bold hover:text-black disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function GuestsStep({ onNext, onSkip }: any) {
  const [guestCount, setGuestCount] = useState<number | null>(null);

  const guestRanges = [
    { label: '< 50 Guests', value: 50 },
    { label: '50-100 Guests', value: 100 },
    { label: '100-200 Guests', value: 200 },
    { label: '200-300 Guests', value: 300 },
    { label: '300+ Guests', value: 400 }
  ];

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex-1 flex items-start justify-center pt-12">
        <div className="w-full max-w-xl space-y-3">
          {guestRanges.map((range) => (
            <motion.button
              key={range.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setGuestCount(range.value)}
              className={`w-full rounded-3xl transition-all border-2 ${
                guestCount === range.value
                  ? 'shadow-lg'
                  : 'bg-white/70 backdrop-blur-sm border-gray-200 hover:shadow-md'
              }`}
              style={{
                backgroundColor: guestCount === range.value ? '#D9FF0A' : undefined,
                borderColor: guestCount === range.value ? '#D9FF0A' : undefined
              }}
            >
              <div className="flex items-center p-6">
                <span className="text-xl font-bold text-black italic uppercase tracking-wide">
                  {range.label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pb-8 pt-4">
        <button
          onClick={onSkip}
          className="text-lg text-gray-600 font-semibold hover:text-gray-900 transition-colors"
        >
          Skip
        </button>
        <button
          onClick={() => onNext({ guestCount: guestCount || 100 })}
          disabled={!guestCount}
          className="text-lg text-gray-900 font-bold hover:text-black disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function BudgetStep({ onNext, onSkip }: any) {
  const [budget, setBudget] = useState('');

  const budgetRanges = [
    { label: 'Under 100K MAD', value: '< 100k' },
    { label: '100K - 250K MAD', value: '100k-250k' },
    { label: '250K - 500K MAD', value: '250k-500k' },
    { label: '500K+ MAD', value: '500k+' }
  ];

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex-1 flex items-start justify-center pt-12">
        <div className="w-full max-w-xl space-y-3">
          {budgetRanges.map((range) => (
            <motion.button
              key={range.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setBudget(range.value)}
              className={`w-full rounded-3xl transition-all border-2 ${
                budget === range.value
                  ? 'shadow-lg'
                  : 'bg-white/70 backdrop-blur-sm border-gray-200 hover:shadow-md'
              }`}
              style={{
                backgroundColor: budget === range.value ? '#D9FF0A' : undefined,
                borderColor: budget === range.value ? '#D9FF0A' : undefined
              }}
            >
              <div className="flex items-center p-6">
                <span className="text-xl font-bold text-black italic uppercase tracking-wide">
                  {range.label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pb-8 pt-4">
        <button
          onClick={onSkip}
          className="text-lg text-gray-600 font-semibold hover:text-gray-900 transition-colors"
        >
          Skip
        </button>
        <button
          onClick={() => onNext({ budget })}
          disabled={!budget}
          className="text-lg text-gray-900 font-bold hover:text-black disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function CityStep({ onNext, onSkip }: any) {
  const [city, setCity] = useState('');

  const leftCities = [
    'Marrakech',
    'Casablanca',
    'Rabat',
    'Fez'
  ];

  const rightCities = [
    'Tangier',
    'Agadir',
    'Meknes',
    'El Jadida',
    'Kenitra'
  ];

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex-1 flex items-start justify-center pt-8">
        <div className="flex gap-4 max-w-3xl">
          {/* Left Column - 4 cities */}
          <div className="flex-1 space-y-3">
            {leftCities.map((cityName) => (
              <motion.button
                key={cityName}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCity(cityName)}
                className={`w-full px-6 py-4 rounded-xl text-left text-base font-semibold transition-all border-2 ${
                  city === cityName 
                    ? 'shadow-lg' 
                    : 'bg-white/70 backdrop-blur-sm border-gray-200 hover:shadow-md'
                }`}
                style={{
                  backgroundColor: city === cityName ? '#D9FF0A' : undefined,
                  borderColor: city === cityName ? '#D9FF0A' : undefined
                }}
              >
                <span className="text-black">{cityName}</span>
              </motion.button>
            ))}
          </div>

          {/* Right Column - 5 cities */}
          <div className="flex-1 space-y-3">
            {rightCities.map((cityName) => (
              <motion.button
                key={cityName}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCity(cityName)}
                className={`w-full px-6 py-4 rounded-xl text-left text-base font-semibold transition-all border-2 ${
                  city === cityName 
                    ? 'shadow-lg' 
                    : 'bg-white/70 backdrop-blur-sm border-gray-200 hover:shadow-md'
                }`}
                style={{
                  backgroundColor: city === cityName ? '#D9FF0A' : undefined,
                  borderColor: city === cityName ? '#D9FF0A' : undefined
                }}
              >
                <span className="text-black">{cityName}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pb-8 pt-4">
        <button
          onClick={onSkip}
          className="text-lg text-gray-600 font-semibold hover:text-gray-900 transition-colors"
        >
          Skip
        </button>
        <button
          onClick={() => onNext({ city })}
          disabled={!city}
          className="text-lg text-gray-900 font-bold hover:text-black disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function CategoriesStep({ onNext, onSkip }: any) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    { name: 'Venues', icon: '/categories/venues.png' },
    { name: 'Catering', icon: '/categories/Catering.png' },
    { name: 'Photo & Video', icon: '/categories/photo.png' },
    { name: 'Event Planner', icon: '/categories/Event Planner.png' },
    { name: 'Beauty', icon: '/categories/beauty.png' },
    { name: 'Decor', icon: '/categories/decor.png' },
    { name: 'Music', icon: '/categories/music.png' },
    { name: 'Dresses', icon: '/categories/Dresses.png' }
  ];

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex-1 flex items-start justify-center pt-8 overflow-y-auto">
        <div className="w-full max-w-2xl space-y-2">
          {categories.map((category) => (
            <motion.button
              key={category.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleCategory(category.name)}
              className={`w-full rounded-3xl transition-all border-2 ${
                selectedCategories.includes(category.name)
                  ? 'shadow-lg'
                  : 'bg-white/70 backdrop-blur-sm border-gray-200 hover:shadow-md'
              }`}
              style={{
                backgroundColor: selectedCategories.includes(category.name) ? '#D9FF0A' : undefined,
                borderColor: selectedCategories.includes(category.name) ? '#D9FF0A' : undefined
              }}
            >
              <div className="flex items-center justify-between p-4">
                <span className="text-lg font-bold text-black italic uppercase tracking-wide">
                  {category.name}
                </span>
                <img src={category.icon} alt={category.name} className="w-16 h-16 object-contain" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pb-8 pt-4">
        <button
          onClick={onSkip}
          className="text-lg text-gray-600 font-semibold hover:text-gray-900 transition-colors"
        >
          Skip
        </button>
        <button
          onClick={() => onNext({ categories: selectedCategories })}
          disabled={selectedCategories.length === 0}
          className="text-lg text-gray-900 font-bold hover:text-black disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function StyleStep({ onNext, onSkip }: any) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const styles = [
    { name: 'Traditional', description: 'Classic Moroccan wedding' },
    { name: 'Modern', description: 'Contemporary & chic' },
    { name: 'Rustic', description: 'Natural & organic' },
    { name: 'Luxury', description: 'Elegant & opulent' },
    { name: 'Bohemian', description: 'Free-spirited & artistic' },
    { name: 'Beach', description: 'Coastal & relaxed' }
  ];

  const toggleStyle = (styleName: string) => {
    setSelectedStyles(prev =>
      prev.includes(styleName)
        ? prev.filter(s => s !== styleName)
        : [...prev, styleName]
    );
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex-1 flex items-start justify-center pt-8 overflow-y-auto">
        <div className="w-full max-w-2xl space-y-3">
          {styles.map((style) => (
            <motion.button
              key={style.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleStyle(style.name)}
              className={`w-full rounded-3xl transition-all border-2 ${
                selectedStyles.includes(style.name)
                  ? 'shadow-lg'
                  : 'bg-white/70 backdrop-blur-sm border-gray-200 hover:shadow-md'
              }`}
              style={{
                backgroundColor: selectedStyles.includes(style.name) ? '#D9FF0A' : undefined,
                borderColor: selectedStyles.includes(style.name) ? '#D9FF0A' : undefined
              }}
            >
              <div className="flex items-center justify-between p-6">
                <div className="text-left">
                  <div className="text-xl font-bold text-black italic uppercase tracking-wide">
                    {style.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{style.description}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pb-8 pt-4">
        <button
          onClick={onSkip}
          className="text-lg text-gray-600 font-semibold hover:text-gray-900 transition-colors"
        >
          Skip
        </button>
        <button
          onClick={() => onNext({ style: selectedStyles })}
          disabled={selectedStyles.length === 0}
          className="text-lg text-gray-900 font-bold hover:text-black disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function CompleteStep({ onNext }: any) {
  return (
    <div className="max-w-2xl mx-auto space-y-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="w-32 h-32 mx-auto bg-wervice-lime rounded-full flex items-center justify-center"
      >
        <svg className="w-16 h-16 text-black" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </motion.div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Perfect! Your profile is ready 🎉
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          We've found amazing vendors that match your preferences
        </p>
      </div>

      <button
        onClick={() => onNext()}
        className="px-12 py-4 bg-wervice-lime text-black font-bold text-lg rounded-2xl hover:brightness-95 transition-all shadow-lg"
      >
        Start Exploring Vendors
      </button>
    </div>
  );
}

