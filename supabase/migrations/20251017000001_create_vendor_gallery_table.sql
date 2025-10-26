-- Create vendor_gallery table for storing multiple images per vendor
create table if not exists public.vendor_gallery (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendor_leads(id) on delete cascade,
  url text not null,            -- final public URL or storage path
  order_index int not null,     -- 1..10
  created_at timestamptz default now()
);

-- Index for efficient queries
create index if not exists vendor_gallery_vendor_idx on public.vendor_gallery (vendor_id, order_index);

-- RLS policies (if needed)
-- alter table public.vendor_gallery enable row level security;



