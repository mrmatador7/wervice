-- Add subcategory column to vendors table
ALTER TABLE public.vendors
ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- Add subcategory to categories table for reference
CREATE TABLE IF NOT EXISTS public.category_subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug TEXT NOT NULL REFERENCES public.categories(slug) ON DELETE CASCADE,
  subcategory_name TEXT NOT NULL,
  subcategory_slug TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_slug, subcategory_slug)
);

-- Enable RLS
ALTER TABLE public.category_subcategories ENABLE ROW LEVEL SECURITY;

-- Allow public to read subcategories
CREATE POLICY "Public can view subcategories"
  ON public.category_subcategories
  FOR SELECT
  USING (true);

-- Allow service role to manage subcategories
CREATE POLICY "Service role can manage subcategories"
  ON public.category_subcategories
  FOR ALL
  USING (auth.role() = 'service_role');

-- Insert subcategories for Venues
INSERT INTO public.category_subcategories (category_slug, subcategory_name, subcategory_slug, display_order) VALUES
('venues', 'Wedding Halls', 'wedding-halls', 1),
('venues', 'Riads & Villas', 'riads-villas', 2),
('venues', 'Hotels & Resorts', 'hotels-resorts', 3),
('venues', 'Beach Venues', 'beach-venues', 4),
('venues', 'Outdoor Gardens', 'outdoor-gardens', 5),
('venues', 'Luxury Palaces', 'luxury-palaces', 6),
('venues', 'Farm & Countryside Venues', 'farm-countryside', 7),
('venues', 'Rooftop & City View Venues', 'rooftop-city-view', 8);

-- Insert subcategories for Catering
INSERT INTO public.category_subcategories (category_slug, subcategory_name, subcategory_slug, display_order) VALUES
('catering', 'Moroccan Cuisine', 'moroccan-cuisine', 1),
('catering', 'International Cuisine', 'international-cuisine', 2),
('catering', 'Pastry & Dessert Services', 'pastry-desserts', 3),
('catering', 'Wedding Cakes', 'wedding-cakes', 4),
('catering', 'Buffet Service', 'buffet-service', 5),
('catering', 'Seated Dinner Service', 'seated-dinner', 6),
('catering', 'Food Trucks', 'food-trucks', 7),
('catering', 'Beverage & Juice Bars', 'beverage-juice-bars', 8);

-- Insert subcategories for Photo & Video
INSERT INTO public.category_subcategories (category_slug, subcategory_name, subcategory_slug, display_order) VALUES
('photography', 'Wedding Photographer', 'wedding-photographer', 1),
('photography', 'Videographer', 'videographer', 2),
('photography', 'Drone & Aerial Shoots', 'drone-aerial', 3),
('photography', 'Pre-Wedding Sessions', 'pre-wedding-sessions', 4),
('photography', 'Studio Photography', 'studio-photography', 5),
('photography', 'Instant Photo Booths', 'photo-booths', 6),
('photography', 'Live Streaming', 'live-streaming', 7),
('photography', 'Editing & Retouching Services', 'editing-retouching', 8);

-- Insert subcategories for Event Planner
INSERT INTO public.category_subcategories (category_slug, subcategory_name, subcategory_slug, display_order) VALUES
('event-planner', 'Full Wedding Planning', 'full-wedding-planning', 1),
('event-planner', 'Day-of Coordination', 'day-of-coordination', 2),
('event-planner', 'Destination Wedding Planning', 'destination-wedding', 3),
('event-planner', 'Partial Planning', 'partial-planning', 4),
('event-planner', 'Decor & Theme Design', 'decor-theme-design', 5),
('event-planner', 'Budget & Vendor Management', 'budget-vendor-management', 6),
('event-planner', 'Traditional Moroccan Ceremony Specialist', 'moroccan-ceremony', 7),
('event-planner', 'Engagement Party Organizer', 'engagement-party', 8);

-- Insert subcategories for Beauty
INSERT INTO public.category_subcategories (category_slug, subcategory_name, subcategory_slug, display_order) VALUES
('beauty', 'Makeup Artist', 'makeup-artist', 1),
('beauty', 'Hair Stylist', 'hair-stylist', 2),
('beauty', 'Henna Artist', 'henna-artist', 3),
('beauty', 'Nail & Spa Services', 'nail-spa', 4),
('beauty', 'Skin Care & Pre-Wedding Treatments', 'skincare-treatments', 5),
('beauty', 'Barber & Groom Styling', 'barber-groom', 6),
('beauty', 'Beauty Packages for the Bride', 'beauty-packages', 7);

-- Insert subcategories for Decor
INSERT INTO public.category_subcategories (category_slug, subcategory_name, subcategory_slug, display_order) VALUES
('decor', 'Floral Design', 'floral-design', 1),
('decor', 'Lighting & Ambience', 'lighting-ambience', 2),
('decor', 'Stage Design', 'stage-design', 3),
('decor', 'Traditional Moroccan Decor', 'moroccan-decor', 4),
('decor', 'Table & Chair Rentals', 'table-chair-rentals', 5),
('decor', 'Centerpieces & Balloons', 'centerpieces-balloons', 6),
('decor', 'Candle & Scents Styling', 'candle-scents', 7);

-- Insert subcategories for Music
INSERT INTO public.category_subcategories (category_slug, subcategory_name, subcategory_slug, display_order) VALUES
('music', 'Moroccan Bands & Artists', 'moroccan-bands', 1),
('music', 'DJs', 'djs', 2),
('music', 'Gnawa & Traditional Groups', 'gnawa-traditional', 3),
('music', 'Andalusian or Classical Music', 'andalusian-classical', 4),
('music', 'Sound & Lighting Equipment', 'sound-lighting', 5),
('music', 'Wedding MC / Host', 'wedding-mc', 6),
('music', 'Zaffa & Entrance Performers', 'zaffa-entrance', 7);

-- Insert subcategories for Dresses
INSERT INTO public.category_subcategories (category_slug, subcategory_name, subcategory_slug, display_order) VALUES
('dresses', 'Bridal Dresses', 'bridal-dresses', 1),
('dresses', 'Traditional Caftans', 'traditional-caftans', 2),
('dresses', 'Takchita Designers', 'takchita-designers', 3),
('dresses', 'Groom Outfits', 'groom-outfits', 4),
('dresses', 'Dress Rentals', 'dress-rentals', 5),
('dresses', 'Custom Tailoring', 'custom-tailoring', 6),
('dresses', 'Accessories & Jewelry', 'accessories-jewelry', 7);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_category_subcategories_category ON public.category_subcategories(category_slug);
CREATE INDEX IF NOT EXISTS idx_vendors_subcategory ON public.vendors(subcategory);

