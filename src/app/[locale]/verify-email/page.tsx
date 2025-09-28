'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { FiMail, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';

export default function VerifyEmailPage() {
    const router = useRouter();
    const t = useTranslations('auth');
    const locale = useLocale();
    const [email, setEmail] = useState<string>('');
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState('');

    useEffect(() => {
        // Get user email from localStorage or URL params
        const user = supabase.auth.getUser();
        user.then(({ data: { user } }) => {
            if (user?.email) {
                setEmail(user.email);
            }
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                // User has verified their email, redirect to dashboard
                router.push('/dashboard');
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const handleResendEmail = async () => {
        if (!email) return;

        setIsResending(true);
        setResendMessage('');

        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
            });

            if (error) {
                setResendMessage(t('verify.error', { defaultValue: 'Failed to resend verification email. Please try again.' }));
            } else {
                setResendMessage(t('verify.resent', { defaultValue: 'Verification email sent! Please check your inbox.' }));
            }
        } catch (error) {
            setResendMessage(t('verify.error', { defaultValue: 'Failed to resend verification email. Please try again.' }));
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                        <FiMail className="w-8 h-8 text-purple-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        {t('verify.title', { defaultValue: 'Check your email' })}
                    </h1>

                    <p className="text-gray-600 mb-6">
                        {t('verify.description', {
                            defaultValue: 'We\'ve sent a verification link to your email address. Click the link to activate your account.'
                        })}
                    </p>

                    {email && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600">
                                {t('verify.sentTo', { defaultValue: 'Sent to:' })}
                            </p>
                            <p className="font-medium text-gray-900">{email}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            onClick={handleResendEmail}
                            disabled={isResending}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isResending ? (
                                <FiRefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <FiMail className="w-4 h-4" />
                            )}
                            {isResending
                                ? t('verify.resending', { defaultValue: 'Resending...' })
                                : t('verify.resend', { defaultValue: 'Resend verification email' })
                            }
                        </button>

                        {resendMessage && (
                            <p className={`text-sm ${resendMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                                {resendMessage}
                            </p>
                        )}

                        <div className="text-sm text-gray-500 space-y-2">
                            <p>
                                {t('verify.spam', { defaultValue: 'Can\'t find the email? Check your spam folder.' })}
                            </p>
                            <p>
                                {t('verify.support', { defaultValue: 'Need help? Contact our support team.' })}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => router.push(`/${locale}/auth/signin`)}
                            className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                        >
                            ← {t('verify.backToSignIn', { defaultValue: 'Back to sign in' })}
                        </button>
                    </div>
                </div>

                <div className="text-center text-sm text-gray-500">
                    {t('verify.footer', {
                        defaultValue: 'By verifying your email, you agree to our Terms of Service and Privacy Policy'
                    })}
                </div>
            </div>
        </div>
    );
}
