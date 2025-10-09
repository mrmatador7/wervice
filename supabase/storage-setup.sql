-- Storage setup for vendor files
-- Run this in Supabase SQL Editor to create the vendor-files bucket

-- Create the vendor-files bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vendor-files',
  'vendor-files',
  true, -- Make it public so uploaded images can be viewed
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] -- Only allow image files
);

-- Set up RLS policies for the vendor-files bucket
-- Allow anonymous users to upload files (for vendor form submissions)
CREATE POLICY "Allow anonymous uploads to vendor-files" ON storage.objects
FOR INSERT TO anon
WITH CHECK (bucket_id = 'vendor-files');

-- Allow authenticated users to view files
CREATE POLICY "Allow authenticated users to view vendor-files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'vendor-files');

-- Allow public access to view files (since bucket is public)
CREATE POLICY "Allow public access to vendor-files" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'vendor-files');

-- Allow admin users to manage all files
CREATE POLICY "Allow admins to manage vendor-files" ON storage.objects
FOR ALL TO authenticated
USING (
  bucket_id = 'vendor-files' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.user_type IN ('admin', 'super_admin')
  )
);
