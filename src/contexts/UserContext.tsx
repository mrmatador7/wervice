'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { authStorage, type CachedUserData } from '@/lib/localStorage';

interface UserProfile {
    id?: string;
    user_type?: string;
    onboarded?: boolean;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    city?: string;
    [key: string]: any;
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasInitialized, setHasInitialized] = useState(false);

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
                    // Clear cached data on authentication failure
                    authStorage.clear();
                    setUser(null);
                    setProfile(null);
                } else {
                    throw new Error(`Failed to fetch profile: ${profileResponse.statusText}`);
                }
                return;
            }

            const profileData = await profileResponse.json();

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
                user_type: profileData.user_type,
                onboarded: profileData.onboarded,
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
            console.error('Error fetching user data:', err);
            setError(err instanceof Error ? err.message : 'Failed to load user data');

            // Clear cached data on error
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
                setUser(null);
                setProfile(null);
                console.log('✅ User signed out successfully');
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

            setHasInitialized(true);
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
