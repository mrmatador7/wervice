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
            profiles: {
                Row: {
                    id: string
                    first_name: string | null
                    last_name: string | null
                    display_name: string | null
                    avatar_url: string | null
                    phone: string | null
                    location: string | null
                    wedding_date: string | null
                    wedding_budget: number | null
                    wedding_budget_currency: string | null
                    wedding_location: string | null
                    wedding_guest_count: number | null
                    partner_first_name: string | null
                    partner_last_name: string | null
                    partner_email: string | null
                    partner_phone: string | null
                    preferred_language: string | null
                    notification_preferences: Json | null
                    planning_stage: string | null
                    wedding_theme: string | null
                    wedding_style: string | null
                    is_vendor: boolean | null
                    vendor_category: string | null
                    business_name: string | null
                    business_description: string | null
                    business_website: string | null
                    business_phone: string | null
                    business_email: string | null
                    instagram_handle: string | null
                    facebook_profile: string | null
                    pinterest_board: string | null
                    bio: string | null
                    special_requirements: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    first_name?: string | null
                    last_name?: string | null
                    display_name?: string | null
                    avatar_url?: string | null
                    phone?: string | null
                    location?: string | null
                    wedding_date?: string | null
                    wedding_budget?: number | null
                    wedding_budget_currency?: string | null
                    wedding_location?: string | null
                    wedding_guest_count?: number | null
                    partner_first_name?: string | null
                    partner_last_name?: string | null
                    partner_email?: string | null
                    partner_phone?: string | null
                    preferred_language?: string | null
                    notification_preferences?: Json | null
                    planning_stage?: string | null
                    wedding_theme?: string | null
                    wedding_style?: string | null
                    is_vendor?: boolean | null
                    vendor_category?: string | null
                    business_name?: string | null
                    business_description?: string | null
                    business_website?: string | null
                    business_phone?: string | null
                    business_email?: string | null
                    instagram_handle?: string | null
                    facebook_profile?: string | null
                    pinterest_board?: string | null
                    bio?: string | null
                    special_requirements?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    first_name?: string | null
                    last_name?: string | null
                    display_name?: string | null
                    avatar_url?: string | null
                    phone?: string | null
                    location?: string | null
                    wedding_date?: string | null
                    wedding_budget?: number | null
                    wedding_budget_currency?: string | null
                    wedding_location?: string | null
                    wedding_guest_count?: number | null
                    partner_first_name?: string | null
                    partner_last_name?: string | null
                    partner_email?: string | null
                    partner_phone?: string | null
                    preferred_language?: string | null
                    notification_preferences?: Json | null
                    planning_stage?: string | null
                    wedding_theme?: string | null
                    wedding_style?: string | null
                    is_vendor?: boolean | null
                    vendor_category?: string | null
                    business_name?: string | null
                    business_description?: string | null
                    business_website?: string | null
                    business_phone?: string | null
                    business_email?: string | null
                    instagram_handle?: string | null
                    facebook_profile?: string | null
                    pinterest_board?: string | null
                    bio?: string | null
                    special_requirements?: string | null
                    created_at?: string
                    updated_at?: string
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
