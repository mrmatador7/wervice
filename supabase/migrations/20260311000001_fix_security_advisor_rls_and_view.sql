-- Fix Supabase Security Advisor findings:
-- 1) RLS disabled on public tables
-- 2) SECURITY DEFINER view on public.vendors_public
--
-- This migration is idempotent and safe to re-run.

-- -------------------------------------------------------------------
-- Enable RLS on flagged tables (if they exist)
-- -------------------------------------------------------------------
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.vendor_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.businesse_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.media_files ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------------
-- profiles policies
-- -------------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    DROP POLICY IF EXISTS "profiles_read_own" ON public.profiles;
    DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
    DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

    CREATE POLICY "profiles_read_own"
      ON public.profiles
      FOR SELECT
      TO authenticated
      USING (id = auth.uid());

    CREATE POLICY "profiles_update_own"
      ON public.profiles
      FOR UPDATE
      TO authenticated
      USING (id = auth.uid())
      WITH CHECK (id = auth.uid());

    CREATE POLICY "profiles_insert_own"
      ON public.profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (id = auth.uid());
  END IF;
END $$;

-- -------------------------------------------------------------------
-- vendor_leads policies
-- Keep behavior aligned with current app:
-- - anon can read only published rows
-- - authenticated can read all and manage rows
-- -------------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.vendor_leads') IS NOT NULL THEN
    DROP POLICY IF EXISTS "public read published vendor_leads" ON public.vendor_leads;
    DROP POLICY IF EXISTS "authenticated read all vendor_leads" ON public.vendor_leads;
    DROP POLICY IF EXISTS "authenticated manage vendor_leads" ON public.vendor_leads;

    CREATE POLICY "public read published vendor_leads"
      ON public.vendor_leads
      FOR SELECT
      TO anon
      USING (published = true);

    CREATE POLICY "authenticated read all vendor_leads"
      ON public.vendor_leads
      FOR SELECT
      TO authenticated
      USING (true);

    CREATE POLICY "authenticated manage vendor_leads"
      ON public.vendor_leads
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- -------------------------------------------------------------------
-- businesse_types policies
-- -------------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.businesse_types') IS NOT NULL THEN
    DROP POLICY IF EXISTS "public read businesse_types" ON public.businesse_types;
    DROP POLICY IF EXISTS "authenticated manage businesse_types" ON public.businesse_types;
    DROP POLICY IF EXISTS "service role manage businesse_types" ON public.businesse_types;

    CREATE POLICY "public read businesse_types"
      ON public.businesse_types
      FOR SELECT
      TO anon, authenticated
      USING (true);

    CREATE POLICY "authenticated manage businesse_types"
      ON public.businesse_types
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);

    CREATE POLICY "service role manage businesse_types"
      ON public.businesse_types
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- -------------------------------------------------------------------
-- media_files policies
-- -------------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.media_files') IS NOT NULL THEN
    DROP POLICY IF EXISTS "public read media_files" ON public.media_files;
    DROP POLICY IF EXISTS "authenticated manage media_files" ON public.media_files;
    DROP POLICY IF EXISTS "service role manage media_files" ON public.media_files;

    CREATE POLICY "public read media_files"
      ON public.media_files
      FOR SELECT
      TO anon, authenticated
      USING (true);

    CREATE POLICY "authenticated manage media_files"
      ON public.media_files
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);

    CREATE POLICY "service role manage media_files"
      ON public.media_files
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- -------------------------------------------------------------------
-- SECURITY DEFINER view fix: use invoker rights
-- -------------------------------------------------------------------
ALTER VIEW IF EXISTS public.vendors_public SET (security_invoker = true);

