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
                    is_onboarded: boolean | null
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
                    is_onboarded?: boolean | null
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
                    is_onboarded?: boolean | null
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
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
