'use client';

import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import DashboardPlanner from '@/app/[locale]/dashboard/components/DashboardPlanner';
import DashboardBudget from '@/app/[locale]/dashboard/components/DashboardBudget';
import DashboardGuestList from '@/app/[locale]/dashboard/components/DashboardGuestList';
import { getDashboardCopy } from '@/components/home/dashboard-i18n';

type AccountToolViewsProps = {
  locale: string;
  view: 'wedding-date' | 'guest-list' | 'budget-planner';
};

export default function AccountToolViews({ locale, view }: AccountToolViewsProps) {
  const copy = getDashboardCopy(locale);
  const { user, profile, isLoading } = useUser();

  if (isLoading) {
    return (
      <section className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-[#d7deea] bg-white p-8 text-[#5f6f84]">{copy.tools.loading}</div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-[#d7deea] bg-white p-8">
          <h2 className="text-2xl font-bold text-[#11190C]">{copy.tools.signinTitle}</h2>
          <p className="mt-2 text-[#5f6f84]">{copy.tools.signinSubtitle}</p>
          <Link
            href={`/${locale}/dashboard?view=auth&mode=signin`}
            className="mt-5 inline-flex rounded-xl bg-[#11190C] px-4 py-2.5 text-sm font-bold text-[#D9FF0A]"
          >
            {copy.tools.signIn}
          </Link>
        </div>
      </section>
    );
  }

  if (view === 'wedding-date') {
    return (
      <section className="mx-auto max-w-6xl">
        <DashboardPlanner profile={profile} />
      </section>
    );
  }

  if (view === 'guest-list') {
    return (
      <section className="mx-auto max-w-6xl">
        <DashboardGuestList profile={profile} />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl">
      <DashboardBudget profile={profile} />
    </section>
  );
}
