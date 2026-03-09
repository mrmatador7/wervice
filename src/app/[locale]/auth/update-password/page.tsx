'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { FiLock, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const t = useTranslations('auth');
  const locale = useLocale();
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.replace(`/${locale}/auth-access?mode=signin`);
    };
    checkUser();
  }, [router, locale, supabase.auth]);

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
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setIsSuccess(true);
        setTimeout(() => router.push(`/${locale}/settings`), 1200);
      }
    } catch {
      setError(t('update.error', { defaultValue: 'An error occurred. Please try again.' }));
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
              <h1 className="text-4xl font-black leading-[1] text-[#11190C]">Set a new password</h1>
              <p className="mt-4 text-[#4A5C74]">Keep your account secure with a strong password.</p>
            </div>
          </aside>

          <main className="p-6 sm:p-10">
            {isSuccess ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
                <FiCheckCircle className="mx-auto h-10 w-10 text-green-600" />
                <h2 className="mt-3 text-2xl font-bold text-[#11190C]">{t('update.successTitle', { defaultValue: 'Password updated!' })}</h2>
                <p className="mt-1 text-[#4A5C74]">{t('update.redirecting', { defaultValue: 'Redirecting...' })}</p>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black text-[#11190C]">{t('update.title', { defaultValue: 'Update your password' })}</h2>
                <p className="mt-2 text-[#5F6F84]">{t('update.subtitle', { defaultValue: 'Enter your new password below.' })}</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#33475F]">
                      {t('update.newPassword', { defaultValue: 'New password' })}
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full rounded-xl border border-[#D2D9E5] bg-white px-4 py-3 pr-11 text-[#11190C] outline-none transition focus:border-[#11190C]"
                      />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8FA2BF]">
                        {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-[#33475F]">
                      {t('update.confirmPassword', { defaultValue: 'Confirm password' })}
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full rounded-xl border border-[#D2D9E5] bg-white px-4 py-3 pr-11 text-[#11190C] outline-none transition focus:border-[#11190C]"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8FA2BF]">
                        {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#11190C] px-4 py-3.5 font-semibold text-[#D9FF0A] transition hover:brightness-110 disabled:opacity-60"
                  >
                    <FiLock className="h-4 w-4" />
                    {isLoading ? t('update.updating', { defaultValue: 'Updating...' }) : t('update.updatePassword', { defaultValue: 'Update password' })}
                  </button>
                </form>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
