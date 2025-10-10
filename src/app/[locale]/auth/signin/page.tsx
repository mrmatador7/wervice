'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export default function SignInPage() {
    const router = useRouter();
    const t = useTranslations('auth');
    const locale = useLocale();

    const [signinData, setSigninData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCustomSignin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        console.log('🚀 Starting signin process via API...', {
            email: signinData.email,
            locale
        });

        try {
            console.log('📡 Sending signin request to API...');

            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication
                body: JSON.stringify({
                    email: signinData.email,
                    password: signinData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('❌ API signin error:', data.error);
                setError(data.error || 'Sign in failed');
                setIsLoading(false);
                return;
            }

            console.log('✅ API signin successful:', {
                success: data.success,
                userId: data.user?.id,
                message: data.message
            });

            // Save user information to localStorage
            if (data.user) {
                const userInfo = {
                    id: data.user.id,
                    email: data.user.email,
                    signedInAt: new Date().toISOString()
                };

                localStorage.setItem('wervice_user', JSON.stringify(userInfo));
                console.log('💾 User info saved to localStorage:', userInfo);
            }

            console.log('✅ User authenticated via signin API');
            console.log('🔄 Syncing auth state and redirecting to account...');

            // Force a complete page reload to ensure auth state is synced
            window.location.replace(`/${locale}/account`);

        } catch (err) {
            console.error('💥 Signin process failed:', err);
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('👤 Signin page mounted, locale:', locale);
    }, [locale]);

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
                                {t('signin.title', { defaultValue: 'Welcome back' })}
                            </h2>
                            <p className="text-gray-600">
                                {t('signin.subtitle', { defaultValue: 'Sign in to your Wervice account' })}
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <form onSubmit={handleCustomSignin} className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('signin.email', { defaultValue: 'Email address' })}
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={signinData.email}
                                        onChange={(e) => setSigninData({ ...signinData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                        placeholder={t('signin.emailPlaceholder', { defaultValue: 'Enter your email' })}
                                    />
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('signin.password', { defaultValue: 'Password' })}
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={signinData.password}
                                        onChange={(e) => setSigninData({ ...signinData, password: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                        placeholder={t('signin.passwordPlaceholder', { defaultValue: 'Enter your password' })}
                                    />
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                                        {error}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                >
                                    {isLoading ? t('signin.loading', { defaultValue: 'Signing in...' }) : t('signin.button', { defaultValue: 'Sign in' })}
                                </button>
                            </form>
                        </div>

                        <div className="text-center">
                            <Link
                                href={`/${locale}/auth/signup`}
                                className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
                            >
                                {t('signin.noAccount')}
                            </Link>
                        </div>

                        <div className="text-center">
                            <Link
                                href={`/${locale}/auth/reset-password`}
                                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
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
