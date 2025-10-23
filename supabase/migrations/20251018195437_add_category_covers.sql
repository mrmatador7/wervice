-- Add cover image URL to categories
alter table public.categories
  add column if not exists cover_url text;

-- Add optional strapline field for hero section
alter table public.categories
  add column if not exists strapline text;

-- Ensure RLS is enabled
alter table public.categories enable row level security;

-- Create public read policy if it doesn't exist
do $$
begin
  if not exists (
    select 1 from pg_policies
    where polname = 'public_read_categories'
      and tablename = 'categories'
  ) then
    create policy public_read_categories
      on public.categories
      for select
      to anon, authenticated
      using (true);
  end if;
end$$;
