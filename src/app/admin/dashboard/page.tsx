import PageHeader from '@/components/admin/PageHeader';
import KPIStatCard from '@/components/admin/KPIStatCard';
import StatusPill from '@/components/admin/StatusPill';
import AreaRevenue from '@/components/admin/charts/AreaRevenue';
import BarBookingsByCity from '@/components/admin/charts/BarBookingsByCity';
import DonutBookingsByCategory from '@/components/admin/charts/DonutBookingsByCategory';
import { kpiStats, revenueData, categoryBookings, cityBookings, topVendors, recentBookings, systemAlerts } from '@/lib/mock';
import { capitalizeCity } from '@/lib/utils';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your business today."
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpiStats.map((stat, index) => (
          <KPIStatCard
            key={index}
            title={stat.title}
            value={stat.value}
            delta={stat.delta}
            deltaLabel={stat.deltaLabel}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AreaRevenue data={revenueData} />
        <DonutBookingsByCategory data={categoryBookings} />
      </div>

      {/* City Bookings Chart */}
      <BarBookingsByCity data={cityBookings} />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performing Vendors */}
        <div className="bg-wv.card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-wv.text mb-4">Top Performing Vendors</h3>
          <div className="space-y-4">
            {topVendors.map((vendor, index) => (
              <div key={vendor.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-wv.lime rounded-full flex items-center justify-center text-wv.black font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-wv.text">{vendor.name}</p>
                    <p className="text-sm text-wv.sub">{capitalizeCity(vendor.city)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-wv.text">{vendor.bookings}</p>
                  <p className="text-xs text-wv.sub">bookings</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-wv.card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-wv.text mb-4">Recent Bookings</h3>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-wv.text">{booking.client}</p>
                  <p className="text-sm text-wv.sub">{booking.vendor}</p>
                </div>
                <div className="text-right">
                  <StatusPill status={booking.status} />
                  <p className="text-xs text-wv.sub mt-1">{booking.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-wv.card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-wv.text mb-4">System Alerts</h3>
          <div className="space-y-4">
            {systemAlerts.map((alert, index) => {
              const Icon = alert.type === 'warning' ? AlertTriangle :
                          alert.type === 'info' ? Info : CheckCircle;
              const iconColor = alert.type === 'warning' ? 'text-yellow-500' :
                               alert.type === 'info' ? 'text-blue-500' : 'text-green-500';

              return (
                <div key={index} className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 ${iconColor}`} />
                  <div className="flex-1">
                    <p className="text-sm text-wv.text">{alert.message}</p>
                    <p className="text-xs text-wv.sub mt-1">{alert.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
