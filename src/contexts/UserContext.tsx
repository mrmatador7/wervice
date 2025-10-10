'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';

interface UserProfile {
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
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserData = async () => {
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
                    setUser(null);
                    setProfile(null);
                } else {
                    throw new Error(`Failed to fetch profile: ${profileResponse.statusText}`);
                }
                return;
            }

            const profileData = await profileResponse.json();
            setUser(profileData.user);
            setProfile(profileData.profile);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError(err instanceof Error ? err.message : 'Failed to load user data');
            setUser(null);
            setProfile(null);
        } finally {
            setIsLoading(false);
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
                setUser(null);
                setProfile(null);
                console.log('✅ User signed out successfully');
            }
        } catch (error) {
            console.error('❌ Error signing out:', error);
        }
    };

    useEffect(() => {
        fetchUserData();

        // Refresh only every 15 minutes for better performance
        const interval = setInterval(fetchUserData, 15 * 60 * 1000);
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
