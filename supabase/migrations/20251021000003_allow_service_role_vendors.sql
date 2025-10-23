-- Allow service_role to manage vendors table
-- This is needed for admin operations like syncing vendor_leads

-- Drop the restrictive policy
DROP POLICY IF EXISTS "authenticated manages vendors" ON public.vendors;

-- Create new policies
-- 1. Public can read published vendors
CREATE POLICY "public reads published vendors"
  ON public.vendors FOR SELECT
  USING (published = true);

-- 2. Service role can do everything (for admin operations)
CREATE POLICY "service role manages vendors"
  ON public.vendors FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3. Authenticated users can manage their own vendors (if needed later)
-- For now, we'll allow authenticated to insert/update
CREATE POLICY "authenticated manages vendors"
  ON public.vendors FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Comment for documentation
COMMENT ON POLICY "service role manages vendors" ON public.vendors IS 'Allows service role to sync vendor_leads and perform admin operations';

