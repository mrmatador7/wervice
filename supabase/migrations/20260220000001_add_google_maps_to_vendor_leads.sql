-- Add google_maps column to vendor_leads to align with spreadsheet columns
-- Spreadsheet columns: Vendor, Category, City, Phone, Email, Description, Google Maps, IG

ALTER TABLE public.vendor_leads
ADD COLUMN IF NOT EXISTS google_maps TEXT;

COMMENT ON COLUMN public.vendor_leads.google_maps IS 'Google Maps URL or address - maps to spreadsheet "Google Maps" column';
