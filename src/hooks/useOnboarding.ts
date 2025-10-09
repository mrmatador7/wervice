import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  getUserOnboardingData,
  getPersonalizedCategories,
  getPersonalizedCities,
  getPersonalizedBudgetFilter,
  shouldShowTimeline,
  shouldShowBudgetCalculator,
  getWeddingPlanningStage,
  getRecommendedCategories,
  getHeroPersonalization,
  type OnboardingData
} from '@/lib/personalization';

export function useOnboarding() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOnboardingData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          setLoading(false);
          return;
        }

        const data = await getUserOnboardingData(session.user.id);
        setOnboardingData(data);
      } catch (err) {
        console.error('Error fetching onboarding data:', err);
        setError('Failed to load preferences');
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        fetchOnboardingData();
      } else if (event === 'SIGNED_OUT') {
        setOnboardingData(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    onboardingData,
    loading,
    error,
    // Computed values
    personalizedCategories: onboardingData ? getPersonalizedCategories(onboardingData) : [],
    personalizedCities: onboardingData ? getPersonalizedCities(onboardingData) : [],
    budgetFilter: onboardingData ? getPersonalizedBudgetFilter(onboardingData) : null,
    showTimeline: onboardingData ? shouldShowTimeline(onboardingData) : false,
    showBudgetCalculator: onboardingData ? shouldShowBudgetCalculator(onboardingData) : false,
    planningStage: onboardingData ? getWeddingPlanningStage(onboardingData) : 'unknown',
    recommendedCategories: onboardingData ? getRecommendedCategories(onboardingData) : [],
    heroPersonalization: onboardingData ? getHeroPersonalization(onboardingData) : null,
    // Raw preferences
    hasCompletedOnboarding: onboardingData?.onboardingComplete ?? false,
    isPlanningWedding: onboardingData?.isPlanning ?? 'exploring',
    weddingDate: onboardingData?.weddingDate ?? null,
    budgetBand: onboardingData?.budgetBand ?? 'unknown',
    contactPreference: onboardingData?.contactPref ?? 'email',
    newsletterOptIn: onboardingData?.newsletterOptIn ?? false,
  };
}
