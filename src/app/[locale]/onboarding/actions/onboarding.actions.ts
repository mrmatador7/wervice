'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase-server';
import { z } from 'zod';
import {
  onboardingDataSchema,
  welcomeSchema,
  basicInfoSchema,
  citySchema,
  dateSchema,
  guestsSchema,
  budgetCurrencySchema,
  stylePrioritiesSchema,
  servicesNeededSchema,
  suggestionsSchema,
  summarySchema,
  type OnboardingData
} from '../schemas/onboarding.schemas';

// Step schemas map
const stepSchemas = {
  welcome: welcomeSchema,
  basicInfo: basicInfoSchema,
  city: citySchema,
  date: dateSchema,
  guests: guestsSchema,
  budgetCurrency: budgetCurrencySchema,
  stylePriorities: stylePrioritiesSchema,
  servicesNeeded: servicesNeededSchema,
  suggestions: suggestionsSchema,
  summary: summarySchema,
} as const;

export type StepKey = keyof typeof stepSchemas;

/**
 * Get current onboarding data for a user
 */
export async function getOnboarding(uid: string): Promise<{
  ok: boolean;
  data?: OnboardingData & { onboarded: boolean };
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('onboarded, onboarding_data')
      .eq('id', uid)
      .single();

    if (error) {
      console.error('Error fetching onboarding data:', error);
      return { ok: false, error: 'Failed to fetch onboarding data' };
    }

    // Merge profile data with onboarding_data
    const onboardingData = {
      onboarded: profile.onboarded || false,
      ...((profile.onboarding_data as OnboardingData) || {}),
    };

    return { ok: true, data: onboardingData };
  } catch (error) {
    console.error('Error in getOnboarding:', error);
    return { ok: false, error: 'Internal server error' };
  }
}

/**
 * Save a specific step's data
 */
export async function saveStep(
  uid: string,
  stepKey: StepKey,
  payload: any
): Promise<{
  ok: boolean;
  data?: Partial<OnboardingData>;
  error?: string;
}> {
  try {
    // Validate the payload
    const schema = stepSchemas[stepKey];
    const validatedData = schema.parse(payload);

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Get current onboarding data
    const { data: currentData, error: fetchError } = await supabase
      .from('profiles')
      .select('onboarding_data')
      .eq('id', uid)
      .single();

    if (fetchError) {
      console.error('Error fetching current data:', fetchError);
      return { ok: false, error: 'Failed to fetch current data' };
    }

    // Deep merge the new step data
    const currentOnboardingData = (currentData?.onboarding_data as OnboardingData) || {};
    const updatedOnboardingData = {
      ...currentOnboardingData,
      [stepKey]: validatedData,
    };

    // Update the profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        onboarding_data: updatedOnboardingData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', uid)
      .select('onboarding_data')
      .single();

    if (error) {
      console.error('Error saving step:', error);
      return { ok: false, error: 'Failed to save step data' };
    }

    return { ok: true, data: updatedOnboardingData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.issues);
      return { ok: false, error: 'Invalid data provided' };
    }

    console.error('Error in saveStep:', error);
    return { ok: false, error: 'Internal server error' };
  }
}

/**
 * Complete onboarding
 */
export async function completeOnboarding(uid: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { error } = await supabase
      .from('profiles')
      .update({
        onboarded: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', uid);

    if (error) {
      console.error('Error completing onboarding:', error);
      return { ok: false, error: 'Failed to complete onboarding' };
    }

    return { ok: true };
  } catch (error) {
    console.error('Error in completeOnboarding:', error);
    return { ok: false, error: 'Internal server error' };
  }
}
