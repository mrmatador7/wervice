-- Apply onboarding migration manually - Complete Fix
-- Run this in your Supabase SQL Editor

-- Step 1: Add missing columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarded boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS intent text CHECK (intent IN ('planning','exploring','vendor')) DEFAULT 'planning',
  ADD COLUMN IF NOT EXISTS onboarding_data jsonb DEFAULT '{}'::jsonb;

-- Step 2: Drop any conflicting policies
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;

-- Step 3: Create comprehensive policies for onboarding
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Step 4: Create secure RPC function for onboarding
CREATE OR REPLACE FUNCTION public.upsert_user_profile(
  p_user_id UUID,
  p_phone TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_onboarding_purpose TEXT DEFAULT NULL,
  p_onboarding_data JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_user_id UUID;
  v_result JSONB;
BEGIN
  -- Get the current authenticated user
  v_current_user_id := auth.uid();

  -- Ensure the user can only update their own profile
  IF v_current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF v_current_user_id != p_user_id THEN
    RAISE EXCEPTION 'Cannot update other users profiles';
  END IF;

  -- Upsert the profile using a direct SQL approach
  INSERT INTO public.profiles (
    id,
    phone,
    city,
    intent,
    onboarding_data,
    onboarded,
    updated_at
  ) VALUES (
    p_user_id,
    p_phone,
    p_city,
    p_onboarding_purpose,
    p_onboarding_data,
    true,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    phone = EXCLUDED.phone,
    city = EXCLUDED.city,
    intent = EXCLUDED.intent,
    onboarding_data = EXCLUDED.onboarding_data,
    onboarded = true,
    updated_at = NOW()
  WHERE profiles.id = p_user_id;

  -- Return success result
  v_result := jsonb_build_object(
    'success', true,
    'user_id', p_user_id,
    'onboarded', true,
    'updated_at', NOW()
  );

  RETURN v_result;
END;
$$;

-- Step 5: Reload schema cache
SELECT pg_notify('pgrst', 'reload schema');
