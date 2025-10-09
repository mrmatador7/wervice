-- Quick test to verify onboarding setup
-- Run this in Supabase SQL Editor

-- Check if columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
AND column_name IN ('onboarding_data', 'phone', 'city', 'onboarding_purpose', 'onboarded')
ORDER BY column_name;

-- Check if RPC function exists
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name = 'upsert_user_profile'
AND routine_schema = 'public';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;
