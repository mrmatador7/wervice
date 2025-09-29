'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import GlassmorphismHeader from '@/components/GlassmorphismHeader';
import { ProfileService } from '@/lib/profile';

export default function SignInPage() {
    const router = useRouter();
    const t = useTranslations('auth');
    const locale = useLocale();

    useEffect(() => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] 👤 Signin page mounted, locale:`, locale)
        console.log(`[${timestamp}] 🔗 Current URL:`, window.location.href)

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            const eventTimestamp = new Date().toISOString();
            console.log(`[${eventTimestamp}] 🔄 Auth state changed:`, {
                event,
                hasSession: !!session,
                userId: session?.user?.id,
                userEmail: session?.user?.email,
                userProvider: session?.user?.app_metadata?.provider,
                sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null
            })

            if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
                console.log(`[${eventTimestamp}] ✅ User authenticated, starting profile check process`)

                try {
                    // Check if user has a profile
                    console.log(`[${eventTimestamp}] 🔍 Checking profile for user:`, session.user.id);
                    const profileStartTime = Date.now();

                    const { data: profile, error } = await ProfileService.getProfile(session.user.id);
                    const profileCheckDuration = Date.now() - profileStartTime;

                    console.log(`[${new Date().toISOString()}] 🔍 Profile check completed in ${profileCheckDuration}ms:`, {
                        profileExists: !!profile,
                        profile: profile ? {
                            id: profile.id,
                            first_name: profile.first_name,
                            last_name: profile.last_name,
                            email: profile.email,
                            user_type: profile.user_type,
                            user_status: profile.user_status,
                            created_at: profile.created_at,
                            updated_at: profile.updated_at
                        } : null,
                        error: error ? {
                            message: error.message,
                            details: error.details,
                            hint: error.hint
                        } : null
                    });

                    if (error) {
                        console.error(`[${new Date().toISOString()}] ❌ Error fetching profile:`, {
                            error: error.message,
                            code: error.code,
                            details: error.details,
                            userId: session.user.id
                        });
                        // If there's an error fetching profile, redirect to onboarding to create one
                        console.log(`[${new Date().toISOString()}] 🚨 Error occurred, redirecting to onboarding for profile creation`);
                        router.push(`/${locale}/onboarding`);
                        return;
                    }

                    if (profile) {
                        // User has a profile, redirect to dashboard
                        console.log(`[${new Date().toISOString()}] ✅ User has profile, redirecting to dashboard:`, {
                            userId: profile.id,
                            destination: `/${locale}/dashboard`,
                            profileAge: profile.created_at ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / 1000 / 60) + ' minutes old' : 'unknown'
                        });
                        router.push(`/${locale}/dashboard`);
                    } else {
                        // User doesn't have a profile, redirect to onboarding
                        console.log(`[${new Date().toISOString()}] 📝 User has no profile, redirecting to onboarding:`, {
                            userId: session.user.id,
                            destination: `/${locale}/onboarding`,
                            reason: 'Profile not found in database'
                        });
                        router.push(`/${locale}/onboarding`);
                    }
                } catch (error) {
                    console.error('❌ Error checking onboarding status:', error);
                    // Fallback to dashboard if there's an error
                    router.push(`/${locale}/dashboard`);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [router, locale]);

    return (
        <div className="min-h-screen relative">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    alt="Beautiful Moroccan wedding scene with traditional elements"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <GlassmorphismHeader />

                {/* Add top padding to account for fixed header */}
                <div className="pt-16 min-h-screen bg-gradient-to-br from-white/20 via-purple-50/30 to-pink-50/40 flex items-center justify-center px-4">
                    <div className="max-w-md w-full space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {t('signin.title', { defaultValue: 'Welcome back' })}
                            </h2>
                            <p className="text-gray-600">
                                {t('signin.subtitle', { defaultValue: 'Sign in to your Wervice account' })}
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <Auth
                                supabaseClient={supabase}
                                view="sign_in"
                                redirectTo={`/${locale}/dashboard`}
                                appearance={{
                                    theme: ThemeSupa,
                                    variables: {
                                        default: {
                                            colors: {
                                                brand: '#8B5CF6',
                                                brandAccent: '#7C3AED',
                                            },
                                            borderWidths: {
                                                buttonBorderWidth: '1px',
                                                inputBorderWidth: '1px',
                                            },
                                            radii: {
                                                borderRadiusButton: '0.75rem',
                                                buttonBorderRadius: '0.75rem',
                                                inputBorderRadius: '0.75rem',
                                            },
                                        },
                                    },
                                    className: {
                                        container: 'w-full',
                                        button: 'w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                                        input: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                                        label: 'text-sm font-medium text-gray-700 mb-2 block',
                                        message: 'text-sm text-red-600 mt-1',
                                        anchor: 'hidden', // Hide the built-in forgot password link
                                    },
                                }}
                                providers={['google']}
                                onlyThirdPartyProviders={false}
                                localization={{
                                    variables: {
                                        sign_in: {
                                            email_label: t('signin.email', { defaultValue: 'Email address' }),
                                            password_label: t('signin.password', { defaultValue: 'Password' }),
                                            button_label: t('signin.button', { defaultValue: 'Sign in' }),
                                            loading_button_label: t('signin.loading', { defaultValue: 'Signing in...' }),
                                            social_provider_text: 'Continue with {{provider}}',
                                            link_text: t('signin.noAccount', { defaultValue: 'Don\'t have an account? Sign up' })
                                        },
                                    },
                                }}
                            />
                        </div>

                        <div className="text-center">
                            <Link
                                href={`/${locale}/auth/reset-password`}
                                className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
                            >
                                {t('signin.forgotPassword')}
                            </Link>
                        </div>

                        <div className="text-center text-sm text-gray-500">
                            {t('signin.agreement')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
