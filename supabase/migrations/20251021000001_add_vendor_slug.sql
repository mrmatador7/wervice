-- Add slug column to vendors table with unique constraint
-- This migration ensures vendors have URL-friendly slugs

-- 1) Add slug column if it doesn't exist
ALTER TABLE public.vendors
  ADD COLUMN IF NOT EXISTS slug text;

-- 2) Backfill slug for existing rows where it's null
-- Generate slug from business_name + short id suffix for uniqueness
UPDATE public.vendors v
SET slug = lower(
  regexp_replace(coalesce(v.business_name, 'vendor'), '[^a-zA-Z0-9]+', '-', 'g')
) || '-' || substr(replace(v.id::text, '-', ''), 1, 6)
WHERE v.slug IS NULL OR v.slug = '';

-- 3) Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS vendors_slug_uidx ON public.vendors (slug);

-- 4) Create function to auto-generate slug on insert
CREATE OR REPLACE FUNCTION public.vendors_slug_autogen()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.slug IS NULL OR length(trim(NEW.slug)) = 0 THEN
    NEW.slug := lower(regexp_replace(coalesce(NEW.business_name, 'vendor'), '[^a-zA-Z0-9]+', '-', 'g'))
               || '-' || substr(replace(NEW.id::text, '-', ''), 1, 6);
  END IF;
  RETURN NEW;
END $$;

-- 5) Create trigger to auto-generate slug before insert
DROP TRIGGER IF EXISTS trg_vendors_slug ON public.vendors;
CREATE TRIGGER trg_vendors_slug
  BEFORE INSERT ON public.vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.vendors_slug_autogen();

-- 6) Optional: Add comment for documentation
COMMENT ON COLUMN public.vendors.slug IS 'URL-friendly unique identifier for vendor, auto-generated from business_name';

