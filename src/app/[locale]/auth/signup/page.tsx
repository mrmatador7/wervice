'use client';

// Removed Auth UI imports - using custom form only
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { AuthError } from '@supabase/supabase-js';
import Header from '@/components/layout/Header';

interface SignupResponse {
    data: {
        user: unknown;
        session: unknown;
    };
    error: AuthError | null;
}

export default function SignPage() {
    const router = useRouter();
    const t = useTranslations('auth');
    const locale = useLocale();
    const supabase = createClientComponentClient();
    // Using custom form only
    const [signupData, setSignupData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCustomSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        console.log('🚀 Starting signup process...', {
            email: signupData.email,
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            locale
        });

        try {
            console.log('📡 Sending signup request to Supabase...');

            const { data, error } = await supabase.auth.signUp({
                email: signupData.email,
                password: signupData.password,
                options: {
                    data: {
                        first_name: signupData.firstName,
                        last_name: signupData.lastName,
                        locale: locale,
                        currency: 'MAD'
                    },
                    emailRedirectTo: `/${locale}/onboarding`
                }
            });

            console.log('📡 Signup response received:', { hasData: !!data, hasError: !!error, userId: data?.user?.id });

            if (error) {
                console.error('❌ Supabase signup error:', error);
                setError(error.message);
                setIsLoading(false);
                return;
            }

            if (data.user) {
                console.log('✅ Custom signup successful, user created:', {
                    id: data.user.id,
                    email: data.user.email,
                    emailConfirmed: data.user.email_confirmed_at,
                    session: !!data.session
                });

                // If we got a session directly from signup, use it
                if (data.session) {
                    console.log('✅ Session established directly from signup');
                    console.log('🔄 Redirecting to onboarding page...');
                    window.location.href = `/${locale}/onboarding`;
                    return;
                }

                // Otherwise, try to sign in the user manually
                console.log('🔄 No session from signup, attempting manual sign in...');
                const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                    email: signupData.email,
                    password: signupData.password
                });

                if (signInError) {
                    console.error('❌ Failed to sign in after signup:', signInError);
                    setError('Account created but sign in failed. Please try signing in manually.');
                    setIsLoading(false);
                    return;
                }

                if (signInData.session) {
                    console.log('✅ Manual sign in successful after signup');
                    console.log('🔄 Redirecting to onboarding page...');
                    window.location.href = `/${locale}/onboarding`;
                } else {
                    console.log('⚠️ Sign in completed but no session established');
                    setError('Account created but session not established. Please try signing in.');
                    setIsLoading(false);
                }
            } else {
                // Handle case where signup doesn't return a user (shouldn't happen but defensive programming)
                console.warn('⚠️ Signup completed but no user data received');
                setError('Signup completed but user data not received. Please try signing in instead.');
                setIsLoading(false);
            }
        } catch (err) {
            console.error('💥 Signup process failed:', err);
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('👤 Signup page mounted, locale:', locale)
        // Removed auth state listener to prevent conflicts during signup flow
    }, [locale]);

    // Safety net: Reset loading state if component unmounts while loading
    useEffect(() => {
        return () => {
            if (isLoading) {
                console.log('🛡️ Component unmounting while loading - resetting state');
                setIsLoading(false);
            }
        };
    }, [isLoading]);

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
                            {/* Custom signup form */}
                            <form onSubmit={handleCustomSignup} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('signup.firstName', { defaultValue: 'First Name' })}
                                        </label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            required
                                            value={signupData.firstName}
                                            onChange={(e) => setSignupData(prev => ({ ...prev, firstName: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('signup.lastName', { defaultValue: 'Last Name' })}
                                        </label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            required
                                            value={signupData.lastName}
                                            onChange={(e) => setSignupData(prev => ({ ...prev, lastName: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('signup.email', { defaultValue: 'Email address' })}
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={signupData.email}
                                        onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('signup.password', { defaultValue: 'Create a password' })}
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        minLength={6}
                                        value={signupData.password}
                                        onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {error && (
                                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading
                                        ? t('signup.loading', { defaultValue: 'Creating account...' })
                                        : t('signup.button', { defaultValue: 'Create account' })
                                    }
                                </button>

                                <div className="mt-4 text-center text-xs text-gray-500">
                                    You can verify your email later to access all features
                                </div>
                            </form>
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
