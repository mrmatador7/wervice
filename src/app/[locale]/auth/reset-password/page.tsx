'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-browser';
import { useTranslations, useLocale } from 'next-intl';
import { FiMail } from 'react-icons/fi';

export default function ResetPasswordPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setIsSuccess(false);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/${locale}/auth/update-password`,
      });
      if (error) {
        setError(error.message);
      } else {
        setIsSuccess(true);
      }
    } catch {
      setError(t('reset.error', { defaultValue: 'An error occurred. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F1EE] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[900px] overflow-hidden rounded-[28px] border border-black/10 bg-[#F7F5F2] shadow-[0_20px_60px_rgba(17,25,12,0.12)]">
        <div className="grid lg:grid-cols-2">
          <aside className="relative hidden border-r border-black/10 bg-[#ECE8E1] p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -left-16 top-[-120px] h-[320px] w-[320px] rounded-full bg-[#D9FF0A]/35 blur-3xl" />
            <Link href={`/${locale}`} className="relative z-10 w-fit">
              <Image src="/wervice-logo-black.png" alt="Wervice Logo" width={180} height={54} className="h-11 w-auto" />
            </Link>
            <div className="relative z-10">
              <h1 className="text-4xl font-black leading-[1] text-[#11190C]">Reset your password</h1>
              <p className="mt-4 text-[#4A5C74]">We&apos;ll send a secure reset link to your email.</p>
            </div>
          </aside>

          <main className="p-6 sm:p-10">
            <h2 className="text-3xl font-black text-[#11190C]">{t('reset.title', { defaultValue: 'Reset your password' })}</h2>
            <p className="mt-2 text-[#5F6F84]">
              {t('reset.subtitle', { defaultValue: "Enter your email address and we'll send you a link to reset your password." })}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#33475F]">
                  {t('signin.email', { defaultValue: 'Email address' })}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#D2D9E5] bg-white px-4 py-3 text-[#11190C] outline-none transition focus:border-[#11190C]"
                  placeholder={t('reset.emailPlaceholder', { defaultValue: 'Enter your email' })}
                />
              </div>

              {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
              {isSuccess && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  {t('reset.success', { defaultValue: 'Reset link sent. Check your inbox.' })}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#11190C] px-4 py-3.5 font-semibold text-[#D9FF0A] transition hover:brightness-110 disabled:opacity-60"
              >
                <FiMail className="h-4 w-4" />
                {isLoading ? t('reset.sending', { defaultValue: 'Sending...' }) : t('reset.sendResetLink', { defaultValue: 'Send reset link' })}
              </button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
