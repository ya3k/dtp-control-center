// DestinationPage.tsx
"use client";

import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { adminDestinationColumns } from "./destination-columns";
import AdminDestinationDataTable from "./destination-data-table";
import { Destination } from "@/types/destination";
import { useDestinationStore } from "@/store/destination/useDestinationStore";
import CreateDestinationDialog from "@/components/admin/destinations/create-destination-dialog";
import EditDestinationDialog from "@/components/admin/destinations/edit-destination-dialog";
import { DeleteDestinationDialog } from "@/components/admin/destinations/delete-destination-dialog";

export default function DestinationPage() {
  const { destinations, error, loading, fetchDestination, setQuery } = useDestinationStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tableState, setTableState] = useState({
    pageIndex: 0,
    pageSize: 3,
    globalFilter: '',
    isDeletedFilter: 'all',
    sorting: [{ id: "createdAt", desc: true }] as { id: string; desc: boolean }[], // Mặc định sắp xếp theo createdAt asc
    columnVisibility: {
      createdAt: false,
      lastModified: false,
    } as Record<string, boolean>,
  });

  // Build OData query as a plain string
  const buildODataQuery = () => {
    const { pageIndex, pageSize, globalFilter, isDeletedFilter, sorting } = tableState;
    let query = '';

    // Pagination
    query += `$top=${pageSize}&$skip=${pageIndex * pageSize}`;

    // Global filter
    if (globalFilter) {
      query += `&$filter=contains(name, '${globalFilter}')`;
    }

    // IsDeleted filter
    if (isDeletedFilter !== 'all') {
      const isDeletedValue = isDeletedFilter === 'deleted' ? 'true' : 'false';
      const filterPart = `isDeleted eq ${isDeletedValue}`;
      query += query.includes('$filter') ? ` and ${filterPart}` : `&$filter=${filterPart}`;
    }

    // Sorting (OData $orderby)
    if (sorting.length > 0) {
      const orderBy = sorting.map(s => `${s.id} ${s.desc ? 'desc' : 'asc'}`).join(',');
      query += `&$orderby=${orderBy}`;
    }

    return query;
  };

  // Fetch data and update query when table state changes
  useEffect(() => {
    const query = buildODataQuery();
    setQuery(query); // Lưu query OData dưới dạng chuỗi
    fetchDestination();
  }, [fetchDestination, setQuery, tableState]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDestination();
    setIsRefreshing(false);
  };

  const handleViewDetail = (destination: Destination) => {
    setSelectedDestination(destination);
    setIsEditDialogOpen(true);
  };

  const handleEditUser = (destination: Destination) => {
    setSelectedDestination(destination);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (destination: Destination) => {
    setSelectedDestination(destination);
    setIsDeleteDialogOpen(true);
  };

  const columns = adminDestinationColumns({
    onViewDetail: handleViewDetail,
    onEdit: handleEditUser,
    onDelete: handleDeleteUser,
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Danh sách địa điểm</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading || isRefreshing ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Refreshing...</span>
              </>
            ) : (
              <span>Refresh</span>
            )}
          </button>
          <CreateDestinationDialog />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-500 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </p>
          <button onClick={() => fetchDestination()} className="mt-2 text-sm text-blue-500 hover:text-blue-700">
            Thử lại
          </button>
        </div>
      )}

      {loading && destinations.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <AdminDestinationDataTable
            columns={columns}
            data={destinations}
            tableState={tableState}
            setTableState={setTableState}
          />
        </div>
      )}

      <EditDestinationDialog destination={selectedDestination} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
      <DeleteDestinationDialog destination={selectedDestination} open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
      <Toaster />
    </div>
  );
}