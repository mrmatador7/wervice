import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();
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
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          setLoading(false);
          return;
        }

        const data = await getUserOnboardingData(user.id);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        await fetchOnboardingData();
      } else if (event === 'SIGNED_OUT') {
        setOnboardingData(null);
        setLoading(false);
      } else if (event === 'TOKEN_REFRESHED') {
        // Re-fetch data on token refresh to ensure we have fresh data
        await fetchOnboardingData();
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
