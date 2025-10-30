-- Update subcategory column in vendors table to support array
ALTER TABLE public.vendors
ALTER COLUMN subcategory TYPE TEXT[] USING 
  CASE 
    WHEN subcategory IS NULL THEN NULL
    WHEN subcategory = '' THEN NULL
    ELSE ARRAY[subcategory]
  END;

-- Update subcategory column in vendor_leads table to support array
ALTER TABLE public.vendor_leads
ALTER COLUMN subcategory TYPE TEXT[] USING 
  CASE 
    WHEN subcategory IS NULL THEN NULL
    WHEN subcategory = '' THEN NULL
    ELSE ARRAY[subcategory]
  END;

-- Add index for subcategory array searches
CREATE INDEX IF NOT EXISTS idx_vendors_subcategory_array ON public.vendors USING GIN (subcategory);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_subcategory_array ON public.vendor_leads USING GIN (subcategory);

