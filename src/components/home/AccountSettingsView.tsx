'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import { FiBell, FiGlobe, FiSave, FiShield } from 'react-icons/fi';
import { useUser } from '@/contexts/UserContext';
import { getDashboardCopy } from '@/components/home/dashboard-i18n';

type AccountSettingsViewProps = {
  locale: string;
};

type SettingsFormData = {
  fullName: string;
  email: string;
  phone: string;
  weddingDate: string;
  city: string;
  guestCount: string;
  budget: string;
  language: string;
  currency: string;
  emailNotifications: boolean;
  whatsappNotifications: boolean;
};

function buildInitialForm(locale: string, userEmail?: string, profile?: Record<string, any>): SettingsFormData {
  const full = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim();
  return {
    fullName: full || profile?.full_name || '',
    email: userEmail || profile?.email || '',
    phone: profile?.phone || '',
    weddingDate: profile?.wedding_date || '',
    city: profile?.city || '',
    guestCount: profile?.guest_count ? String(profile.guest_count) : '',
    budget: profile?.budget ? String(profile.budget) : '',
    language: profile?.language || locale,
    currency: profile?.currency || 'MAD',
    emailNotifications: profile?.email_notifications ?? true,
    whatsappNotifications: profile?.whatsapp_notifications ?? false,
  };
}

export default function AccountSettingsView({ locale }: AccountSettingsViewProps) {
  const copy = getDashboardCopy(locale);
  const { user, profile, isLoading, refreshUserData, signOut } = useUser();
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [securityMessage, setSecurityMessage] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  const [formData, setFormData] = useState<SettingsFormData>(() => buildInitialForm(locale));
  const [securityData, setSecurityData] = useState({
    newEmail: '',
    currentPasswordForEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setFormData(buildInitialForm(locale, user?.email || undefined, profile || undefined));
    setSecurityData((prev) => ({
      ...prev,
      newEmail: user?.email || profile?.email || '',
    }));
  }, [locale, user?.email, profile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSecurityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    setSaveMessage('');
    setSaveError('');
    try {
      const [firstName, ...rest] = formData.fullName.trim().split(' ');
      const lastName = rest.join(' ').trim();

      const response = await fetch('/api/profiles/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          first_name: firstName || '',
          last_name: lastName || firstName || '',
          phone: formData.phone || null,
          wedding_date: formData.weddingDate || null,
          city: formData.city || null,
          guest_count: formData.guestCount ? Number(formData.guestCount) : null,
          budget: formData.budget || null,
          language: formData.language || locale,
          currency: formData.currency || 'MAD',
          email_notifications: formData.emailNotifications,
          whatsapp_notifications: formData.whatsappNotifications,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to save settings');
      }

      if (data?.user) {
        setFormData(buildInitialForm(locale, user?.email || undefined, data.user));
      }
      await refreshUserData();
      setSaveMessage('Changes saved successfully.');
      setTimeout(() => setSaveMessage(''), 2200);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdateEmail = async () => {
    setSecurityError('');
    setSecurityMessage('');
    if (!securityData.newEmail || !securityData.currentPasswordForEmail) {
      setSecurityError('Please add new email and current password.');
      return;
    }

    setIsSavingSecurity(true);
    try {
      const response = await fetch('/api/auth/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          newEmail: securityData.newEmail,
          currentPassword: securityData.currentPasswordForEmail,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to change email');

      setSecurityData((prev) => ({ ...prev, currentPasswordForEmail: '' }));
      setSecurityMessage(data?.message || 'Email update requested.');
      await refreshUserData();
    } catch (err) {
      setSecurityError(err instanceof Error ? err.message : 'Unable to change email');
    } finally {
      setIsSavingSecurity(false);
    }
  };

  const handleUpdatePassword = async () => {
    setSecurityError('');
    setSecurityMessage('');
    if (!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword) {
      setSecurityError('Please complete all password fields.');
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      setSecurityError('New password and confirmation do not match.');
      return;
    }

    setIsSavingSecurity(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: securityData.currentPassword,
          newPassword: securityData.newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to change password');

      setSecurityData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setSecurityMessage(data?.message || 'Password updated successfully.');
    } catch (err) {
      setSecurityError(err instanceof Error ? err.message : 'Unable to change password');
    } finally {
      setIsSavingSecurity(false);
    }
  };

  const joinedDate = useMemo(() => {
    const raw = (profile as Record<string, any> | null)?.created_at;
    if (!raw) return '-';
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString(locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [profile, locale]);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-[#d7deea] bg-white p-8 text-[#5f6f84]">{copy.settings.loading}</div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-[#d7deea] bg-white p-8">
          <h2 className="text-2xl font-bold text-[#11190C]">{copy.settings.signinTitle}</h2>
          <p className="mt-2 text-[#5f6f84]">{copy.settings.signinSubtitle}</p>
          <Link
            href={`/${locale}/auth-access?mode=signin`}
            className="mt-5 inline-flex rounded-xl bg-[#11190C] px-4 py-2.5 text-sm font-bold text-[#D9FF0A]"
          >
            {copy.settings.signIn}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-[#11190C] sm:text-5xl">{copy.settings.title}</h1>
        <p className="mt-2 text-lg text-[#4a5c74]">{copy.settings.subtitle}</p>
      </div>

      <div className="rounded-3xl border border-[#d7deea] bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#6a7f9d]">Account Summary</p>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-[#d7deea] bg-[#FAFCFF] p-3">
            <p className="text-xs font-semibold text-[#6a7f9d]">Member since</p>
            <p className="mt-1 text-sm font-bold text-[#11190C]">{joinedDate}</p>
          </div>
          <div className="rounded-2xl border border-[#d7deea] bg-[#FAFCFF] p-3">
            <p className="text-xs font-semibold text-[#6a7f9d]">Account Type</p>
            <p className="mt-1 text-sm font-bold capitalize text-[#11190C]">{profile?.user_type || 'user'}</p>
          </div>
          <div className="rounded-2xl border border-[#d7deea] bg-[#FAFCFF] p-3">
            <p className="text-xs font-semibold text-[#6a7f9d]">Status</p>
            <p className="mt-1 text-sm font-bold text-[#2c7a4b]">Active</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[#d7deea] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#11190C]">{copy.settings.profile}</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#33475f]">{copy.settings.fullName}</span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#d2d9e5] bg-white px-3 py-2.5 text-[#11190C] focus:border-[#11190C] focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#33475f]">{copy.settings.email}</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-[#d2d9e5] bg-[#f5f7fb] px-3 py-2.5 text-[#667990]"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-[#33475f]">{copy.settings.phoneNumber}</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+212 6XX XXX XXX"
              className="w-full rounded-xl border border-[#d2d9e5] bg-white px-3 py-2.5 text-[#11190C] focus:border-[#11190C] focus:outline-none"
            />
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-[#d7deea] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#11190C]">{copy.settings.weddingDetails}</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#33475f]">{copy.settings.weddingDate}</span>
            <input
              type="date"
              name="weddingDate"
              value={formData.weddingDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#d2d9e5] bg-white px-3 py-2.5 text-[#11190C] focus:border-[#11190C] focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#33475f]">{copy.settings.city}</span>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#d2d9e5] bg-white px-3 py-2.5 text-[#11190C] focus:border-[#11190C] focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#33475f]">{copy.settings.estimatedGuests}</span>
            <input
              type="number"
              name="guestCount"
              value={formData.guestCount}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#d2d9e5] bg-white px-3 py-2.5 text-[#11190C] focus:border-[#11190C] focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#33475f]">{copy.settings.budget}</span>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#d2d9e5] bg-white px-3 py-2.5 text-[#11190C] focus:border-[#11190C] focus:outline-none"
            />
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-[#d7deea] bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-[#11190C]">
          <FiGlobe className="h-5 w-5" />
          {copy.settings.languageCurrency}
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#33475f]">{copy.settings.language}</span>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#d2d9e5] bg-white px-3 py-2.5 text-[#11190C] focus:border-[#11190C] focus:outline-none"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#33475f]">{copy.settings.currency}</span>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#d2d9e5] bg-white px-3 py-2.5 text-[#11190C] focus:border-[#11190C] focus:outline-none"
            >
              <option value="MAD">MAD - Moroccan Dirham</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-[#d7deea] bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-[#11190C]">
          <FiBell className="h-5 w-5" />
          {copy.settings.notifications}
        </h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between rounded-2xl border border-[#d2d9e5] bg-[#FAFCFF] p-4">
            <span className="text-sm font-semibold text-[#33475f]">{copy.settings.emailNotifications}</span>
            <input
              type="checkbox"
              name="emailNotifications"
              checked={formData.emailNotifications}
              onChange={handleChange}
              className="h-4 w-4"
            />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-[#d2d9e5] bg-[#FAFCFF] p-4">
            <span className="text-sm font-semibold text-[#33475f]">{copy.settings.whatsappNotifications}</span>
            <input
              type="checkbox"
              name="whatsappNotifications"
              checked={formData.whatsappNotifications}
              onChange={handleChange}
              className="h-4 w-4"
            />
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-[#d7deea] bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-[#11190C]">
          <FiShield className="h-5 w-5" />
          Security
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#33475f]">New Email</span>
            <input
              type="email"
              name="newEmail"
              value={securityData.newEmail}
              onChange={handleSecurityChange}
              className="w-full rounded-xl border border-[#d2d9e5] bg-white px-3 py-2.5 text-[#11190C] focus:border-[#11190C] focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#33475f]">Current Password (for email change)</span>
            <input
              type="password"
              name="currentPasswordForEmail"
              value={securityData.currentPasswordForEmail}
              onChange={handleSecurityChange}
              className="w-full rounded-xl border border-[#d2d9e5] bg-white px-3 py-2.5 text-[#11190C] focus:border-[#11190C] focus:outline-none"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={handleUpdateEmail}
          disabled={isSavingSecurity}
          className="mt-3 rounded-xl border border-[#d2d9e5] bg-white px-4 py-2 text-sm font-semibold text-[#33475f] hover:bg-[#F3EFE7] disabled:opacity-60"
        >
          Update Email
        </button>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#33475f]">Current Password</span>
            <input
              type="password"
              name="currentPassword"
              value={securityData.currentPassword}
              onChange={handleSecurityChange}
              className="w-full rounded-xl border border-[#d2d9e5] bg-white px-3 py-2.5 text-[#11190C] focus:border-[#11190C] focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#33475f]">New Password</span>
            <input
              type="password"
              name="newPassword"
              value={securityData.newPassword}
              onChange={handleSecurityChange}
              className="w-full rounded-xl border border-[#d2d9e5] bg-white px-3 py-2.5 text-[#11190C] focus:border-[#11190C] focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-[#33475f]">Confirm New Password</span>
            <input
              type="password"
              name="confirmPassword"
              value={securityData.confirmPassword}
              onChange={handleSecurityChange}
              className="w-full rounded-xl border border-[#d2d9e5] bg-white px-3 py-2.5 text-[#11190C] focus:border-[#11190C] focus:outline-none"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={handleUpdatePassword}
          disabled={isSavingSecurity}
          className="mt-3 rounded-xl border border-[#d2d9e5] bg-white px-4 py-2 text-sm font-semibold text-[#33475f] hover:bg-[#F3EFE7] disabled:opacity-60"
        >
          Change Password
        </button>

        {(securityMessage || securityError) && (
          <p className={`mt-3 text-sm font-semibold ${securityError ? 'text-red-600' : 'text-[#2c7a4b]'}`}>
            {securityError || securityMessage}
          </p>
        )}
      </div>

      <div className="rounded-3xl border border-[#f2d3d7] bg-[#fff8f8] p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#7f1d1d]">Danger Zone</h2>
        <p className="mt-1 text-sm text-[#9f3a3a]">Disconnect your session or request account removal.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => signOut()}
            className="rounded-xl bg-[#11190C] px-4 py-2 text-sm font-semibold text-[#D9FF0A]"
          >
            Disconnect
          </button>
          <a
            href="mailto:support@wervice.com?subject=Delete%20my%20Wervice%20account"
            className="rounded-xl border border-[#f0b5bd] bg-white px-4 py-2 text-sm font-semibold text-[#7f1d1d]"
          >
            Request Account Deletion
          </a>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pb-4">
        {saveError && <span className="text-sm font-semibold text-red-600">{saveError}</span>}
        {saveMessage && <span className="text-sm font-semibold text-[#2c7a4b]">{saveMessage}</span>}
        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={isSavingProfile}
          className="inline-flex items-center gap-2 rounded-xl bg-[#11190C] px-5 py-2.5 text-sm font-bold text-[#D9FF0A] disabled:opacity-60"
        >
          <FiSave className="h-4 w-4" />
          {isSavingProfile ? 'Saving...' : copy.settings.saveChanges}
        </button>
      </div>
    </section>
  );
}
