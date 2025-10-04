import { supabase } from './supabase'
import type { Database } from './database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

/**
 * Profile utility functions for the Wervice wedding planning platform
 */
export class ProfileService {
    /**
     * Get a user's profile by their auth ID
     */
    static async getProfile(userId: string): Promise<{ data: Profile | null; error: unknown }> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        return { data, error }
    }

    /**
     * Create or update a user profile
     */
    static async upsertProfile(profile: ProfileInsert): Promise<{ data: Profile | null; error: unknown }> {
        const { data, error } = await supabase
            .from('profiles')
            .upsert(profile, { onConflict: 'id' })
            .select()
            .single()

        return { data, error }
    }

    /**
     * Update an existing profile
     */
    static async updateProfile(userId: string, updates: ProfileUpdate): Promise<{ data: Profile | null; error: unknown }> {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single()

        return { data, error }
    }

    /**
     * Get profiles for users in planning/booked stages (for vendors)
     */
    static async getPotentialClients(): Promise<{ data: Profile[] | null; error: unknown }> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .in('planning_stage', ['planning', 'booked'])
            .order('wedding_date', { ascending: true })

        return { data, error }
    }

    /**
     * Get vendor profiles by category
     */
    static async getVendorsByCategory(category: string): Promise<{ data: Profile[] | null; error: unknown }> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('is_vendor', true)
            .eq('vendor_category', category)

        return { data, error }
    }

    /**
     * Get upcoming weddings (for vendors to see potential business)
     */
    static async getUpcomingWeddings(limit = 50): Promise<{ data: Profile[] | null; error: unknown }> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .gt('wedding_date', new Date().toISOString().split('T')[0])
            .in('planning_stage', ['planning', 'booked'])
            .order('wedding_date', { ascending: true })
            .limit(limit)

        return { data, error }
    }

    /**
     * Update wedding planning stage
     */
    static async updatePlanningStage(userId: string, stage: 'exploring' | 'planning' | 'booked' | 'completed'): Promise<{ error: unknown }> {
        const { error } = await supabase
            .from('profiles')
            .update({
                planning_stage: stage,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)

        return { error }
    }

    /**
     * Update notification preferences
     */
    static async updateNotificationPreferences(
        userId: string,
        preferences: {
            email_marketing?: boolean
            email_updates?: boolean
            sms_reminders?: boolean
            push_notifications?: boolean
        }
    ): Promise<{ error: unknown }> {
        const { error } = await supabase
            .from('profiles')
            .update({
                notification_preferences: preferences,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)

        return { error }
    }

    /**
     * Search profiles by location (useful for vendors finding local clients)
     */
    static async searchByLocation(location: string): Promise<{ data: Profile[] | null; error: unknown }> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .ilike('location', `%${location}%`)
            .in('planning_stage', ['planning', 'booked'])

        return { data, error }
    }

    /**
     * Get profile completion percentage
     */
    static getProfileCompletion(profile: Profile): number {
        const requiredFields = [
            'first_name', 'last_name', 'phone', 'location'
        ] as const

        const weddingFields = [
            'wedding_date', 'wedding_budget', 'wedding_location', 'wedding_guest_count'
        ] as const

        let completed = 0
        let total = requiredFields.length

        // Check required fields
        for (const field of requiredFields) {
            if (profile[field] && profile[field] !== '') completed++
        }

        // Check wedding planning fields (optional but encouraged)
        for (const field of weddingFields) {
            if (profile[field]) completed++
            total++
        }

        // Check optional fields
        if (profile.avatar_url) completed++
        total++

        if (profile.bio) completed++
        total++

        return Math.round((completed / total) * 100)
    }

    /**
     * Initialize a new profile with default values
     */
    static createDefaultProfile(userId: string, userMetadata?: Record<string, unknown>): ProfileInsert {
        return {
            id: userId,
            first_name: (userMetadata?.first_name as string) || null,
            last_name: (userMetadata?.last_name as string) || null,
            display_name: (userMetadata?.full_name as string) || null,
            preferred_language: 'en',
            planning_stage: 'exploring',
            is_vendor: false,
            notification_preferences: {
                email_marketing: true,
                email_updates: true,
                sms_reminders: false,
                push_notifications: true
            }
        }
    }
}

/**
 * React hook for profile management
 * Usage:
 * const { profile, loading, updateProfile } = useProfile(user?.id)
 */
export function useProfile(userId?: string) {
    // This would typically be implemented as a custom hook with useState and useEffect
    // For now, returning the service functions
    return {
        getProfile: (id: string) => ProfileService.getProfile(id),
        updateProfile: (id: string, updates: ProfileUpdate) => ProfileService.updateProfile(id, updates),
        upsertProfile: (profile: ProfileInsert) => ProfileService.upsertProfile(profile),
        userId
    }
}
