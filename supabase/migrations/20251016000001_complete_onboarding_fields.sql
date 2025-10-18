-- Complete Onboarding Fields Migration
-- Adds remaining fields needed for the comprehensive onboarding flow

-- Add missing onboarding columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS guest_count INTEGER,
  ADD COLUMN IF NOT EXISTS currency TEXT CHECK (currency IN ('MAD','EUR','USD')),
  ADD COLUMN IF NOT EXISTS budget_total INTEGER,
  ADD COLUMN IF NOT EXISTS priorities TEXT[],
  ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 1;

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_profiles_guest_count ON public.profiles (guest_count);
CREATE INDEX IF NOT EXISTS idx_profiles_priorities ON public.profiles USING GIN (priorities);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_step ON public.profiles (onboarding_step);

-- Refresh schema cache
SELECT pg_notify('pgrst', 'reload schema');

