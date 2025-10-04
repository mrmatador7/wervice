'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { getProfile, upsertProfile } from '@/queries';
import { User } from '@supabase/supabase-js';
import Header from '@/components/layout/Header';

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
  const [user, setUser] = useState<User | null>(null);
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
    const onboardingTimestamp = new Date().toISOString();
    console.log(`[${onboardingTimestamp}] 📝 Onboarding page loaded:`, {
      hasSession: 'checking...',
      locale,
      url: window.location.href,
      searchParams: window.location.search
    });

    // Check if user is authenticated and not onboarded
    const checkAuth = async () => {
      const authStartTime = Date.now();
      const { data: { session } } = await supabase.auth.getSession();
      const authDuration = Date.now() - authStartTime;

      console.log(`[${new Date().toISOString()}] 🔐 Auth check completed in ${authDuration}ms:`, {
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null
      });

      if (!session) {
        console.log(`[${new Date().toISOString()}] ❌ No session found, redirecting to signin`);
        router.push(`/${locale}/auth/signin`);
        return;
      }

      setUser(session.user);

      // Get redirectTo parameter from URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectParam = urlParams.get('redirectTo');
      if (redirectParam) {
        setRedirectTo(redirectParam);
        console.log(`[${new Date().toISOString()}] 🔄 Will redirect to after onboarding:`, redirectParam);
      }

      // Check if user already has a profile
      console.log(`[${new Date().toISOString()}] 🔍 Checking existing profile for user:`, session.user.id);
      const profileStartTime = Date.now();
      const { data: profile, error } = await getProfile(session.user.id);
      const profileDuration = Date.now() - profileStartTime;

      console.log(`[${new Date().toISOString()}] 🔍 Profile check completed in ${profileDuration}ms:`, {
        profileExists: !!profile,
        profile: profile ? {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          user_type: profile.user_type,
          user_status: profile.user_status,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        } : null,
        error: error ? {
          message: error.message,
          code: error.code,
          details: error.details
        } : null
      });

      if (profile) {
        // User already has a profile, redirect to dashboard
        const destination = redirectParam || `/${locale}/dashboard`;
        console.log(`[${new Date().toISOString()}] ✅ User already has profile, redirecting to:`, {
          destination,
          redirectReason: 'Profile already exists',
          profileAge: profile.created_at ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / 1000 / 60) + ' minutes old' : 'unknown'
        });
        router.push(destination);
        return;
      }

      console.log(`[${new Date().toISOString()}] 📝 User needs profile creation, showing onboarding form`);
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

    const completionTimestamp = new Date().toISOString();
    console.log(`[${completionTimestamp}] 🚀 Starting onboarding completion process:`, {
      userId: user.id,
      formData: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        bio: formData.bio ? formData.bio.substring(0, 50) + '...' : null
      }
    });

    setIsLoading(true);

    try {
      // Create/update profile with onboarding data
      console.log(`[${new Date().toISOString()}] 💾 Creating/updating profile...`);
      const profileStartTime = Date.now();

      const { data: newProfile, error } = await upsertProfile({
        id: user.id,
        ...formData
      });

      const profileDuration = Date.now() - profileStartTime;

      if (error) {
        console.error(`[${new Date().toISOString()}] ❌ Error creating profile:`, {
          error: error.message,
          code: error.code,
          details: error.details,
          duration: profileDuration + 'ms'
        });
        return;
      }

      console.log(`[${new Date().toISOString()}] ✅ Profile created/updated successfully in ${profileDuration}ms:`, {
        profileId: newProfile?.id,
        operation: newProfile?.created_at === newProfile?.updated_at ? 'CREATED' : 'UPDATED',
        profile: newProfile ? {
          first_name: newProfile.first_name,
          last_name: newProfile.last_name,
          email: newProfile.email,
          user_type: newProfile.user_type,
          user_status: newProfile.user_status
        } : null
      });

      // Redirect to dashboard (onboarding is complete)
      const destination = `/${locale}/dashboard`;
      console.log(`[${new Date().toISOString()}] 🎯 Onboarding completed, redirecting to:`, {
        destination,
        currentPath: window.location.pathname,
        completionTime: new Date().toISOString(),
        totalProcessTime: Date.now() - new Date(completionTimestamp).getTime() + 'ms'
      });

      // Use window.location for more reliable redirect
      window.location.href = destination;
    } catch (error) {
      console.error(`[${new Date().toISOString()}] 💥 Unexpected error during onboarding completion:`, error);
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
        <Header />

        {/* Progress Indicator */}
        <div className="pt-16 pb-8">
          <div className="max-w-md mx-auto px-4">
            <div className="flex justify-center space-x-2 mb-8">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step <= currentStep
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
