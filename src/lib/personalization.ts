import { createClient } from '@/lib/supabase-browser';

const supabase = createClient();

export interface OnboardingData {
  isPlanning: 'yes' | 'no' | 'exploring';
  cities: string[];
  weddingDate: string | null;
  budgetBand: string;
  languages: string[];
  categories: string[];
  styleVibes: string[];
  coverage: 'single' | 'multi' | 'all';
  contactPref: 'whatsapp' | 'email';
  partnerName?: string;
  newsletterOptIn: boolean;
  consentAccepted: boolean;
  onboardingComplete: boolean;
}

export async function getUserOnboardingData(userId: string): Promise<OnboardingData | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_data')
      .eq('id', userId)
      .single();

    if (error || !data?.onboarding_data) {
      return null;
    }

    return data.onboarding_data as unknown as OnboardingData;
  } catch (error) {
    console.error('Error fetching onboarding data:', error);
    return null;
  }
}

export function getPersonalizedCategories(onboardingData: OnboardingData): string[] {
  if (!onboardingData.categories || onboardingData.categories.length === 0) {
    return ['Venues', 'Catering', 'Photo & Video', 'Planning']; // Default popular categories
  }
  return onboardingData.categories;
}

export function getPersonalizedCities(onboardingData: OnboardingData): string[] {
  if (!onboardingData.cities || onboardingData.cities.length === 0) {
    return ['Marrakech', 'Casablanca', 'Rabat']; // Default popular cities
  }
  return onboardingData.cities;
}

export function getPersonalizedBudgetFilter(onboardingData: OnboardingData): string | null {
  if (!onboardingData.budgetBand || onboardingData.budgetBand === 'unknown') {
    return null;
  }
  return onboardingData.budgetBand;
}

export function shouldShowTimeline(onboardingData: OnboardingData): boolean {
  return onboardingData.weddingDate !== null;
}

export function shouldShowBudgetCalculator(onboardingData: OnboardingData): boolean {
  return onboardingData.budgetBand !== 'unknown' && onboardingData.budgetBand !== null;
}

export function getWeddingPlanningStage(onboardingData: OnboardingData): 'early' | 'planning' | 'ready' | 'unknown' {
  if (!onboardingData.isPlanning || onboardingData.isPlanning === 'exploring') {
    return 'unknown';
  }

  if (onboardingData.isPlanning === 'no') {
    return 'early';
  }

  if (onboardingData.weddingDate) {
    const weddingDate = new Date(onboardingData.weddingDate);
    const now = new Date();
    const monthsDiff = (weddingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);

    if (monthsDiff > 12) return 'early';
    if (monthsDiff > 3) return 'planning';
    return 'ready';
  }

  return 'planning';
}

export function getRecommendedCategories(onboardingData: OnboardingData): string[] {
  const stage = getWeddingPlanningStage(onboardingData);

  // Base categories everyone needs
  const baseCategories = ['Venues'];

  // Add categories based on planning stage
  switch (stage) {
    case 'early':
      return [...baseCategories, 'Planning'];
    case 'planning':
      return [...baseCategories, 'Catering', 'Photo & Video', 'Planning'];
    case 'ready':
      return [...baseCategories, 'Catering', 'Photo & Video', 'Decor', 'Music', 'Dresses'];
    default:
      return baseCategories;
  }
}

export function getHeroPersonalization(onboardingData: OnboardingData) {
  const stage = getWeddingPlanningStage(onboardingData);

  switch (stage) {
    case 'early':
      return {
        title: 'Start Your Wedding Journey',
        subtitle: 'Discover Morocco\'s finest wedding vendors',
        ctaText: 'Explore Vendors',
        highlightCities: onboardingData.cities.slice(0, 3),
      };
    case 'planning':
      return {
        title: 'Your Perfect Moroccan Wedding Awaits',
        subtitle: `${onboardingData.cities.length > 0 ? `Planning in ${onboardingData.cities[0]}` : 'Find the best vendors for your celebration'}`,
        ctaText: 'Browse Vendors',
        highlightCities: onboardingData.cities,
      };
    case 'ready':
      return {
        title: 'Final Touches for Your Special Day',
        subtitle: 'Complete your vendor lineup and make final arrangements',
        ctaText: 'View My Vendors',
        highlightCities: onboardingData.cities,
      };
    default:
      return {
        title: 'Plan your Moroccan wedding, your way.',
        subtitle: 'Find trusted vendors across Morocco.',
        ctaText: 'Plan Your Wedding',
        highlightCities: ['Marrakech', 'Casablanca', 'Rabat'],
      };
  }
}
