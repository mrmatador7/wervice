'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useTranslations, useLocale } from 'next-intl';
import { FiMail, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import GlassmorphismHeader from '@/components/GlassmorphismHeader';

export default function ResetPasswordPage() {
    const t = useTranslations('auth');
    const locale = useLocale();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `/${locale}/auth/update-password`,
            });

            if (error) {
                setError(error.message);
            } else {
                setIsSuccess(true);
            }
        } catch (err) {
            setError(t('reset.error', { defaultValue: 'An error occurred. Please try again.' }));
        } finally {
            setIsLoading(false);
        }
    };

    // Main form view with header layout
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
                <GlassmorphismHeader />

                {/* Add top padding to account for fixed header */}
                <div className="pt-16 min-h-screen bg-gradient-to-br from-white/20 via-purple-50/30 to-pink-50/40 flex items-center justify-center px-4">
                    <div className="max-w-md w-full space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {t('reset.title', { defaultValue: 'Reset your password' })}
                            </h2>
                            <p className="text-gray-600">
                                {t('reset.subtitle', { defaultValue: 'Enter your email address and we\'ll send you a link to reset your password.' })}
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('signin.email', { defaultValue: 'Email address' })}
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder={t('reset.emailPlaceholder', { defaultValue: 'Enter your email' })}
                                    />
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
                                            {t('reset.sending', { defaultValue: 'Sending...' })}
                                        </>
                                    ) : (
                                        <>
                                            <FiMail className="w-4 h-4" />
                                            {t('reset.sendResetLink', { defaultValue: 'Send reset link' })}
                                        </>
                                    )}
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
