'use client';

import { useMemo, useState } from 'react';
import { FiCheck, FiPlus, FiTrash2, FiUsers } from 'react-icons/fi';

interface DashboardGuestListProps {
  profile: {
    guest_count?: number | string | null;
  } | null;
}

type GuestStatus = 'invited' | 'confirmed' | 'declined';

type Guest = {
  id: string;
  name: string;
  group: string;
  status: GuestStatus;
};

const starterGuests: Guest[] = [
  { id: 'g1', name: 'Yasmine El Idrissi', group: 'Family', status: 'confirmed' },
  { id: 'g2', name: 'Omar Bensalem', group: 'Friends', status: 'invited' },
  { id: 'g3', name: 'Sara M.', group: 'Colleagues', status: 'declined' },
];

export default function DashboardGuestList({ profile }: DashboardGuestListProps) {
  const [guests, setGuests] = useState<Guest[]>(starterGuests);
  const [name, setName] = useState('');
  const [group, setGroup] = useState('Family');

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
        <h1 className="text-3xl font-bold text-[#11190C]">Guest List</h1>
        <p className="mt-1 text-gray-600">Manage invitations and RSVP responses</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Target Guests</p>
          <p className="mt-1 text-3xl font-bold text-[#11190C]">{targetGuests}</p>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Invited</p>
          <p className="mt-1 text-3xl font-bold text-[#11190C]">{stats.invited}</p>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="mt-1 text-3xl font-bold text-[#11190C]">{stats.confirmed}</p>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Declined</p>
          <p className="mt-1 text-3xl font-bold text-[#11190C]">{stats.declined}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#11190C]">RSVP Progress</h2>
          <span className="text-sm font-semibold text-[#11190C]">{progress}% confirmed</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#D9FF0A] to-[#BEE600]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-[#11190C]">Add Guest</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_auto]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Guest name"
            className="rounded-xl border border-gray-200 px-4 py-3 focus:border-[#D9FF0A] focus:outline-none"
          />
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 focus:border-[#D9FF0A] focus:outline-none"
          >
            <option>Family</option>
            <option>Friends</option>
            <option>Colleagues</option>
            <option>VIP</option>
          </select>
          <button
            type="button"
            onClick={addGuest}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#11190C] px-5 py-3 font-semibold text-white"
          >
            <FiPlus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <FiUsers className="h-5 w-5 text-[#11190C]" />
          <h2 className="text-xl font-bold text-[#11190C]">Guest Entries</h2>
        </div>

        <div className="space-y-3">
          {guests.map((guest) => (
            <div key={guest.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-100 p-4">
              <div className="min-w-[200px] flex-1">
                <p className="font-semibold text-[#11190C]">{guest.name}</p>
                <p className="text-sm text-gray-500">{guest.group}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateStatus(guest.id, 'invited')}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                    guest.status === 'invited' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Invited
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(guest.id, 'confirmed')}
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold ${
                    guest.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <FiCheck className="h-3.5 w-3.5" />
                  Confirmed
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(guest.id, 'declined')}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                    guest.status === 'declined' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Declined
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeGuest(guest.id)}
                className="ml-auto rounded-lg p-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600"
                aria-label="Remove guest"
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
