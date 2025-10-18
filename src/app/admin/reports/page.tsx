import PageHeader from '@/components/admin/PageHeader';
import ExportButton, { exportToCSV } from '@/components/admin/ExportButton';
import { kpiStats, vendors, bookings } from '@/lib/mock';

export default function ReportsPage() {
  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      // Export different types of reports
      exportToCSV(vendors, 'vendor-report.csv');
    } else {
      console.log('PDF export not implemented yet');
    }
  };

  const reportSections = [
    {
      title: 'Monthly Bookings Report',
      description: 'Detailed breakdown of bookings by month, category, and vendor',
      lastGenerated: '2 hours ago',
    },
    {
      title: 'Vendor Revenue Report',
      description: 'Commission and revenue analysis for all active vendors',
      lastGenerated: '1 day ago',
    },
    {
      title: 'Top Cities Performance',
      description: 'Booking and revenue statistics by city and region',
      lastGenerated: '3 hours ago',
    },
    {
      title: 'Client Growth Report',
      description: 'New user registrations and booking conversion rates',
      lastGenerated: '6 hours ago',
    },
    {
      title: 'Commission Summary',
      description: 'Total commissions earned and payout status',
      lastGenerated: '1 hour ago',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Generate and download detailed business reports"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportSections.map((report, index) => (
          <div key={index} className="bg-wv.card rounded-xl p-6 shadow-card">
            <h3 className="font-semibold text-wv.text mb-2">{report.title}</h3>
            <p className="text-sm text-wv.sub mb-4">{report.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-wv.sub">Last: {report.lastGenerated}</span>
              <ExportButton onExport={handleExport} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-wv.card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold text-wv.text mb-4">Current Period Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-wv.text mb-1">
              {bookings.length}
            </div>
            <div className="text-sm text-wv.sub">Total Bookings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-wv.text mb-1">
              MAD {bookings.reduce((sum, booking) => sum + booking.price, 0).toLocaleString()}
            </div>
            <div className="text-sm text-wv.sub">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-wv.text mb-1">
              {vendors.filter(v => v.status === 'Active').length}
            </div>
            <div className="text-sm text-wv.sub">Active Vendors</div>
          </div>
        </div>
      </div>
    </div>
  );
}
