'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { ProfileService } from '@/lib/profile';
import GlassmorphismHeader from '@/components/GlassmorphismHeader';

interface OnboardingData {
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  country: string;
  locale: string;
  bio: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const locale = useLocale();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [redirectTo, setRedirectTo] = useState<string>('');

  const [formData, setFormData] = useState<OnboardingData>({
    first_name: '',
    last_name: '',
    phone: '',
    city: '',
    country: 'Morocco',
    locale: locale,
    bio: ''
  });

  useEffect(() => {
    // Check if user is authenticated and not onboarded
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push(`/${locale}/auth/signin`);
        return;
      }

      setUser(session.user);

      // Get redirectTo parameter from URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectParam = urlParams.get('redirectTo');
      if (redirectParam) {
        setRedirectTo(redirectParam);
      }

      // Check if already onboarded
      const { data: profile } = await ProfileService.getProfile(session.user.id);
      if (profile?.is_onboarded) {
        // If already onboarded, redirect to the intended destination or dashboard
        const destination = redirectParam || `/${locale}/dashboard`;
        router.push(destination);
        return;
      }
    };

    checkAuth();
  }, [router, locale]);

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Update profile with onboarding data
      const { error } = await ProfileService.updateProfile(user.id, {
        ...formData,
        is_onboarded: true
      });

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      console.log('✅ Onboarding completed successfully');

      // Redirect to the intended destination or dashboard
      const destination = redirectTo || `/${locale}/dashboard`;
      router.push(destination);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Wervice! 🎉</h2>
              <p className="text-gray-600">Let's set up your profile to get started</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact Information</h2>
              <p className="text-gray-600">Help us connect with you</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  placeholder="+212 XX XX XX XX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                >
                  <option value="">Select your city</option>
                  <option value="Casablanca">Casablanca</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Tangier">Tangier</option>
                  <option value="Agadir">Agadir</option>
                  <option value="Fes">Fes</option>
                  <option value="Meknes">Meknes</option>
                  <option value="El Jadida">El Jadida</option>
                  <option value="Kenitra">Kenitra</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  placeholder="Morocco"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
              <p className="text-gray-600">Share a bit about your wedding plans</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio (Optional)</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent h-32 resize-none"
                  placeholder="Tell us about your wedding plans or anything you'd like to share..."
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
              </div>
            </div>

            <div className="bg-lime-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 What's next?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Discover amazing wedding vendors in Morocco</li>
                <li>• Get personalized recommendations</li>
                <li>• Plan your perfect wedding day</li>
                <li>• Connect with trusted professionals</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Beautiful Moroccan wedding scene"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <GlassmorphismHeader />

        {/* Progress Indicator */}
        <div className="pt-16 pb-8">
          <div className="max-w-md mx-auto px-4">
            <div className="flex justify-center space-x-2 mb-8">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step <= currentStep
                      ? 'bg-lime-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex items-center justify-center px-4 pb-8">
          <div className="max-w-md w-full">
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    disabled={isLoading}
                    className="px-6 py-3 bg-lime-500 text-white rounded-lg hover:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Completing...' : 'Complete Setup'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
