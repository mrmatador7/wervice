-- Add admin policies for categories table
-- Allow authenticated users (admins) to manage categories

-- Policy for INSERT
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE polname = 'authenticated_insert_categories'
      AND tablename = 'categories'
  ) THEN
    CREATE POLICY authenticated_insert_categories
      ON public.categories
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END$$;

-- Policy for UPDATE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE polname = 'authenticated_update_categories'
      AND tablename = 'categories'
  ) THEN
    CREATE POLICY authenticated_update_categories
      ON public.categories
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END$$;

-- Policy for DELETE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE polname = 'authenticated_delete_categories'
      AND tablename = 'categories'
  ) THEN
    CREATE POLICY authenticated_delete_categories
      ON public.categories
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END$$;

