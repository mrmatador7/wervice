-- Sync approved vendor_leads to public vendors table
-- This migration creates/updates vendors from approved vendor_leads

-- First, let's check the actual structure and update it if needed
-- The vendors table was created with 'name' but code uses 'business_name'
DO $$
BEGIN
  -- Rename 'name' to 'business_name' if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vendors' 
    AND column_name = 'name'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.vendors RENAME COLUMN name TO business_name;
  END IF;

  -- Add business_name if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vendors' 
    AND column_name = 'business_name'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.vendors ADD COLUMN business_name text NOT NULL;
  END IF;

  -- Rename plan_tier to plan if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vendors' 
    AND column_name = 'plan_tier'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.vendors RENAME COLUMN plan_tier TO plan;
  END IF;

  -- Add plan if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vendors' 
    AND column_name = 'plan'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.vendors ADD COLUMN plan text;
  END IF;

  -- Rename gallery_urls to gallery_photos if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vendors' 
    AND column_name = 'gallery_urls'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.vendors RENAME COLUMN gallery_urls TO gallery_photos;
  END IF;

  -- Add gallery_photos if it doesn't exist  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vendors' 
    AND column_name = 'gallery_photos'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.vendors ADD COLUMN gallery_photos text[];
  END IF;

  -- Add starting_price column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vendors' 
    AND column_name = 'starting_price'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.vendors ADD COLUMN starting_price numeric;
  END IF;
END $$;

-- Drop old CHECK constraints if they exist (to allow flexible category/city values)
ALTER TABLE public.vendors DROP CONSTRAINT IF EXISTS vendors_category_check;
ALTER TABLE public.vendors DROP CONSTRAINT IF EXISTS vendors_city_check;

-- Now insert/update vendors from vendor_leads
-- This will sync all vendor_leads (not just approved) to vendors table
INSERT INTO public.vendors (
  slug,
  business_name,
  category,
  city,
  phone,
  email,
  description,
  profile_photo_url,
  gallery_photos,
  plan,
  starting_price,
  published,
  created_at
)
SELECT
  -- Generate slug from business_name if vendor doesn't exist yet
  lower(regexp_replace(vl.business_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(replace(vl.id::text, '-', ''), 1, 6),
  vl.business_name,
  lower(vl.category),
  lower(vl.city),
  vl.whatsapp,
  vl.email,
  vl.profile_description,
  vl.logo_url,
  vl.gallery_urls,
  -- Map subscription price to plan
  CASE 
    WHEN vl.subscription_price_dhs >= 350 THEN 'premium'
    WHEN vl.subscription_price_dhs >= 250 THEN 'pro'
    ELSE 'basic'
  END,
  -- Extract numeric price from profile_starting_price if it exists
  CASE 
    WHEN vl.profile_starting_price IS NOT NULL AND vl.profile_starting_price != '' 
    THEN NULLIF(regexp_replace(vl.profile_starting_price, '[^0-9.]', '', 'g'), '')::numeric
    ELSE NULL
  END,
  -- Publish only approved vendor_leads
  CASE WHEN vl.status = 'approved' THEN true ELSE false END,
  vl.created_at
FROM public.vendor_leads vl
WHERE vl.deleted_at IS NULL
ON CONFLICT (slug) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  category = EXCLUDED.category,
  city = EXCLUDED.city,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  description = EXCLUDED.description,
  profile_photo_url = EXCLUDED.profile_photo_url,
  gallery_photos = EXCLUDED.gallery_photos,
  plan = EXCLUDED.plan,
  starting_price = EXCLUDED.starting_price,
  published = EXCLUDED.published;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_vendors_published ON public.vendors (published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_vendors_category ON public.vendors (lower(category));
CREATE INDEX IF NOT EXISTS idx_vendors_city ON public.vendors (lower(city));
CREATE INDEX IF NOT EXISTS idx_vendors_category_city ON public.vendors (lower(category), lower(city));

-- Add comment
COMMENT ON TABLE public.vendors IS 'Public-facing vendors table synced from approved vendor_leads';

