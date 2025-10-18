import { z } from 'zod';

// Onboarding intent options
export const onboardingIntentSchema = z.enum(['planning', 'exploring', 'vendor']);

// Currency options
export const currencySchema = z.enum(['MAD', 'EUR', 'USD']);

// Wedding styles
export const weddingStyleSchema = z.enum([
  'modern', 'traditional', 'luxury', 'garden', 'beach', 'boho', 'vintage', 'minimalist'
]);

// Wedding priorities (max 3)
export const weddingPrioritySchema = z.enum([
  'venue', 'photography', 'decor', 'food', 'music', 'beauty', 'dress', 'planner'
]);

// Wedding services
export const weddingServiceSchema = z.enum([
  'venues', 'catering', 'photography', 'beauty', 'decor', 'music', 'planner', 'dresses'
]);

// Step 1: Welcome
export const welcomeSchema = z.object({
  started: z.boolean().optional(),
});

// Step 2: Basic Info
export const basicInfoSchema = z.object({
  partnerName: z.string().optional(),
  intent: onboardingIntentSchema,
});

// Step 3: Wedding City
export const citySchema = z.object({
  city: z.string().min(1, 'Please select a city'),
});

// Step 4: Wedding Date
export const dateSchema = z.object({
  date: z.string().min(1, 'Please select a date'),
});

// Step 5: Guest Count
export const guestsSchema = z.object({
  count: z.number().min(20, 'Minimum 20 guests').max(800, 'Maximum 800 guests'),
});

// Step 6: Budget & Currency
export const budgetCurrencySchema = z.object({
  budget: z.number().min(1000, 'Minimum budget is 1,000'),
  currency: currencySchema,
});

// Step 7: Style & Priorities
export const stylePrioritiesSchema = z.object({
  styles: z.array(weddingStyleSchema).min(1, 'Please select at least one style'),
  topPriorities: z.array(weddingPrioritySchema).max(3, 'Maximum 3 priorities allowed'),
});

// Step 8: Services Needed
export const servicesNeededSchema = z.object({
  services: z.array(weddingServiceSchema).min(1, 'Please select at least one service'),
});

// Step 9: Suggestions
export const suggestionsSchema = z.object({
  acknowledged: z.boolean(),
});

// Step 10: Summary
export const summarySchema = z.object({
  confirmed: z.boolean(),
});

// Complete onboarding data schema
export const onboardingDataSchema = z.object({
  welcome: welcomeSchema.optional(),
  basicInfo: basicInfoSchema.optional(),
  city: citySchema.optional(),
  date: dateSchema.optional(),
  guests: guestsSchema.optional(),
  budgetCurrency: budgetCurrencySchema.optional(),
  stylePriorities: stylePrioritiesSchema.optional(),
  servicesNeeded: servicesNeededSchema.optional(),
  suggestions: suggestionsSchema.optional(),
  summary: summarySchema.optional(),
});

// Export types
export type OnboardingIntent = z.infer<typeof onboardingIntentSchema>;
export type Currency = z.infer<typeof currencySchema>;
export type WeddingStyle = z.infer<typeof weddingStyleSchema>;
export type WeddingPriority = z.infer<typeof weddingPrioritySchema>;
export type WeddingService = z.infer<typeof weddingServiceSchema>;
export type WelcomeData = z.infer<typeof welcomeSchema>;
export type BasicInfoData = z.infer<typeof basicInfoSchema>;
export type CityData = z.infer<typeof citySchema>;
export type DateData = z.infer<typeof dateSchema>;
export type GuestsData = z.infer<typeof guestsSchema>;
export type BudgetCurrencyData = z.infer<typeof budgetCurrencySchema>;
export type StylePrioritiesData = z.infer<typeof stylePrioritiesSchema>;
export type ServicesNeededData = z.infer<typeof servicesNeededSchema>;
export type SuggestionsData = z.infer<typeof suggestionsSchema>;
export type SummaryData = z.infer<typeof summarySchema>;
export type OnboardingData = z.infer<typeof onboardingDataSchema>;
