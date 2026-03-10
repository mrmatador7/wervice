'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { authStorage } from '@/lib/localStorage';

interface UserProfile {
    id?: string;
    user_type?: string;
    onboarded?: boolean;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    city?: string;
    wedding_date?: string;
    guest_count?: number | string;
    budget?: string;
    language?: string;
    currency?: string;
    email_notifications?: boolean;
    whatsapp_notifications?: boolean;
    [key: string]: unknown;
}

interface UserContextType {
    user: User | null;
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    refreshUserData: () => Promise<void>;
    signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    // Initialize with null - we'll load from localStorage after mount
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserData = async (isBackgroundValidation = false) => {
        try {
            setError(null);

            // Single optimized call to get both user and profile data
            const profileResponse = await fetch('/api/profiles/me', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });

            if (!profileResponse.ok) {
                if (profileResponse.status === 401) {
                    // Only clear if this is not the initial load (give cookies time to be set)
                    // Check if we have cached data - if so, this might be a timing issue
                    const cachedData = authStorage.get();
                    if (!cachedData) {
                        // No cache, this is a real auth failure
                        authStorage.clear();
                        setUser(null);
                        setProfile(null);
                    } else {
                        // Have cache, might be timing issue - keep cached data and retry later
                        console.log('Profile fetch returned 401 but we have cached data, might be timing issue');
                        // Don't clear, just return - will retry on next refresh
                    }
                } else {
                    throw new Error(`Failed to fetch profile: ${profileResponse.statusText}`);
                }
                return;
            }

            const payload = await profileResponse.json();
            const profileData = payload?.user ?? payload;

            // Construct user object from personal info (minimal user data)
            const userObj = {
                id: profileData.id,
                email: profileData.email,
                // Add other basic user properties as needed
            };

            // Profile data is now the personal info object
            const profileObj: UserProfile = {
                id: profileData.id,
                email: profileData.email,
                first_name: profileData.first_name,
                last_name: profileData.last_name,
                city: profileData.city,
                phone: profileData.phone,
                user_type: profileData.user_type,
                onboarded: profileData.onboarded,
                wedding_date: profileData.wedding_date,
                guest_count: profileData.guest_count,
                budget: profileData.budget,
                language: profileData.language,
                currency: profileData.currency,
                email_notifications: profileData.email_notifications,
                whatsapp_notifications: profileData.whatsapp_notifications,
            };

            // Update state
            setUser(userObj as User);
            setProfile(profileObj);

            // Cache the fresh data
            authStorage.set({
                user: userObj as User,
                profile: profileObj,
            });

        } catch (err) {
            const cachedData = authStorage.get();
            const isTransientNetworkError =
                (err instanceof TypeError && /fetch|network/i.test(err.message)) ||
                (err instanceof Error && err.name === 'AbortError');

            if (isTransientNetworkError) {
                if (cachedData) {
                    // Keep existing session state on temporary network issues.
                    setUser(cachedData.user);
                    setProfile(cachedData.profile);
                }
                if (!isBackgroundValidation) {
                    setError('Network connection issue. Retrying automatically.');
                }
                return;
            }

            console.error('Error fetching user data:', err);
            setError(err instanceof Error ? err.message : 'Failed to load user data');

            // Keep cached data if available; clear only when we have no usable cache.
            if (cachedData) {
                setUser(cachedData.user);
                setProfile(cachedData.profile);
                return;
            }

            authStorage.clear();
            setUser(null);
            setProfile(null);
        } finally {
            if (!isBackgroundValidation) {
                setIsLoading(false);
            }
        }
    };

    const refreshUserData = async () => {
        setIsLoading(true);
        await fetchUserData();
    };

    const signOut = async () => {
        try {
            const response = await fetch('/api/auth/signout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                // Clear localStorage immediately
                authStorage.clear();
                localStorage.removeItem('wervice_user');
                localStorage.removeItem('wervice_profile');
                setUser(null);
                setProfile(null);
                console.log('✅ User signed out successfully');
                
                // Redirect to homepage
                const locale = window.location.pathname.split('/')[1] || 'en';
                window.location.href = `/${locale}`;
            }
        } catch (error) {
            console.error('❌ Error signing out:', error);
        }
    };

    // Initialize from localStorage after component mounts (client-side only)
    useEffect(() => {
        const initializeAuth = async () => {
            // Load from localStorage
            const cachedData = authStorage.get();

            if (cachedData) {
                // Set cached data immediately
                setUser(cachedData.user);
                setProfile(cachedData.profile);

                // Validate in background if cache is fresh, otherwise fetch fresh
                if (!authStorage.isExpired()) {
                    setIsLoading(false);
                    fetchUserData(true); // Background validation
                } else {
                    setIsLoading(true);
                    fetchUserData(); // Fresh fetch
                }
            } else {
                // No cache, fetch fresh data
                setIsLoading(true);
                fetchUserData();
            }

        };

        initializeAuth();

        // Refresh only every 15 minutes for better performance
        const interval = setInterval(() => fetchUserData(true), 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                profile,
                isLoading,
                error,
                refreshUserData,
                signOut,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
