'use client';

import { ColumnDef } from '@tanstack/react-table';
import PageHeader from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import StatusPill from '@/components/admin/StatusPill';
import { users, type User } from '@/lib/mock';
import { MoreHorizontal, Eye } from 'lucide-react';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'totalBookings',
    header: 'Total Bookings',
    cell: ({ row }) => (
      <span className="font-medium">{row.original.totalBookings}</span>
    ),
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last Login',
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
      <button className="p-2 hover:bg-wv.line rounded-lg" aria-label="User actions">
        <Eye size={16} />
      </button>
    ),
  },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle="Manage customer accounts and activity"
      />

      <DataTable
        columns={columns}
        data={users}
        searchKey="name"
        searchPlaceholder="Search users..."
      />
    </div>
  );
}
