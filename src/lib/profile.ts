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
            'first_name', 'last_name', 'phone', 'city'
        ] as const

        const optionalFields = [
            'country', 'bio', 'business_name'
        ] as const

        let completed = 0
        let total = requiredFields.length

        // Check required fields
        for (const field of requiredFields) {
            if (profile[field] && profile[field] !== '') completed++
        }

        // Check optional fields
        for (const field of optionalFields) {
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
    const functionTimestamp = new Date().toISOString();

    try {
        // First check if profile exists
        console.log(`[${functionTimestamp}] 🔍 Checking if profile exists for user:`, session.user.id);
        const checkStartTime = Date.now();

        const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        const checkDuration = Date.now() - checkStartTime;

        if (existingProfile && !fetchError) {
            console.log(`[${new Date().toISOString()}] ✅ Profile already exists (${checkDuration}ms check):`, {
                userId: session.user.id,
                profileId: existingProfile.id,
                profileAge: existingProfile.created_at ? Math.floor((Date.now() - new Date(existingProfile.created_at).getTime()) / 1000 / 60) + ' minutes old' : 'unknown'
            });
            return { profile: existingProfile, created: false };
        }

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
            console.log(`[${new Date().toISOString()}] ⚠️ Profile check error (${checkDuration}ms):`, {
                error: fetchError.message,
                code: fetchError.code
            });
        }

        // Profile doesn't exist, create it
        console.log(`[${new Date().toISOString()}] 👤 Profile not found, creating new profile for user:`, session.user.id);

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

        console.log(`[${new Date().toISOString()}] 📝 Creating profile with data:`, {
            userId: profileData.id,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            email: profileData.email,
            user_type: profileData.user_type,
            user_status: profileData.user_status
        });

        const createStartTime = Date.now();
        const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .upsert(profileData, { onConflict: 'id' })
            .select('*')
            .single();

        const createDuration = Date.now() - createStartTime;

        if (createError) {
            console.error(`[${new Date().toISOString()}] ❌ Error creating profile (${createDuration}ms):`, {
                error: createError.message,
                code: createError.code,
                details: createError.details,
                userId: session.user.id
            });
            return { profile: null, created: false, error: createError };
        }

        console.log(`[${new Date().toISOString()}] ✅ Profile created successfully (${createDuration}ms):`, {
            profileId: newProfile.id,
            userId: newProfile.id,
            first_name: newProfile.first_name,
            last_name: newProfile.last_name,
            email: newProfile.email,
            user_type: newProfile.user_type,
            user_status: newProfile.user_status,
            created_at: newProfile.created_at
        });

        return { profile: newProfile, created: true };

    } catch (error) {
        const errorObj = error as any;
        console.error(`[${new Date().toISOString()}] 💥 Unexpected error in ensureUserProfile:`, {
            error: errorObj?.message || errorObj || 'Unknown error',
            userId: session.user.id,
            stack: errorObj?.stack
        });
        return { profile: null, created: false, error: errorObj };
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
