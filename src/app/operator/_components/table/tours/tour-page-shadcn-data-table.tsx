"use client"

import { useState, useEffect } from "react"
import { Toaster } from "sonner"
import Link from "next/link"
import { PlusCircle, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { UpdateTourDialog } from "@/components/operator/tours/edit-tour/edit-tour-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { tourOdataResType, TourResType } from "@/schemaValidations/tour-operator.shema"
import { useOpTourStore } from "@/store/operator/useOpTourStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import OperatorTourDataTable, { TableStateType } from "./tour-data-table"
import { buildODataQuery } from "@/lib/odata-untils"
import { operatorToursColumns } from "./tourCloumns"

export default function TourOperator() {
  // Get tour data and actions from store
  const { tours, totalCount, loading, error, fetchTour, setQuery, deleteTour } = useOpTourStore()

  // Local UI state
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedTour, setSelectedTour] = useState<tourOdataResType | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Table state
  const [tableState, setTableState] = useState<TableStateType>({
    pageIndex: 0,
    pageSize: 3,
    globalFilter: "",
    isDeletedFilter: "all",
    sorting: [],
    columnVisibility: {
      id: false,
      description: false,
    },
    columnFilters: [],
  })

  // Fetch data when table state changes
  useEffect(() => {
    // Define the fields to search in for the global filter
    const filterFields = ["title", "description", "companyName"]

    // Build the OData query with our enhanced function
    const query = buildODataQuery(tableState, filterFields, "createdAt")

    setQuery(query)
    fetchTour()
  }, [fetchTour, setQuery, tableState])

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchTour()
    setIsRefreshing(false)
  }

  // Handle tour editing
  const handleEditTour = (tour: tourOdataResType) => {
    setSelectedTour(tour)
    setIsEditDialogOpen(true)
  }

  // Handle tour deletion
  const handleDeleteTour = async (tour: tourOdataResType) => {
    if (window.confirm(`Are you sure you want to delete "${tour.title}"?`)) {
      await deleteTour(tour.id)
    }
  }

  // Setup data table columns with handlers
  const columns = operatorToursColumns({
    onEdit: handleEditTour,
    onDelete: handleDeleteTour,
  })

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Tour Management</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              className="gap-2"
            >
              {isRefreshing ? (
                <>
                  <RefreshCcw className="h-4 w-4 animate-spin" />
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4" />
                  <span>Refresh</span>
                </>
              )}
            </Button>

            <Button asChild disabled={loading || isRefreshing} size="sm" className="gap-2">
              <Link href="/operator/tours/create">
                <PlusCircle className="h-4 w-4" />
                <span>Create New Tour</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        {/* Error message with retry option */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex justify-between items-center">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={() => fetchTour()}>
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Data Table */}
        <OperatorTourDataTable
          columns={columns}
          data={tours}
          tableState={tableState}
          setTableState={setTableState}
          totalCount={totalCount}
          isLoading={loading}
        />

        {/* Edit Dialog */}
        {selectedTour && (
          <UpdateTourDialog
            tour={selectedTour}
            open={isEditDialogOpen}
            onOpenChange={(isOpen) => {
              setIsEditDialogOpen(isOpen)
              if (!isOpen) {
                fetchTour() // Reload data after closing dialog
                setSelectedTour(null)
              }
            }}
            onUpdateSuccess={() => {
              fetchTour()
              setIsEditDialogOpen(false)
              setSelectedTour(null)
            }}
          />
        )}
      </CardContent>
      <Toaster />
    </Card>
  )
}

