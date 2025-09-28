import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Custom hook for auth state management
export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            console.log('🔐 Initializing auth state...');
            setIsLoading(true);

            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('❌ Error getting session:', error);
                    setUser(null);
                } else {
                    console.log('✅ Session loaded:', {
                        hasSession: !!session,
                        userEmail: session?.user?.email,
                        userId: session?.user?.id,
                        provider: session?.user?.app_metadata?.provider
                    });
                    setUser(session?.user ?? null);
                }
            } catch (err) {
                console.error('❌ Unexpected error initializing auth:', err);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('🔄 Auth state changed:', {
                    event,
                    hasSession: !!session,
                    userEmail: session?.user?.email,
                    userId: session?.user?.id,
                    provider: session?.user?.app_metadata?.provider
                });

                setUser(session?.user ?? null);
                setIsLoading(false);

                if (event === 'SIGNED_IN') {
                    console.log('✅ User signed in');
                } else if (event === 'SIGNED_OUT') {
                    console.log('🚪 User signed out');
                } else if (event === 'TOKEN_REFRESHED') {
                    console.log('🔄 Token refreshed');
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    return { user, isLoading };
};
