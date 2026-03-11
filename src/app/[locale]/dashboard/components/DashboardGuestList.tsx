'use client';

import { useMemo, useState } from 'react';
import { FiCheck, FiPlus, FiTrash2, FiUsers } from 'react-icons/fi';

interface DashboardGuestListProps {
  profile: {
    guest_count?: number | string | null;
  } | null;
  locale?: string;
}

type GuestStatus = 'invited' | 'confirmed' | 'declined';
type GuestGroup = 'family' | 'friends' | 'colleagues' | 'vip';

type Guest = {
  id: string;
  name: string;
  group: GuestGroup;
  status: GuestStatus;
};

type GuestListLocale = 'en' | 'fr' | 'ar';

const guestListCopy = {
  en: {
    title: 'Guest List',
    subtitle: 'Manage invitations and RSVP responses',
    targetGuests: 'Target Guests',
    invited: 'Invited',
    confirmed: 'Confirmed',
    declined: 'Declined',
    rsvpProgress: 'RSVP Progress',
    confirmedPercent: '{count}% confirmed',
    addGuest: 'Add Guest',
    guestName: 'Guest name',
    add: 'Add',
    guestEntries: 'Guest Entries',
    removeGuest: 'Remove guest',
    groups: {
      family: 'Family',
      friends: 'Friends',
      colleagues: 'Colleagues',
      vip: 'VIP',
    },
    starter: {
      g1: 'Yasmine El Idrissi',
      g2: 'Omar Bensalem',
      g3: 'Sara M.',
    },
  },
  fr: {
    title: 'Liste des invités',
    subtitle: 'Gérez les invitations et les réponses RSVP',
    targetGuests: 'Invités prévus',
    invited: 'Invités',
    confirmed: 'Confirmés',
    declined: 'Refusés',
    rsvpProgress: 'Progression des RSVP',
    confirmedPercent: '{count}% confirmés',
    addGuest: 'Ajouter un invité',
    guestName: "Nom de l'invité",
    add: 'Ajouter',
    guestEntries: 'Entrées des invités',
    removeGuest: "Supprimer l'invité",
    groups: {
      family: 'Famille',
      friends: 'Amis',
      colleagues: 'Collègues',
      vip: 'VIP',
    },
    starter: {
      g1: 'Yasmine El Idrissi',
      g2: 'Omar Bensalem',
      g3: 'Sara M.',
    },
  },
  ar: {
    title: 'قائمة الضيوف',
    subtitle: 'إدارة الدعوات وردود الحضور',
    targetGuests: 'العدد المستهدف للضيوف',
    invited: 'مدعوون',
    confirmed: 'مؤكدون',
    declined: 'معتذرون',
    rsvpProgress: 'تقدم الردود',
    confirmedPercent: '{count}% مؤكد',
    addGuest: 'إضافة ضيف',
    guestName: 'اسم الضيف',
    add: 'إضافة',
    guestEntries: 'قائمة الضيوف',
    removeGuest: 'حذف الضيف',
    groups: {
      family: 'العائلة',
      friends: 'الأصدقاء',
      colleagues: 'زملاء العمل',
      vip: 'VIP',
    },
    starter: {
      g1: 'ياسمين الإدريسي',
      g2: 'عمر بنسالم',
      g3: 'سارة م.',
    },
  },
} as const;

function interpolate(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));
}

export default function DashboardGuestList({ profile, locale = 'en' }: DashboardGuestListProps) {
  const safeLocale: GuestListLocale = locale === 'fr' || locale === 'ar' ? locale : 'en';
  const t = guestListCopy[safeLocale];
  const starterGuests: Guest[] = [
    { id: 'g1', name: t.starter.g1, group: 'family', status: 'confirmed' },
    { id: 'g2', name: t.starter.g2, group: 'friends', status: 'invited' },
    { id: 'g3', name: t.starter.g3, group: 'colleagues', status: 'declined' },
  ];

  const [guests, setGuests] = useState<Guest[]>(starterGuests);
  const [name, setName] = useState('');
  const [group, setGroup] = useState<GuestGroup>('family');

  const targetGuests = Number(profile?.guest_count) || 150;

  const stats = useMemo(() => {
    const invited = guests.filter((guest) => guest.status === 'invited').length;
    const confirmed = guests.filter((guest) => guest.status === 'confirmed').length;
    const declined = guests.filter((guest) => guest.status === 'declined').length;
    return { invited, confirmed, declined };
  }, [guests]);

  const progress = Math.min(100, Math.round((stats.confirmed / targetGuests) * 100));

  const addGuest = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const newGuest: Guest = {
      id: `${Date.now()}`,
      name: trimmed,
      group,
      status: 'invited',
    };

    setGuests((prev) => [newGuest, ...prev]);
    setName('');
  };

  const updateStatus = (id: string, status: GuestStatus) => {
    setGuests((prev) => prev.map((guest) => (guest.id === id ? { ...guest, status } : guest)));
  };

  const removeGuest = (id: string) => {
    setGuests((prev) => prev.filter((guest) => guest.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#11190C]">{t.title}</h1>
        <p className="mt-1 text-gray-600">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">{t.targetGuests}</p>
          <p className="mt-1 text-3xl font-bold text-[#11190C]">{targetGuests}</p>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">{t.invited}</p>
          <p className="mt-1 text-3xl font-bold text-[#11190C]">{stats.invited}</p>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">{t.confirmed}</p>
          <p className="mt-1 text-3xl font-bold text-[#11190C]">{stats.confirmed}</p>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">{t.declined}</p>
          <p className="mt-1 text-3xl font-bold text-[#11190C]">{stats.declined}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#11190C]">{t.rsvpProgress}</h2>
          <span className="text-sm font-semibold text-[#11190C]">
            {interpolate(t.confirmedPercent, { count: progress })}
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#D9FF0A] to-[#BEE600]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-[#11190C]">{t.addGuest}</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_auto]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.guestName}
            className="rounded-xl border border-gray-200 px-4 py-3 focus:border-[#D9FF0A] focus:outline-none"
          />
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value as GuestGroup)}
            className="rounded-xl border border-gray-200 px-4 py-3 focus:border-[#D9FF0A] focus:outline-none"
          >
            <option value="family">{t.groups.family}</option>
            <option value="friends">{t.groups.friends}</option>
            <option value="colleagues">{t.groups.colleagues}</option>
            <option value="vip">{t.groups.vip}</option>
          </select>
          <button
            type="button"
            onClick={addGuest}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#11190C] px-5 py-3 font-semibold text-white"
          >
            <FiPlus className="h-4 w-4" />
            {t.add}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <FiUsers className="h-5 w-5 text-[#11190C]" />
          <h2 className="text-xl font-bold text-[#11190C]">{t.guestEntries}</h2>
        </div>

        <div className="space-y-3">
          {guests.map((guest) => (
            <div key={guest.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-100 p-4">
              <div className="min-w-[200px] flex-1">
                <p className="font-semibold text-[#11190C]">{guest.name}</p>
                <p className="text-sm text-gray-500">{t.groups[guest.group]}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateStatus(guest.id, 'invited')}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                    guest.status === 'invited' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {t.invited}
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(guest.id, 'confirmed')}
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold ${
                    guest.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <FiCheck className="h-3.5 w-3.5" />
                  {t.confirmed}
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(guest.id, 'declined')}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                    guest.status === 'declined' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {t.declined}
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeGuest(guest.id)}
                className="ml-auto rounded-lg p-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600"
                aria-label={t.removeGuest}
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
