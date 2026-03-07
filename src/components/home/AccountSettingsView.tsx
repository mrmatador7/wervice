'use client';

import { useMemo, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import { FiBell, FiGlobe, FiSave } from 'react-icons/fi';
import { useUser } from '@/contexts/UserContext';
import { getDashboardCopy } from '@/components/home/dashboard-i18n';

type AccountSettingsViewProps = {
  locale: string;
};

export default function AccountSettingsView({ locale }: AccountSettingsViewProps) {
  const copy = getDashboardCopy(locale);
  const { user, profile, isLoading } = useUser();
  const [saveMessage, setSaveMessage] = useState('');

  const initialFullName = useMemo(() => {
    if (!profile) return '';
    const full = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim();
    return full || profile.full_name || '';
  }, [profile]);

  const [formData, setFormData] = useState({
    fullName: initialFullName,
    email: user?.email || profile?.email || '',
    phone: profile?.phone || '',
    weddingDate: profile?.wedding_date || '',
    city: profile?.city || '',
    guestCount: profile?.guest_count || '',
    budget: profile?.budget || '',
    language: profile?.language || locale,
    currency: profile?.currency || 'MAD',
    emailNotifications: true,
    whatsappNotifications: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    // Keeps old logic style (local form state) until API save is connected.
    setSaveMessage(copy.settings.savedLocally);
    setTimeout(() => setSaveMessage(''), 2200);
  };

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
            href={`/${locale}/dashboard?view=auth`}
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

      <div className="flex items-center justify-end gap-3">
        {saveMessage && <span className="text-sm font-semibold text-[#2c7a4b]">{saveMessage}</span>}
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-[#11190C] px-5 py-2.5 text-sm font-bold text-[#D9FF0A]"
        >
          <FiSave className="h-4 w-4" />
          {copy.settings.saveChanges}
        </button>
      </div>
    </section>
  );
}
