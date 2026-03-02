-- Allow public to read published vendor_leads so vendor detail pages work
-- (App uses vendor_leads with anon key and .eq('published', true))

ALTER TABLE public.vendor_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read published vendor_leads" ON public.vendor_leads;
CREATE POLICY "public read published vendor_leads"
  ON public.vendor_leads
  FOR SELECT
  TO anon
  USING (published = true);

DROP POLICY IF EXISTS "authenticated read all vendor_leads" ON public.vendor_leads;
CREATE POLICY "authenticated read all vendor_leads"
  ON public.vendor_leads
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "authenticated manage vendor_leads" ON public.vendor_leads;
CREATE POLICY "authenticated manage vendor_leads"
  ON public.vendor_leads
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

COMMENT ON POLICY "public read published vendor_leads" ON public.vendor_leads IS
  'Allow anon to read vendor_leads rows where published is true (for public vendor pages).';
