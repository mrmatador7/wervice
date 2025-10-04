'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { FiAlertCircle, FiHome } from 'react-icons/fi';
import Link from 'next/link';
import Header from '@/components/layout/Header';

function AuthCodeErrorContent() {
    const searchParams = useSearchParams();
    const t = useTranslations('auth');
    const locale = useLocale();
    const error = searchParams.get('error_description') || searchParams.get('error') || 'Unknown error';

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
                <div className="pt-16 min-h-screen bg-gradient-to-br from-white/20 via-red-50/30 to-pink-50/40 flex items-center justify-center px-4">
                    <div className="max-w-md w-full space-y-8 text-center">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <FiAlertCircle className="w-8 h-8 text-red-600" />
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                {t('error.title', { defaultValue: 'Authentication Error' })}
                            </h1>

                            <p className="text-gray-600 mb-6">
                                {t('error.description', { defaultValue: 'There was a problem with your authentication. Please try again.' })}
                            </p>

                            <div className="bg-red-50 rounded-lg p-4 mb-6">
                                <p className="text-sm text-red-800 font-medium">
                                    {t('error.details', { defaultValue: 'Error Details:' })}
                                </p>
                                <p className="text-sm text-red-700 mt-1 break-words">
                                    {error}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Link
                                    href={`/${locale}/auth/signup`}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    <FiHome className="w-4 h-4" />
                                    {t('error.tryAgain', { defaultValue: 'Try Signing Up Again' })}
                                </Link>

                                <p className="text-sm text-gray-500">
                                    {t('error.support', { defaultValue: 'Need help? Contact our support team.' })}
                                </p>
                            </div>
                        </div>

                        <div className="text-center text-sm text-gray-500">
                            {t('error.footer', { defaultValue: 'Return to our homepage to explore wedding services.' })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
    );
}

export default function AuthCodeErrorPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <AuthCodeErrorContent />
        </Suspense>
    );
}
