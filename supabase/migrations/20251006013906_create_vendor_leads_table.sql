-- Create vendor_leads table
-- This table stores vendor application forms before they become active vendors
-- Applications are reviewed manually before being converted to vendor profiles

-- Subscription cadence enum
CREATE TYPE subscription_cadence AS ENUM ('monthly', '6m', 'annual');

-- Application status enum
CREATE TYPE vendor_lead_status AS ENUM ('pending_review', 'approved', 'rejected', 'contacted');

-- Domain TLD enum
CREATE TYPE domain_tld AS ENUM ('.ma', '.com');

CREATE TABLE IF NOT EXISTS public.vendor_leads (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Personal Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    category TEXT NOT NULL,
    city TEXT NOT NULL,
    whatsapp TEXT NOT NULL, -- E.164 format
    email TEXT NOT NULL,
    instagram TEXT,

    -- Profile Information
    profile_starting_price TEXT, -- Optional: price shown on vendor profile
    profile_description TEXT NOT NULL,

    -- Service areas (array of cities)
    service_area TEXT[] NOT NULL DEFAULT '{}',

    -- Languages spoken (array of language codes)
    languages_spoken TEXT[] NOT NULL DEFAULT '{}',

    -- Media files (stored as URLs after upload)
    logo_url TEXT, -- Logo image URL
    gallery_urls TEXT[], -- Array of gallery image URLs

    -- Subscription Information
    subscription_cadence subscription_cadence NOT NULL DEFAULT 'monthly',
    subscription_price_dhs DECIMAL(10,2) NOT NULL, -- Monthly price in MAD

    -- Domain perk (for 6-month and annual plans)
    domain_perk_enabled BOOLEAN DEFAULT FALSE,
    domain_perk_requested_domain TEXT,
    domain_perk_tld domain_tld,

    -- Tracking & Admin
    source TEXT DEFAULT 'vendor_subscribe_page', -- Where the application came from
    status vendor_lead_status DEFAULT 'pending_review',
    admin_notes TEXT, -- Internal notes from review process
    reviewed_by UUID REFERENCES public.profiles(id), -- Admin who reviewed
    reviewed_at TIMESTAMPTZ,

    -- Spam prevention
    honeypot TEXT, -- Hidden field to catch bots

    -- Metadata
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vendor_leads_email ON public.vendor_leads(email);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_whatsapp ON public.vendor_leads(whatsapp);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_business_name ON public.vendor_leads(business_name);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_category ON public.vendor_leads(category);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_city ON public.vendor_leads(city);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_status ON public.vendor_leads(status);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_subscription_cadence ON public.vendor_leads(subscription_cadence);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_submitted_at ON public.vendor_leads(submitted_at);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_created_at ON public.vendor_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_updated_at ON public.vendor_leads(updated_at);

-- Partial indexes for common queries
CREATE INDEX IF NOT EXISTS idx_vendor_leads_pending_review ON public.vendor_leads(status)
WHERE status = 'pending_review';

CREATE INDEX IF NOT EXISTS idx_vendor_leads_approved ON public.vendor_leads(status)
WHERE status = 'approved';

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_vendor_leads_category_city ON public.vendor_leads(category, city);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_business_search ON public.vendor_leads(business_name, category);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_vendor_leads_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on vendor_leads changes
CREATE TRIGGER update_vendor_leads_updated_at
    BEFORE UPDATE ON public.vendor_leads
    FOR EACH ROW EXECUTE FUNCTION public.update_vendor_leads_updated_at_column();