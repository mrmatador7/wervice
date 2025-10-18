import { z } from 'zod';

// Vendor category options
export const vendorCategorySchema = z.enum([
  'venues',
  'catering',
  'photography',
  'music',
  'beauty',
  'decor',
  'planning',
  'dresses',
  'eventPlanner'
]);

// Moroccan cities
export const vendorCitySchema = z.enum([
  'marrakech',
  'casablanca',
  'rabat',
  'tangier',
  'agadir',
  'fes',
  'meknes',
  'elJadida',
  'kenitra'
]);

// Vendor plans
export const vendorPlanSchema = z.enum([
  'style-beauty', // 200 MAD
  'media-entertainment', // 250 MAD
  'venue-planning' // 350 MAD
]);

// Category to default plan mapping
export const categoryToDefaultPlan: Record<string, z.infer<typeof vendorPlanSchema>> = {
  'venues': 'venue-planning',
  'catering': 'venue-planning',
  'photography': 'media-entertainment',
  'music': 'media-entertainment',
  'beauty': 'style-beauty',
  'decor': 'style-beauty',
  'planning': 'venue-planning',
  'dresses': 'style-beauty',
  'eventPlanner': 'venue-planning'
};

// Plan pricing
export const planPricing = {
  'style-beauty': 200,
  'media-entertainment': 250,
  'venue-planning': 350
} as const;

// Add vendor form schema
export const addVendorSchema = z.object({
  businessName: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  plan: z.string().optional(),
  description: z.string().optional(),
  profilePhoto: z.any().optional(),
  galleryPhotos: z.array(z.any()).optional().default([])
});

export type AddVendorInput = z.infer<typeof addVendorSchema>;
