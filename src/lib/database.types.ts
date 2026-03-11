// Database types for Supabase
// This file contains manually maintained types for the Wervice database schema

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: string
                    name: string
                    image: string
                    description: string | null
                    slug: string
                    parent_id: string | null
                    is_active: boolean
                    is_featured: boolean
                    created_at: string
                    updated_at: string
                    deleted_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    image: string
                    description?: string | null
                    slug: string
                    parent_id?: string | null
                    is_active?: boolean
                    is_featured?: boolean
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    image?: string
                    description?: string | null
                    slug?: string
                    parent_id?: string | null
                    is_active?: boolean
                    is_featured?: boolean
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "categories_parent_id_fkey"
                        columns: ["parent_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    }
                ]
            }
            businesse_types: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    created_at: string
                    updated_at: string
                    deleted_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    id: string
                    first_name: string | null
                    last_name: string | null
                    avatar_url: string | null
                    birth_date: string | null
                    gender: string | null
                    user_type: string | null
                    user_status: string | null
                    onboarded: boolean
                    phone: string | null
                    email: string | null
                    city: string | null
                    country: string | null
                    address: string | null
                    latitude: number | null
                    longitude: number | null
                    postal_code: string | null
                    locale: string | null
                    currency: string | null
                    notification_preferences: Json | null
                    onboarding_data: Json
                    onboarding_purpose: string | null
                    business_name: string | null
                    business_description: string | null
                    business_website: string | null
                    business_phone: string | null
                    business_email: string | null
                    ig_username: string | null
                    fb_username: string | null
                    ln_username: string | null
                    yt_username: string | null
                    tiktok_username: string | null
                    bio: string | null
                    is_banned: boolean | null
                    banned_reason: string | null
                    banned_at: string | null
                    banned_by: string | null
                    created_at: string
                    updated_at: string
                    deleted_at: string | null
                }
                Insert: {
                    id: string
                    first_name?: string | null
                    last_name?: string | null
                    avatar_url?: string | null
                    birth_date?: string | null
                    gender?: string | null
                    user_type?: string | null
                    user_status?: string | null
                    onboarded?: boolean
                    phone?: string | null
                    email?: string | null
                    city?: string | null
                    country?: string | null
                    address?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    postal_code?: string | null
                    locale?: string | null
                    currency?: string | null
                    notification_preferences?: Json | null
                    onboarding_data?: Json
                    onboarding_purpose?: string | null
                    business_name?: string | null
                    business_description?: string | null
                    business_website?: string | null
                    business_phone?: string | null
                    business_email?: string | null
                    ig_username?: string | null
                    fb_username?: string | null
                    ln_username?: string | null
                    yt_username?: string | null
                    tiktok_username?: string | null
                    bio?: string | null
                    is_banned?: boolean | null
                    banned_reason?: string | null
                    banned_at?: string | null
                    banned_by?: string | null
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
                Update: {
                    id?: string
                    first_name?: string | null
                    last_name?: string | null
                    avatar_url?: string | null
                    birth_date?: string | null
                    gender?: string | null
                    user_type?: string | null
                    user_status?: string | null
                    onboarded?: boolean
                    phone?: string | null
                    email?: string | null
                    city?: string | null
                    country?: string | null
                    address?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    postal_code?: string | null
                    locale?: string | null
                    currency?: string | null
                    onboarding_data?: Json
                    onboarding_purpose?: string | null
                    notification_preferences?: Json | null
                    business_name?: string | null
                    business_description?: string | null
                    business_website?: string | null
                    business_phone?: string | null
                    business_email?: string | null
                    ig_username?: string | null
                    fb_username?: string | null
                    ln_username?: string | null
                    yt_username?: string | null
                    tiktok_username?: string | null
                    bio?: string | null
                    is_banned?: boolean | null
                    banned_reason?: string | null
                    banned_at?: string | null
                    banned_by?: string | null
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            vendor_contact_messages: {
                Row: {
                    id: string
                    vendor_name: string
                    vendor_category: string | null
                    vendor_city: string | null
                    vendor_url: string | null
                    locale: string
                    sender_name: string
                    sender_phone: string
                    sender_account_email: string | null
                    message: string
                    is_read: boolean
                    is_flagged: boolean
                    is_archived: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    vendor_name: string
                    vendor_category?: string | null
                    vendor_city?: string | null
                    vendor_url?: string | null
                    locale?: string
                    sender_name: string
                    sender_phone: string
                    sender_account_email?: string | null
                    message: string
                    is_read?: boolean
                    is_flagged?: boolean
                    is_archived?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    vendor_name?: string
                    vendor_category?: string | null
                    vendor_city?: string | null
                    vendor_url?: string | null
                    locale?: string
                    sender_name?: string
                    sender_phone?: string
                    sender_account_email?: string | null
                    message?: string
                    is_read?: boolean
                    is_flagged?: boolean
                    is_archived?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            vendor_leads: {
                Row: {
                    id: string
                    first_name: string
                    last_name: string
                    business_name: string
                    category: string
                    city: string
                    whatsapp: string
                    email: string
                    google_maps: string | null
                    instagram: string | null
                    profile_starting_price: string | null
                    profile_description: string
                    service_area: string[]
                    languages_spoken: string[]
                    subscription_cadence: Database["public"]["Enums"]["subscription_cadence"]
                    subscription_price_dhs: number
                    domain_perk_enabled: boolean
                    domain_perk_requested_domain: string | null
                    domain_perk_tld: Database["public"]["Enums"]["domain_tld"] | null
                    logo_url: string | null
                    gallery_urls: string[]
                    source: string
                    status: Database["public"]["Enums"]["vendor_lead_status"]
                    admin_notes: string | null
                    reviewed_by: string | null
                    reviewed_at: string | null
                    honeypot: string
                    submitted_at: string
                    created_at: string
                    updated_at: string
                    deleted_at: string | null
                }
                Insert: {
                    id?: string
                    first_name: string
                    last_name: string
                    business_name: string
                    category: string
                    city: string
                    whatsapp: string
                    email: string
                    google_maps?: string | null
                    instagram?: string | null
                    profile_starting_price?: string | null
                    profile_description: string
                    service_area?: string[]
                    languages_spoken?: string[]
                    subscription_cadence: Database["public"]["Enums"]["subscription_cadence"]
                    subscription_price_dhs: number
                    domain_perk_enabled?: boolean
                    domain_perk_requested_domain?: string | null
                    domain_perk_tld?: Database["public"]["Enums"]["domain_tld"] | null
                    logo_url?: string | null
                    gallery_urls?: string[]
                    source?: string
                    status?: Database["public"]["Enums"]["vendor_lead_status"]
                    admin_notes?: string | null
                    reviewed_by?: string | null
                    reviewed_at?: string | null
                    honeypot?: string
                    submitted_at?: string
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
                Update: {
                    id?: string
                    first_name?: string
                    last_name?: string
                    business_name?: string
                    category?: string
                    city?: string
                    whatsapp?: string
                    email?: string
                    google_maps?: string | null
                    instagram?: string | null
                    profile_starting_price?: string | null
                    profile_description?: string
                    service_area?: string[]
                    languages_spoken?: string[]
                    subscription_cadence?: Database["public"]["Enums"]["subscription_cadence"]
                    subscription_price_dhs?: number
                    domain_perk_enabled?: boolean
                    domain_perk_requested_domain?: string | null
                    domain_perk_tld?: Database["public"]["Enums"]["domain_tld"] | null
                    logo_url?: string | null
                    gallery_urls?: string[]
                    source?: string
                    status?: Database["public"]["Enums"]["vendor_lead_status"]
                    admin_notes?: string | null
                    reviewed_by?: string | null
                    reviewed_at?: string | null
                    honeypot?: string
                    submitted_at?: string
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "vendor_leads_reviewed_by_fkey"
                        columns: ["reviewed_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            upsert_user_profile: {
                Args: {
                    p_user_id: string
                    p_phone?: string
                    p_city?: string
                    p_onboarding_purpose?: string
                    p_onboarding_data?: Json
                }
                Returns: Json
            }
        }
        Enums: {
            user_type: "user" | "vendor" | "admin" | "super_admin"
            user_status: "active" | "inactive" | "pending" | "banned"
            subscription_cadence: "monthly" | "6m" | "annual"
            vendor_lead_status: "pending_review" | "approved" | "rejected" | "contacted"
            domain_tld: ".ma" | ".com"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
