-- Create profiles table
-- This table extends the auth.users table with additional user information
-- for the Wervice wedding planning platform

-- user_type: user, vendor, admin, super_admin
CREATE TYPE user_type AS ENUM ('user', 'vendor', 'admin', 'super_admin');
-- user_status: active, inactive, pending, deleted
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'pending', 'banned');

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    image TEXT NOT NULL, 
    description TEXT,
    slug TEXT NOT NULL,
    parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE IF public.businesse_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
    deleted_at TIMESTAMPTZ DEFAULT NULL
);



CREATE TABLE IF NOT EXISTS public.profiles (
    -- Primary key using the same UUID as Supabase auth
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Basic profile information
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    birth_date DATE,
    gender TEXT,
    nationality TEXT,
    user_type user_type,
    user_status user_status,

    -- Contact information
    phone TEXT,
    email TEXT,
    city TEXT, -- City, country for wedding planning context
    country TEXT,
    address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    postal_code TEXT,

    -- locale 


    -- Preferences and settings
    locale TEXT DEFAULT 'en',
    currency TEXT DEFAULT 'MAD',
    notification_preferences JSONB DEFAULT '{
        "email_marketing": true,
        "email_updates": true,
        "sms_reminders": false,
        "push_notifications": true
    }',

    -- Business/professional information (for vendors)
    business_name TEXT,
    business_description TEXT,
    business_website TEXT,
    business_phone TEXT,
    business_email TEXT,

    -- Social media and additional links
    ig_username TEXT,
    facebook_username TEXT,
    pinterest_username TEXT,
    twitter_username TEXT,
    linkedin_username TEXT,
    youtube_username TEXT,
    tiktok_username TEXT,
    twitch_username TEXT,
    discord_username TEXT,
    telegram_username TEXT,

    -- Bio and additional information
    bio TEXT,
    special_requirements TEXT, -- Dietary restrictions, accessibility needs, etc.

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_budget CHECK (wedding_budget >= 0),
    CONSTRAINT valid_guest_count CHECK (wedding_guest_count >= 0 AND wedding_guest_count <= 1000),
    CONSTRAINT valid_phone CHECK (phone ~ '^[\+]?[0-9\s\-\(\)]{10,20}$'),
    CONSTRAINT valid_partner_phone CHECK (partner_phone IS NULL OR partner_phone ~ '^[\+]?[0-9\s\-\(\)]{10,20}$'),
    CONSTRAINT valid_business_phone CHECK (business_phone IS NULL OR business_phone ~ '^[\+]?[0-9\s\-\(\)]{10,20}$')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_country ON public.profiles(country);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_user_status ON public.profiles(user_status);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON public.profiles(updated_at);

-- Create partial indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_active_users ON public.profiles(user_status)
WHERE user_status = 'active';

CREATE INDEX IF NOT EXISTS idx_profiles_vendors ON public.profiles(user_type)
WHERE user_type = 'vendor';

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(city, country);
CREATE INDEX IF NOT EXISTS idx_profiles_business_search ON public.profiles(business_name, city);

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policy: Vendors can view profiles of potential clients in their area
CREATE POLICY "Vendors can view client profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
            AND p.user_type = 'vendor'
        )
        AND user_type = 'user'
    );

-- Function to handle automatic profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, user_type, user_status)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        'user'::user_type,
        'active'::user_status
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profile changes
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
GRANT ALL ON public.businesse_types TO authenticated;
GRANT ALL ON public.businesse_types TO service_role;

-- Comments for documentation
COMMENT ON TABLE public.profiles IS 'Extended user profiles for Wervice wedding planning platform';
COMMENT ON COLUMN public.profiles.id IS 'References auth.users.id - the Supabase auth user ID';
COMMENT ON COLUMN public.profiles.user_type IS 'Type of user: user, vendor, admin, super_admin';
COMMENT ON COLUMN public.profiles.user_status IS 'Status of user account: active, inactive, pending, banned';
