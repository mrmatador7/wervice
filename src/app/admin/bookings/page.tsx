'use client';

import { ColumnDef } from '@tanstack/react-table';
import PageHeader from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import StatusPill from '@/components/admin/StatusPill';
import ExportButton, { exportToCSV } from '@/components/admin/ExportButton';
import { bookings, type Booking } from '@/lib/mock';
import { MoreHorizontal, Eye } from 'lucide-react';

const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.id}</span>
    ),
  },
  {
    accessorKey: 'client',
    header: 'Client',
  },
  {
    accessorKey: 'vendor',
    header: 'Vendor',
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => (
      <span className="font-medium">
        MAD {row.original.price.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusPill status={row.original.status} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <button className="p-2 hover:bg-wv.line rounded-lg" aria-label="Booking actions">
        <Eye size={16} />
      </button>
    ),
  },
];

export default function BookingsPage() {
  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      exportToCSV(bookings, 'bookings-export.csv');
    } else {
      // Handle PDF export (placeholder)
      console.log('PDF export not implemented yet');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings"
        subtitle="Monitor and manage all booking transactions"
      >
        <ExportButton onExport={handleExport} />
      </PageHeader>

      <DataTable
        columns={columns}
        data={bookings}
        searchKey="client"
        searchPlaceholder="Search bookings..."
      />
    </div>
  );
}
