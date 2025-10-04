'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Header from '@/components/layout/Header';

export default function SignPage() {
    const router = useRouter();
    const t = useTranslations('auth');
    const locale = useLocale();

    useEffect(() => {
        console.log('👤 Signup page mounted, locale:', locale)

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔄 Auth state changed:', { event, hasSession: !!session, userEmail: session?.user?.email })

            if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
                // Check if user signed up with OAuth (already verified) or email/password
                const provider = session.user?.app_metadata?.provider;
                const isOAuthSignup = provider && provider !== 'email';

                if (isOAuthSignup) {
                    console.log('✅ OAuth user authenticated, redirecting to dashboard')
                    router.push(`/${locale}/dashboard`);
                } else if (event === 'SIGNED_IN') {
                    console.log('✅ Email signup completed, redirecting to verify-email')
                    router.push(`/${locale}/verify-email`);
                } else {
                    // INITIAL_SESSION with email provider - already verified, go to dashboard
                    console.log('✅ Email user already authenticated, redirecting to dashboard')
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
                <Header />

                {/* Add top padding to account for fixed header */}
                <div className="pt-16 min-h-screen bg-gradient-to-br from-white/20 via-purple-50/30 to-pink-50/40 flex items-center justify-center px-4">
                    <div className="max-w-md w-full space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {t('signup.title', { defaultValue: 'Create your account' })}
                            </h2>
                            <p className="text-gray-600">
                                {t('signup.subtitle', { defaultValue: 'Join Wervice to plan your perfect Moroccan wedding' })}
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <Auth
                                supabaseClient={supabase}
                                view="sign_up"
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
                                    },
                                }}
                                providers={['google']}
                                onlyThirdPartyProviders={false}
                                localization={{
                                    variables: {
                                        sign_up: {
                                            email_label: t('signup.email', { defaultValue: 'Email address' }),
                                            password_label: t('signup.password', { defaultValue: 'Create a password' }),
                                            button_label: t('signup.button', { defaultValue: 'Create account' }),
                                            loading_button_label: t('signup.loading', { defaultValue: 'Creating account...' }),
                                            social_provider_text: 'Continue with {{provider}}',
                                            link_text: t('signup.haveAccount', { defaultValue: 'Already have an account? Sign in' })
                                        },
                                    },
                                }}
                            />
                        </div>

                        <div className="text-center text-sm text-gray-500">
                            {t('signup.agreement', {
                                defaultValue: 'By creating an account, you agree to our Terms of Service and Privacy Policy'
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
