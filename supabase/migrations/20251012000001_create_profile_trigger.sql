-- Create trigger to auto-create profile on signup
-- Ensures every new user gets a profile with onboarded = false

-- Auto-create a profile row on new auth user
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, onboarded)
  values (new.id, false)
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users for each row
execute function public.handle_new_user();

-- Reload schema cache
select pg_notify('pgrst', 'reload schema');
