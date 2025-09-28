# Supabase Migrations

This directory contains database migrations for the Wervice wedding planning platform.

## Running Migrations

### Option 1: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of the migration files
4. Execute them in order

### Option 2: Using Supabase CLI (if installed)
```bash
# Initialize Supabase (if not already done)
supabase init

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations
supabase db push
```

### Option 3: Using Supabase CLI (direct SQL execution)
```bash
# Apply specific migration
supabase db reset --linked
```

## Migration: 20250928213938_create_profiles_table.sql

This migration creates a comprehensive `profiles` table that extends Supabase's `auth.users` table with wedding planning specific information.

### Key Features:

- **Foreign Key Relationship**: Links to `auth.users.id` via `supabase_auth_id` (the `id` column)
- **Wedding Planning Fields**: Date, budget, location, guest count, theme, style
- **Partner Information**: For couples planning together
- **Vendor Support**: Fields for wedding service providers
- **Contact Information**: Phone, social media, business details
- **Preferences**: Language, notifications, planning stage
- **Automatic Profile Creation**: Trigger creates profile on user signup
- **Row Level Security**: Proper RLS policies for data protection
- **Performance Indexes**: Optimized queries for common use cases

### Table Structure:

```sql
profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id), -- Supabase auth user ID
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    avatar_url TEXT,

    -- Wedding planning
    wedding_date DATE,
    wedding_budget DECIMAL(12,2),
    wedding_location TEXT,
    wedding_guest_count INTEGER,
    planning_stage TEXT, -- 'exploring', 'planning', 'booked', 'completed'

    -- Partner info
    partner_first_name TEXT,
    partner_last_name TEXT,

    -- Vendor fields
    is_vendor BOOLEAN DEFAULT false,
    vendor_category TEXT, -- 'venues', 'catering', etc.
    business_name TEXT,

    -- And many more fields...
)
```

### Usage in Application:

After running this migration, you can:

1. Query user profiles:
```typescript
const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
```

2. Update profile information:
```typescript
const { error } = await supabase
    .from('profiles')
    .update({
        wedding_date: '2025-06-15',
        wedding_budget: 150000,
        planning_stage: 'planning'
    })
    .eq('id', user.id)
```

3. Profiles are automatically created when users sign up via the database trigger.

## Next Steps

After running this migration:

1. Update your TypeScript types by running:
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
   ```

2. Create React components to manage profile information

3. Set up profile completion flows in your onboarding process

4. Implement vendor dashboards for service providers
