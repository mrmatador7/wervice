-- Create public vendors table for the website
create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('venues', 'catering', 'photography', 'music', 'beauty', 'decor', 'planning', 'dresses', 'eventPlanner')),
  city text not null check (city in ('marrakech', 'casablanca', 'rabat', 'tangier', 'agadir', 'fes', 'meknes', 'elJadida', 'kenitra')),
  phone text not null,
  email text,
  description text,
  profile_photo_url text,
  gallery_urls text[],
  plan_tier text not null,
  rating numeric default 0,
  published boolean default true,
  created_at timestamptz default now()
);

-- Create indexes for better query performance
create index if not exists vendors_published_idx on public.vendors (published);
create index if not exists vendors_category_idx on public.vendors (category, published);
create index if not exists vendors_city_idx on public.vendors (city, published);
create index if not exists vendors_slug_idx on public.vendors (slug);

-- Enable RLS
alter table public.vendors enable row level security;

-- Public read policy for published vendors
create policy "public reads published vendors"
  on public.vendors for select
  using (published = true);

-- Authenticated users can insert/update/delete
create policy "authenticated manages vendors"
  on public.vendors for all
  using (auth.role() = 'authenticated');
