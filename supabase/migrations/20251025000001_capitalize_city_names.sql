-- Update city names to proper capitalization to match frontend filters
-- This ensures case-sensitive queries work correctly

UPDATE public.vendors
SET city = CASE city
  WHEN 'marrakech' THEN 'Marrakech'
  WHEN 'casablanca' THEN 'Casablanca'
  WHEN 'rabat' THEN 'Rabat'
  WHEN 'tangier' THEN 'Tangier'
  WHEN 'agadir' THEN 'Agadir'
  WHEN 'fes' THEN 'Fes'
  WHEN 'fès' THEN 'Fes'
  WHEN 'meknes' THEN 'Meknes'
  WHEN 'eljadida' THEN 'El Jadida'
  WHEN 'elJadida' THEN 'El Jadida'
  WHEN 'el jadida' THEN 'El Jadida'
  WHEN 'kenitra' THEN 'Kenitra'
  ELSE city
END
WHERE city IN ('marrakech', 'casablanca', 'rabat', 'tangier', 'agadir', 'fes', 'fès', 'meknes', 'eljadida', 'elJadida', 'el jadida', 'kenitra');

-- Update the check constraint to use proper capitalization
ALTER TABLE public.vendors DROP CONSTRAINT IF EXISTS vendors_city_check;
ALTER TABLE public.vendors ADD CONSTRAINT vendors_city_check 
  CHECK (city IN ('Marrakech', 'Casablanca', 'Rabat', 'Tangier', 'Agadir', 'Fes', 'Meknes', 'El Jadida', 'Kenitra'));

-- Add comment for documentation
COMMENT ON COLUMN public.vendors.city IS 'City name with proper capitalization (e.g., Marrakech, Casablanca)';

