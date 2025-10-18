'use client';

import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import PageHeader from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import AddVendorDialog, { EditVendorDialog, ImportVendorsDialog } from '@/components/admin/AddVendorDialog';
import { Upload, Plus } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  city: string;
  category: string;
  status: string;
  plan: string;
  planPrice: number;
  profilePhotoUrl?: string;
  galleryPhotoUrls?: string[];
  email?: string;
  phone?: string;
}

export default function VendorsPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Fetch vendors from API
  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/admin/vendors');
      const result = await response.json();

      if (result.success) {
        setVendors(result.vendors);
      } else {
        console.error('Failed to fetch vendors');
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchVendors();
  }, []);

  const handleAddVendor = () => {
    setShowAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setShowAddDialog(false);
  };

  const handleVendorAdded = () => {
    fetchVendors(); // Refresh the list
  };

  const handleEditVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setShowEditDialog(false);
    setSelectedVendor(null);
  };

  const handleVendorEdited = () => {
    fetchVendors(); // Refresh the list
    setShowEditDialog(false);
    setSelectedVendor(null);
  };

  const handleDeleteVendor = async (vendor: Vendor) => {
    if (!confirm(`Are you sure you want to delete "${vendor.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/vendors/${vendor.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete vendor');
      }

      alert('Vendor deleted successfully');
      fetchVendors(); // Refresh the list
    } catch (error) {
      alert('Failed to delete vendor. Please try again.');
      console.error('Delete error:', error);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedRows.length} vendor(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      const vendorsToDelete = selectedRows.map(index => vendors[index]);
      const deletePromises = vendorsToDelete.map(vendor =>
        fetch(`/api/admin/vendors/${vendor.id}`, {
          method: 'DELETE',
        })
      );

      await Promise.all(deletePromises);

      alert(`Successfully deleted ${selectedRows.length} vendor(s)`);
      setSelectedRows([]);
      fetchVendors(); // Refresh the list
    } catch (error) {
      alert('Failed to delete vendors. Please try again.');
      console.error('Delete error:', error);
    }
  };

  const handleCloseImportDialog = () => {
    setShowImportDialog(false);
  };

  const handleVendorsImported = () => {
    fetchVendors(); // Refresh the list
  };

  const columns: ColumnDef<Vendor>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="rounded border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="rounded border-gray-300"
        />
      ),
    },
    {
      accessorKey: 'profilePhotoUrl',
      header: '',
      cell: ({ row }) => (
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
          {row.original.profilePhotoUrl ? (
            <img
              src={row.original.profilePhotoUrl}
              alt={`${row.original.name} profile`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs ${row.original.profilePhotoUrl ? 'hidden' : ''}`}>
            {row.original.name.charAt(0).toUpperCase()}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Vendor',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium text-wv.text">{row.original.name}</div>
            <div className="text-sm text-wv.sub">{row.original.city}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'plan',
      header: 'Plan',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-wv.text capitalize">
            {row.original.plan.replace('-', ' & ')}
          </div>
          <div className="text-sm text-wv.sub">
            MAD {row.original.planPrice}/month
          </div>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditVendor(row.original)}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            title="Edit vendor"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteVendor(row.original)}
            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
            title="Delete vendor"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendors"
        subtitle="Manage and monitor all registered vendors"
      >
        <div className="flex gap-3">
          {selectedRows.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              Delete Selected ({selectedRows.length})
            </button>
          )}
          <button
            onClick={() => setShowImportDialog(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button
            onClick={handleAddVendor}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Vendor
          </button>
        </div>
      </PageHeader>

      <DataTable
        data={vendors}
        columns={columns}
        isLoading={isLoading}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
      />

      <AddVendorDialog
        isOpen={showAddDialog}
        onClose={handleCloseAddDialog}
        onSuccess={handleVendorAdded}
      />

      {selectedVendor && (
        <EditVendorDialog
          isOpen={showEditDialog}
          onClose={handleCloseEditDialog}
          onSuccess={handleVendorEdited}
          vendor={{
            id: selectedVendor.id,
            name: selectedVendor.name,
            city: selectedVendor.city,
            category: selectedVendor.category,
            email: selectedVendor.email,
            phone: selectedVendor.phone,
            plan: selectedVendor.plan,
            planPrice: selectedVendor.planPrice,
            profilePhotoUrl: selectedVendor.profilePhotoUrl,
            galleryPhotoUrls: selectedVendor.galleryPhotoUrls,
          }}
        />
      )}

      <ImportVendorsDialog
        isOpen={showImportDialog}
        onClose={handleCloseImportDialog}
        onSuccess={handleVendorsImported}
      />
    </div>
  );
}