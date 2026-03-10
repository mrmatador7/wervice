'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bell, Building2, CalendarClock, Users2 } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import KPIStatCard from '@/components/admin/KPIStatCard';
import StatusPill from '@/components/admin/StatusPill';
import AreaRevenue from '@/components/admin/charts/AreaRevenue';
import DonutBookingsByCategory from '@/components/admin/charts/DonutBookingsByCategory';
import BarBookingsByCity from '@/components/admin/charts/BarBookingsByCity';

type AdminVendor = {
  id: string;
  name: string;
  slug: string;
  city: string;
  category: string;
  status: string;
  planPrice: number;
  startingPrice?: number;
  published: boolean;
  createdAt: string;
};

type AdminCityStats = {
  city: string;
  vendorCount: number;
  publishedCount: number;
};

type AdminCategoryStats = {
  slug: string;
  label: string;
  dbCategory: string;
  vendorCount: number;
  publishedCount: number;
};

const quickActions = [
  {
    title: 'Manage Vendors',
    description: 'Review submissions, publish updates, and sync assets.',
    href: '/admin/vendors',
    icon: Building2,
  },
  {
    title: 'Review Bookings',
    description: 'Track booking flow, statuses, and follow-up actions.',
    href: '/admin/bookings',
    icon: CalendarClock,
  },
  {
    title: 'Manage Users',
    description: 'Audit customer accounts and account health.',
    href: '/admin/users',
    icon: Users2,
  },
];

function toPillStatus(status: string): 'Active' | 'Inactive' | 'Pending' | 'Suspended' {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'active' || normalized === 'approved') return 'Active';
  if (normalized === 'suspended' || normalized === 'rejected') return 'Suspended';
  if (normalized === 'inactive') return 'Inactive';
  return 'Pending';
}

function buildMonthlyRevenue(vendors: AdminVendor[]) {
  const now = new Date();
  const monthFormatter = new Intl.DateTimeFormat('en', { month: 'short' });
  const bucket = new Map<string, { month: string; revenue: number; bookings: number }>();

  for (let i = 11; i >= 0; i -= 1) {
    const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
    bucket.set(key, {
      month: monthFormatter.format(dt),
      revenue: 0,
      bookings: 0,
    });
  }

  vendors.forEach((vendor) => {
    const created = new Date(vendor.createdAt);
    if (Number.isNaN(created.getTime())) return;

    const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}`;
    const row = bucket.get(key);
    if (!row) return;

    row.revenue += Number(vendor.planPrice || 0);
    row.bookings += 1;
  });

  return Array.from(bucket.values());
}

export default function DashboardPage() {
  const [vendors, setVendors] = useState<AdminVendor[]>([]);
  const [cityStats, setCityStats] = useState<AdminCityStats[]>([]);
  const [categoryStats, setCategoryStats] = useState<AdminCategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const [vendorsRes, citiesRes, categoriesRes] = await Promise.all([
          fetch('/api/admin/vendors', { cache: 'no-store' }),
          fetch('/api/admin/cities', { cache: 'no-store' }),
          fetch('/api/admin/categories/stats', { cache: 'no-store' }),
        ]);

        const [vendorsJson, citiesJson, categoriesJson] = await Promise.all([
          vendorsRes.json(),
          citiesRes.json(),
          categoriesRes.json(),
        ]);

        if (!vendorsRes.ok || !vendorsJson?.success) {
          throw new Error(vendorsJson?.message || 'Failed to load vendors');
        }

        setVendors(Array.isArray(vendorsJson.vendors) ? vendorsJson.vendors : []);
        setCityStats(Array.isArray(citiesJson?.cities) ? citiesJson.cities : []);
        setCategoryStats(Array.isArray(categoriesJson?.categories) ? categoriesJson.categories : []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to sync admin data';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const derived = useMemo(() => {
    const totalVendors = vendors.length;
    const publishedVendors = vendors.filter((v) => v.published).length;
    const pendingVendors = vendors.filter((v) => (v.status || '').toLowerCase() === 'pending').length;
    const activeVendors = vendors.filter((v) => (v.status || '').toLowerCase() === 'active').length;

    const totalRevenue = vendors.reduce((sum, v) => sum + Number(v.planPrice || 0), 0);
    const avgPlan = totalVendors > 0 ? Math.round(totalRevenue / totalVendors) : 0;

    const monthlyRevenue = buildMonthlyRevenue(vendors);

    const categoryBookings = categoryStats
      .map((c) => ({
        category: c.label,
        count: c.vendorCount,
        percentage: totalVendors > 0 ? Math.round((c.vendorCount / totalVendors) * 100) : 0,
      }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const cityBookings = cityStats
      .map((c) => ({ city: c.city, count: c.vendorCount }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const recentVendors = [...vendors]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);

    const topVendors = [...vendors]
      .sort((a, b) => Number(b.planPrice || 0) - Number(a.planPrice || 0))
      .slice(0, 4);

    const alerts = [
      pendingVendors > 0
        ? `${pendingVendors} vendor application${pendingVendors > 1 ? 's' : ''} pending approval`
        : 'No pending vendor approvals',
      `${totalVendors - publishedVendors} vendor profile${totalVendors - publishedVendors === 1 ? '' : 's'} not published`,
      `${categoryStats.filter((c) => c.vendorCount > 0).length} active categories across ${cityStats.length} cities`,
    ];

    const kpiStats = [
      { title: 'Total Vendors', value: totalVendors, delta: 0, deltaLabel: 'live snapshot' },
      { title: 'Published Vendors', value: publishedVendors, delta: 0, deltaLabel: 'live snapshot' },
      { title: 'Pending Approvals', value: pendingVendors, delta: 0, deltaLabel: 'needs review' },
      { title: 'Active Vendors', value: activeVendors, delta: 0, deltaLabel: 'current status' },
      { title: 'Plan Revenue', value: `MAD ${totalRevenue.toLocaleString()}`, delta: 0, deltaLabel: 'from vendor plans' },
      { title: 'Average Plan', value: `MAD ${avgPlan.toLocaleString()}`, delta: 0, deltaLabel: 'per vendor' },
    ];

    return {
      kpiStats,
      monthlyRevenue,
      categoryBookings,
      cityBookings,
      recentVendors,
      topVendors,
      alerts,
    };
  }, [vendors, cityStats, categoryStats]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Overview"
        subtitle="Live marketplace data synced from admin sources"
      >
        <Link
          href="/admin/vendors"
          className="inline-flex items-center gap-2 rounded-lg bg-wv.black px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Open Vendor Queue
          <ArrowRight size={16} />
        </Link>
      </PageHeader>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {derived.kpiStats.map((stat) => (
          <KPIStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            delta={stat.delta}
            deltaLabel={stat.deltaLabel}
          />
        ))}
      </section>

      {!loading && (
        <>
          <section className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
            <div className="2xl:col-span-2">
              <AreaRevenue data={derived.monthlyRevenue} showBookings />
            </div>
            <DonutBookingsByCategory data={derived.categoryBookings} />
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-xl border border-wv.line bg-wv.card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
                >
                  <div className="mb-3 inline-flex rounded-lg bg-wv.gray1 p-2.5 text-wv.text">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-base font-semibold text-wv.text">{action.title}</h3>
                  <p className="mt-2 text-sm text-wv.sub">{action.description}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-wv.text">
                    Open
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
            <div className="rounded-xl bg-wv.card p-6 shadow-card xl:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-wv.text">Recent Vendors</h3>
                <Link href="/admin/vendors" className="text-sm font-medium text-wv.sub hover:text-wv.text">
                  View all
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px]">
                  <thead>
                    <tr className="border-b border-wv.line text-left text-xs uppercase tracking-wide text-wv.sub">
                      <th className="pb-3 font-medium">Vendor</th>
                      <th className="pb-3 font-medium">City</th>
                      <th className="pb-3 font-medium">Category</th>
                      <th className="pb-3 font-medium">Plan</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {derived.recentVendors.map((vendor) => (
                      <tr key={vendor.id} className="border-b border-wv.line/80 text-sm text-wv.text">
                        <td className="py-3 font-medium">{vendor.name}</td>
                        <td className="py-3">{vendor.city || '-'}</td>
                        <td className="py-3">{vendor.category || '-'}</td>
                        <td className="py-3 font-medium">MAD {Number(vendor.planPrice || 0).toLocaleString()}</td>
                        <td className="py-3">
                          <StatusPill status={toPillStatus(vendor.status)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6 xl:col-span-2">
              <div className="rounded-xl bg-wv.card p-6 shadow-card">
                <div className="mb-4 flex items-center gap-2">
                  <Bell size={18} className="text-wv.sub" />
                  <h3 className="text-lg font-semibold text-wv.text">System Alerts</h3>
                </div>
                <div className="space-y-3">
                  {derived.alerts.map((alert, index) => (
                    <div key={index} className="rounded-lg border border-wv.line bg-wv.bg p-3">
                      <p className="text-sm font-medium text-wv.text">{alert}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-wv.card p-6 shadow-card">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-wv.text">Top Plan Vendors</h3>
                  <Link href="/admin/vendors" className="text-sm font-medium text-wv.sub hover:text-wv.text">
                    Open list
                  </Link>
                </div>
                <div className="space-y-4">
                  {derived.topVendors.map((vendor) => (
                    <div key={vendor.id} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-wv.text">{vendor.name}</p>
                        <p className="text-xs text-wv.sub">{vendor.city || '-'} • {vendor.category || '-'}</p>
                      </div>
                      <p className="text-sm font-semibold text-wv.text">MAD {Number(vendor.planPrice || 0).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <BarBookingsByCity data={derived.cityBookings} />
        </>
      )}

      {loading && (
        <div className="rounded-xl border border-wv.line bg-wv.card p-6 text-sm text-wv.sub">
          Syncing live admin data...
        </div>
      )}
    </div>
  );
}
