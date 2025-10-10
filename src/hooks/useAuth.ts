import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';

// Custom hook for auth state management via API
export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            console.log('🔐 Initializing auth state...');
            setIsLoading(true);

            try {
                const response = await fetch('/api/auth/session', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    console.error('❌ Error getting session:', response.statusText);
                    setUser(null);
                } else {
                    const data = await response.json();
                    console.log('✅ Session loaded:', {
                        hasSession: !!data.session,
                        userEmail: data.user?.email,
                        userId: data.user?.id,
                        provider: data.user?.app_metadata?.provider
                    });
                    setUser(data.user);
                }
            } catch (err) {
                console.error('❌ Unexpected error initializing auth:', err);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        // Set up periodic auth check (every 5 minutes)
        const interval = setInterval(initializeAuth, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    const signOut = async () => {
        try {
            const response = await fetch('/api/auth/signout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setUser(null);
                console.log('🚪 User signed out');
            }
        } catch (error) {
            console.error('❌ Error signing out:', error);
        }
    };

    return { user, isLoading, signOut };
};
