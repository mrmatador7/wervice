-- Enhanced Onboarding Migration
-- Adds comprehensive onboarding columns and indexes for multi-step flow

-- Add core onboarding columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarded BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS currency_preference TEXT CHECK (currency_preference IN ('MAD','EUR','USD')) DEFAULT 'MAD',
  ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT '{}'::JSONB;

-- Add denormalized fields for faster recommendation queries
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS planning_stage TEXT,
  ADD COLUMN IF NOT EXISTS style TEXT[],
  ADD COLUMN IF NOT EXISTS wedding_date DATE,
  ADD COLUMN IF NOT EXISTS wedding_month INTEGER CHECK (wedding_month >= 1 AND wedding_month <= 12),
  ADD COLUMN IF NOT EXISTS wedding_year INTEGER,
  ADD COLUMN IF NOT EXISTS guest_count_band TEXT,
  ADD COLUMN IF NOT EXISTS services_needed TEXT[],
  ADD COLUMN IF NOT EXISTS budget_band TEXT,
  ADD COLUMN IF NOT EXISTS budget_min_mad NUMERIC,
  ADD COLUMN IF NOT EXISTS budget_max_mad NUMERIC;

-- Create indexes for efficient recommendation queries
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles (city);
CREATE INDEX IF NOT EXISTS idx_profiles_services_needed ON public.profiles USING GIN (services_needed);
CREATE INDEX IF NOT EXISTS idx_profiles_style ON public.profiles USING GIN (style);
CREATE INDEX IF NOT EXISTS idx_profiles_budget ON public.profiles (budget_min_mad, budget_max_mad);
CREATE INDEX IF NOT EXISTS idx_profiles_guest_count ON public.profiles (guest_count_band);

-- Enable RLS (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Ensure RLS policies exist (idempotent)
DROP POLICY IF EXISTS "profiles_read_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

CREATE POLICY "profiles_read_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Refresh schema cache
SELECT pg_notify('pgrst', 'reload schema');
