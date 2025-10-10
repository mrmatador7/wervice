'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { FiLock, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import Header from '@/components/layout/Header';

export default function UpdatePasswordPage() {
    const router = useRouter();
    const t = useTranslations('auth');
    const locale = useLocale();
    const supabase = createClientComponentClient();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        // Check if user is authenticated and came from password reset
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push(`/${locale}/auth/signin`);
            }
        };
        checkSession();
    }, [router, locale]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError(t('update.passwordMismatch', { defaultValue: 'Passwords do not match' }));
            return;
        }

        if (password.length < 6) {
            setError(t('update.passwordTooShort', { defaultValue: 'Password must be at least 6 characters long' }));
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                setError(error.message);
            } else {
                setIsSuccess(true);
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            }
        } catch (err) {
            setError(t('update.error', { defaultValue: 'An error occurred. Please try again.' }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    alt="Beautiful Moroccan wedding scene with traditional elements"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                <Header />

                {/* Add top padding to account for fixed header */}
                <div className="pt-16 min-h-screen bg-gradient-to-br from-white/20 via-purple-50/30 to-pink-50/40 flex items-center justify-center px-4">
                    {isSuccess ? (
                        // Success view
                        <div className="max-w-md w-full space-y-8 text-center">
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <FiCheckCircle className="w-8 h-8 text-green-600" />
                                </div>

                                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                    {t('update.successTitle', { defaultValue: 'Password updated!' })}
                                </h1>

                                <p className="text-gray-600 mb-6">
                                    {t('update.successMessage', {
                                        defaultValue: 'Your password has been successfully updated. You will be redirected to your dashboard shortly.'
                                    })}
                                </p>

                                <div className="animate-pulse text-sm text-gray-500">
                                    {t('update.redirecting', { defaultValue: 'Redirecting...' })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Form view
                        <div className="max-w-md w-full space-y-8">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    {t('update.title', { defaultValue: 'Update your password' })}
                                </h2>
                                <p className="text-gray-600">
                                    {t('update.subtitle', { defaultValue: 'Enter your new password below.' })}
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('update.newPassword', { defaultValue: 'New password' })}
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder={t('update.newPasswordPlaceholder', { defaultValue: 'Enter new password' })}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('update.confirmPassword', { defaultValue: 'Confirm password' })}
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder={t('update.confirmPasswordPlaceholder', { defaultValue: 'Confirm password' })}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                {t('update.updating', { defaultValue: 'Updating...' })}
                                            </>
                                        ) : (
                                            <>
                                                <FiLock className="w-4 h-4" />
                                                {t('update.updatePassword', { defaultValue: 'Update password' })}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
