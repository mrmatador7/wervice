-- Add published column to vendor_leads table
-- This allows admins to control which vendors appear on the public website

ALTER TABLE public.vendor_leads
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_vendor_leads_published 
ON public.vendor_leads (published) 
WHERE published = true;

-- Add composite index for common queries
CREATE INDEX IF NOT EXISTS idx_vendor_leads_category_city_published 
ON public.vendor_leads(category, city, published) 
WHERE published = true;

-- Add starting_price column if it doesn't exist (for pricing display)
ALTER TABLE public.vendor_leads
ADD COLUMN IF NOT EXISTS starting_price NUMERIC;

-- Add slug column if it doesn't exist (for URL-friendly vendor pages)
ALTER TABLE public.vendor_leads
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_vendor_leads_slug_unique 
ON public.vendor_leads (slug) 
WHERE slug IS NOT NULL;

-- Update existing approved vendors to be published by default
UPDATE public.vendor_leads
SET published = true
WHERE status = 'approved' AND published IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.vendor_leads.published IS 'Controls whether the vendor appears on the public website. Only published vendors are visible to users.';

