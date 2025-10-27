-- Add onboarding fields to profiles table if they don't exist

-- Add event_date column
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'event_date') THEN
    ALTER TABLE public.profiles ADD COLUMN event_date DATE;
  END IF;
END $$;

-- Add guest_count column
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'guest_count') THEN
    ALTER TABLE public.profiles ADD COLUMN guest_count INTEGER;
  END IF;
END $$;

-- Add budget column
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'budget') THEN
    ALTER TABLE public.profiles ADD COLUMN budget TEXT;
  END IF;
END $$;

-- Add city column (if not already present)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'city') THEN
    ALTER TABLE public.profiles ADD COLUMN city TEXT;
  END IF;
END $$;

-- Add preferred_categories column
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'preferred_categories') THEN
    ALTER TABLE public.profiles ADD COLUMN preferred_categories TEXT[];
  END IF;
END $$;

-- Add wedding_style column
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'wedding_style') THEN
    ALTER TABLE public.profiles ADD COLUMN wedding_style TEXT[];
  END IF;
END $$;

-- Add onboarding_completed column (if not already present)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'onboarding_completed') THEN
    ALTER TABLE public.profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed ON public.profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);

