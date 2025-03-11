"use client"

import { useState, useEffect, useCallback } from "react"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

import OperatorToursDataTable from "../_components/table/tours/tour-data-table"
import { operatorToursColumns } from "../_components/table/tours/tourColumns"
import Link from "next/link"
import { UpdateTourDialog } from "@/components/operator/tours/edit-tour/edit-tour-dialog"
import LoadingSpinner from "@/components/common/loading/LoadingSpinner"
import { TourResType } from "@/schemaValidations/tour-operator.shema"

// API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7171'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" // Note: Only use this in development

/**
 * Fetches tours from the API
 */
const fetchTours = async (): Promise<TourResType[]> => {
  try {
    const response = await fetch(`${API_URL}/api/tour`, {
      cache: 'no-store',
      headers: { "Content-Type": "application/json" }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch tours: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching tours:', error)
    throw error // Let the component handle the error
  }
}

export default function TourOperator() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [tours, setTours] = useState<TourResType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTour, setSelectedTour] = useState<TourResType | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Load tours data
  const loadTours = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const toursData = await fetchTours()
      setTours(toursData)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load tours'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize data on component mount
  useEffect(() => {
    loadTours()
  }, [loadTours])

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await loadTours()
      toast.success('Data refreshed successfully')
    } catch (error) {
      // Error is already handled in loadTours
    } finally {
      setIsRefreshing(false)
    }
  }

  // Handle tour editing
  const handleEditTour = (tour: TourResType) => {
    setSelectedTour(tour)
    setIsEditDialogOpen(true)
  }

  // Handle tour deletion
  const handleDeleteTour = (tour: TourResType) => {
    setSelectedTour(tour)
    setIsDeleteDialogOpen(true)
  }

  // Setup data table columns with handlers
  const columns = operatorToursColumns({
    onEdit: handleEditTour,
    onDelete: handleDeleteTour,
  })

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Danh sách tour</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isRefreshing ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Refreshing...</span>
              </>
            ) : (
              <span>Refresh</span>
            )}
          </button>
          {/* Uncomment when implemented */}
          <Link href={`/operator/tours/create`}>
            <button
              disabled={loading || isRefreshing}
              className="px-4 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              Tạo Tour mới
            </button>
          </Link>

        </div>
      </div>

      {/* Error message with retry option */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
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
          <button onClick={loadTours} className="mt-2 text-sm text-blue-500 hover:text-blue-700">
            Thử lại
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && tours.length === 0 ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <OperatorToursDataTable
            columns={columns}
            data={tours}
          />
          {tours.length === 0 && !loading && !error && (
            <div className="flex justify-center items-center h-32 text-gray-500">
              No tours found
            </div>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      {selectedTour && (
        <>
          {/* Uncomment when implemented */}
          {/* <EditTourDialog 
            tour={selectedTour} 
            open={isEditDialogOpen} 
            onOpenChange={setIsEditDialogOpen} 
            onTourUpdated={loadTours} 
          /> */}
        </>
      )}

      {/* Delete Dialog */}
      {selectedTour && (
        <UpdateTourDialog
          tour={selectedTour}
          open={isEditDialogOpen}
          onOpenChange={(isOpen) => {
            setIsEditDialogOpen(isOpen);
            if (!isOpen) {
              loadTours(); // Reload lại dữ liệu sau khi đóng dialog
            }
          }}
          onUpdateSuccess={handleEditTour}
        />
      )}
      <Toaster />
    </div>
  )
}