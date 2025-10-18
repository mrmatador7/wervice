'use client';

import PageHeader from '@/components/admin/PageHeader';
import KPIStatCard from '@/components/admin/KPIStatCard';
import { DataTable } from '@/components/admin/DataTable';
import StatusPill from '@/components/admin/StatusPill';
import { payouts, type Payout } from '@/lib/mock';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

const payoutColumns: ColumnDef<Payout>[] = [
  {
    accessorKey: 'vendor',
    header: 'Vendor',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <span className="font-medium">
        MAD {row.original.amount.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'method',
    header: 'Method',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusPill status={row.original.status} />,
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <button className="p-2 hover:bg-wv.line rounded-lg" aria-label="Payout actions">
        <MoreHorizontal size={16} />
      </button>
    ),
  },
];

export default function PaymentsPage() {
  const paymentKPIs = [
    {
      title: 'Revenue This Month',
      value: 'MAD 410K',
      delta: 18.7,
      deltaLabel: 'vs last month'
    },
    {
      title: 'Commission Total',
      value: 'MAD 82K',
      delta: 15.2,
      deltaLabel: 'vs last month'
    },
    {
      title: 'Pending Payouts',
      value: 'MAD 45K',
      delta: -8.3,
      deltaLabel: 'vs last month'
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        subtitle="Manage revenue, commissions, and vendor payouts"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paymentKPIs.map((stat, index) => (
          <KPIStatCard
            key={index}
            title={stat.title}
            value={stat.value}
            delta={stat.delta}
            deltaLabel={stat.deltaLabel}
          />
        ))}
      </div>

      {/* Payouts Table */}
      <div className="bg-wv.card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold text-wv.text mb-4">Recent Payouts</h3>
        <DataTable
          columns={payoutColumns}
          data={payouts}
          searchKey="vendor"
          searchPlaceholder="Search payouts..."
        />
      </div>
    </div>
  );
}
