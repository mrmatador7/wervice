import PageHeader from '@/components/admin/PageHeader';
import AreaRevenue from '@/components/admin/charts/AreaRevenue';
import BarBookingsByCity from '@/components/admin/charts/BarBookingsByCity';
import DonutBookingsByCategory from '@/components/admin/charts/DonutBookingsByCategory';
import { revenueData, categoryBookings, cityBookings } from '@/lib/mock';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Detailed insights and performance metrics"
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AreaRevenue data={revenueData} showBookings />
        <DonutBookingsByCategory data={categoryBookings} />
      </div>

      <BarBookingsByCity data={cityBookings} />

      {/* Additional Analytics Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-wv.card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-wv.text mb-4">Conversion Funnel</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-wv.sub">Visitors</span>
              <span className="font-semibold">10,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-wv.sub">Inquiries</span>
              <span className="font-semibold">2,500</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-wv.sub">Bookings</span>
              <span className="font-semibold">1,847</span>
            </div>
          </div>
        </div>

        <div className="bg-wv.card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-wv.text mb-4">User Retention</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-wv.sub">1 Week</span>
              <span className="font-semibold">85%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-wv.sub">1 Month</span>
              <span className="font-semibold">72%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-wv.sub">3 Months</span>
              <span className="font-semibold">45%</span>
            </div>
          </div>
        </div>

        <div className="bg-wv.card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-wv.text mb-4">Top Pages</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-wv.sub">Venues</span>
              <span className="font-semibold">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-wv.sub">Catering</span>
              <span className="font-semibold">28%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-wv.sub">Photography</span>
              <span className="font-semibold">15%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
