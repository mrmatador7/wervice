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
    static async getProfile(userId: string): Promise<{ data: Profile | null; error: any }> {
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
    static async upsertProfile(profile: ProfileInsert): Promise<{ data: Profile | null; error: any }> {
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
    static async updateProfile(userId: string, updates: ProfileUpdate): Promise<{ data: Profile | null; error: any }> {
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
    static async getPotentialClients(): Promise<{ data: Profile[] | null; error: any }> {
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
    static async getVendorsByCategory(category: string): Promise<{ data: Profile[] | null; error: any }> {
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
    static async getUpcomingWeddings(limit = 50): Promise<{ data: Profile[] | null; error: any }> {
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
    static async updatePlanningStage(userId: string, stage: 'exploring' | 'planning' | 'booked' | 'completed'): Promise<{ error: any }> {
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
    ): Promise<{ error: any }> {
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
    static async searchByLocation(location: string): Promise<{ data: Profile[] | null; error: any }> {
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
    static createDefaultProfile(userId: string, userMetadata?: any): ProfileInsert {
        return {
            id: userId,
            first_name: userMetadata?.first_name || null,
            last_name: userMetadata?.last_name || null,
            display_name: userMetadata?.full_name || null,
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
 * Create a profile for a user if it doesn't exist
 * Used in middleware to ensure all authenticated users have profiles
 */
export async function ensureUserProfile(session: any): Promise<{ profile: any; created: boolean; error?: any }> {
    try {
        // First check if profile exists
        const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (existingProfile && !fetchError) {
            console.log('✅ Profile already exists for user:', session.user.id);
            return { profile: existingProfile, created: false };
        }

        // Profile doesn't exist, create it
        console.log('👤 Creating new profile for user:', session.user.id);

        const profileData = {
            id: session.user.id,
            first_name: session.user.user_metadata?.first_name || session.user.user_metadata?.name?.split(' ')[0] || '',
            last_name: session.user.user_metadata?.last_name || session.user.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
            email: session.user.email || '',
            user_type: 'user' as const,
            user_status: 'active' as const,
            is_onboarded: false,
            // Set additional default values
            locale: 'en',
            currency: 'MAD'
        };

        const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .upsert(profileData, { onConflict: 'id' })
            .select('*')
            .single();

        if (createError) {
            console.error('❌ Error creating profile:', createError);
            return { profile: null, created: false, error: createError };
        }

        console.log('✅ Profile created successfully:', newProfile);
        return { profile: newProfile, created: true };

    } catch (error) {
        console.error('❌ Unexpected error in ensureUserProfile:', error);
        return { profile: null, created: false, error };
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
        ensureUserProfile,
        userId
    }
}
