"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCcw } from "lucide-react"
import { TablePagination } from "@/components/admin/common-table/table-pagination"
import destinationApiRequest from "@/apiRequests/destination"
import { DestinationType } from "@/schemaValidations/admin-destination.schema"
import { EditDestinationDialog } from "@/components/admin/destination/edit-destination-dialog"
import { CreateDestinationDialog } from "@/components/admin/destination/create-destination-dialog"
import { DestinationTable } from "@/components/admin/destination/destination-table"
import { DestinationTableFilterCard } from "@/components/admin/destination/destination-table-filter"
import { DeleteDestinationDialog } from "@/components/admin/destination/delete-destination-dialog" // Add this import

export default function DestinationDataTable() {
  // Data state
  const [destinations, setDestinations] = useState<DestinationType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")

  //Edit state
  const [selectedDestination, setSelectedDestination] = useState<DestinationType | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  
  // Create dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  
  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm])

  // Fetching destinations
  const fetchDestinations = async () => {
    setLoading(true)

    try {
      // Calculate skip for pagination
      const skip = (currentPage - 1) * pageSize

      // Build OData query parameters
      const params = new URLSearchParams()
      // Pagination
      params.append("$top", pageSize.toString())
      params.append("$skip", skip.toString())
      params.append("$count", "true")

      // Filtering
      const filterConditions: string[] = []

      // Search term (name contains)
      if (debouncedSearchTerm) {
        filterConditions.push(`contains(name, '${debouncedSearchTerm}')`)
      }

      // Only show non-deleted destinations
      filterConditions.push(`isDeleted eq false`)

      // Combine filter conditions
      if (filterConditions.length > 0) {
        params.append("$filter", filterConditions.join(" and "))
      }

      // Ordering
      params.append("$orderby", "createdAt desc")

      // Construct the OData query string
      const queryString = `?${params.toString()}`
      // console.log(queryString)
      // Use destinationApiRequest instead of direct fetch
      const response = await destinationApiRequest.getAll(queryString)
      // console.log(JSON.stringify(response))
      setDestinations(response.payload?.value)
      setTotalCount(response.payload["@odata.count"] || 0)
    } catch (error) {
      console.error("Error fetching destination data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data with OData parameters
  useEffect(() => {
    fetchDestinations()
  }, [currentPage, pageSize, debouncedSearchTerm])

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchDestinations()
    setIsRefreshing(false)
  }

  // Handle create
  const handleCreateDestination = () => {
    setIsCreateDialogOpen(true)
  }

  // Handle update
  const handleEditDestination = (destination: DestinationType) => {
    setSelectedDestination(destination)
    setIsEditDialogOpen(true)
  }

  const handleCreateComplete = () => {
    fetchDestinations()
  }

  const handleEditComplete = (updatedDestination: DestinationType) => {
   fetchDestinations()
  }

  // Handle delete
  const handleDeleteDestination = (destination: DestinationType) => {
    setSelectedDestination(destination)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteComplete = (deletedId: string) => {
    // Remove the deleted destination from the local state
    setDestinations(prevDestinations => 
      prevDestinations.filter(dest => dest.id !== deletedId)
    )
    
    // Update total count
    setTotalCount(prevCount => prevCount - 1)
  }

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  // Handle page navigation
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setDebouncedSearchTerm("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="mx-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Quản lý danh sách điểm đến</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="default"
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

              <Button
                variant="core"
                size="default"
                className="gap-2"
                disabled={loading || isRefreshing}
                onClick={handleCreateDestination}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Thêm điểm đến</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Search and Filters */}
        <DestinationTableFilterCard
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          pageSize={pageSize} 
          setPageSize={setPageSize}
        />
        
        {/* Table */}
        <div className="rounded-md border px-2">
          <DestinationTable
            destinations={destinations}
            loading={loading}
            onEditDestination={handleEditDestination}
            onDeleteDestination={handleDeleteDestination} // Add this prop
            resetFilters={resetFilters}
          />
        </div>
        
        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          loading={loading}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
      </Card>

      {/* Create Dialog */}
      <CreateDestinationDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateComplete={handleCreateComplete}
      />
      
      {/* Edit Dialog */}
      <EditDestinationDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        destination={selectedDestination}
        onEditComplete={handleEditComplete}
      />
      
      {/* Delete Dialog */}
      <DeleteDestinationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        destination={selectedDestination}
        onDeleteComplete={handleDeleteComplete}
      />
    </div>
  )
}