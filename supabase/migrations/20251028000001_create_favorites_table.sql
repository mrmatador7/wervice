-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, vendor_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_vendor_id ON public.favorites(vendor_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON public.favorites(created_at DESC);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for favorites
CREATE POLICY "Users can view their own favorites"
  ON public.favorites
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON public.favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;

