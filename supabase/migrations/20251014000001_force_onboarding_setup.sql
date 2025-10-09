-- Force Onboarding Setup Migration
-- Add required columns and RLS policies for wedding onboarding flow

-- Add missing columns to profiles table
alter table public.profiles
  add column if not exists onboarded boolean not null default false,
  add column if not exists phone text,
  add column if not exists city text,
  add column if not exists intent text check (intent in ('planning','exploring','vendor')) default 'planning',
  add column if not exists onboarding_data jsonb default '{}'::jsonb;

-- Enable RLS
alter table public.profiles enable row level security;

-- Drop existing policies if they exist (to avoid conflicts)
drop policy if exists "read own profile" on public.profiles;
drop policy if exists "update own profile" on public.profiles;
drop policy if exists "insert own profile" on public.profiles;

-- Create RLS policies
create policy "read own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

-- Refresh schema cache
select pg_notify('pgrst', 'reload schema');
