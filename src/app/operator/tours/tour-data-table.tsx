"use client"

import { useEffect, useState } from "react"
import tourApiService from "@/apiRequests/tour"
import { OpTourFilterCard } from "@/components/operator/tours/tour-page/op-tour-filter-card"
import { OpTourTable } from "@/components/operator/tours/tour-page/op-tour-table"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { UpdateTourDialog } from "@/components/operator/tours/edit-tour/edit-tour-dialog"
import { TablePagination } from "@/components/admin/common-table/table-pagination"
import { CloseToursDialog } from "@/components/operator/tours/delete-tour/close-tour-dialog"
import { tourByCompanyResType } from "@/schemaValidations/tour-operator.shema"
import { OrderToursHistoryDialog } from "@/components/operator/order/order-dialog"

export default function OpTourDataTable() {
  // Data state
  const [tours, setTours] = useState<tourByCompanyResType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")

  // Filter state
  const [isDeleted, setIsDeleted] = useState<boolean | null>(null)

  //Edit state
  const [selectedTour, setSelectedTour] = useState<tourByCompanyResType | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  //close tour state
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)

  //view order state
  const [isViewOrderDialogOpen, setIsViewOrderDialogOpen] = useState(false)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset to first page when search/filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, isDeleted])

  //fetching tour
  const fetchTours = async () => {
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

      // Search term (title contains)
      if (debouncedSearchTerm) {
        filterConditions.push(`contains(title, '${debouncedSearchTerm}')`)
      }

      // Status filter
      if (isDeleted !== null) {
        filterConditions.push(`isDeleted eq ${isDeleted}`)
      }

      // Combine filter conditions
      if (filterConditions.length > 0) {
        params.append("$filter", filterConditions.join(" and "))
      }

      // Construct the OData query string
      const queryString = `?${params.toString()}`

      // Use tourApiService instead of direct fetch
      const response = await tourApiService.getWithODataByCompany(queryString)
      console.log(queryString)
      console.log(JSON.stringify(response.payload?.value))
      setTours(response.payload?.value || [])
      setTotalCount(response.payload["@odata.count"] || 0)
    } catch (error) {
      console.error("Error fetching tour data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data with OData parameters
  useEffect(() => {
    fetchTours()
  }, [currentPage, pageSize, debouncedSearchTerm, isDeleted])


  //handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    fetchTours();
    setIsRefreshing(false)
  }

  //handle update success
  const handleEditTour = (tour: tourByCompanyResType) => {
    setSelectedTour(tour)
    setIsEditDialogOpen(true)
  }
  const handleUpdateSuccess = () => {
    setSelectedTour(null)
    fetchTours(); // Refresh the data
  }

  //handle close tour
  const handleCloseTour = (tour: tourByCompanyResType) => {
    setSelectedTour(tour)
    setIsCloseDialogOpen(true)
  }
  const handleCloseSuccess = () => {
    setSelectedTour(null)
    fetchTours(); // Refresh the data
  }

  //handle view order
  const handleViewOrder = (tour: tourByCompanyResType) => {
    setSelectedTour(tour)
    setIsViewOrderDialogOpen(true)
  }
  const handleViewOrderSuccess = () => {
    setSelectedTour(null)
    fetchTours(); // Refresh the data
  }

  // Function to truncate description text
  const truncateDescription = (text: string, maxLength = 50): string => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
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
    setIsDeleted(null)
  }
  return (
    <div className="space-y-6 w-full">
      <Card>
        <CardHeader className="mx-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Quản lý tour</CardTitle>
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

              <Button variant={"core"} asChild disabled={loading || isRefreshing} size="default" className="gap-2">
                <Link href="/operator/tours/create">
                  <PlusCircle className="h-4 w-4" />
                  <span>Tạo Tour mới</span>
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Search and Filters */}
        <OpTourFilterCard
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isDeleted={isDeleted}
          setIsDeleted={setIsDeleted}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />

        {/* Table */}
        <div className="rounded-md border">
          <OpTourTable
            tours={tours}
            totalCount={totalCount}
            loading={loading}
            resetFilters={resetFilters}
            truncateDescription={truncateDescription}
            onEditTour={handleEditTour}
            onCloseTour={handleCloseTour}
            onViewBooking={handleViewOrder}

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

      {/* Edit Dialog */}
      {selectedTour && (
        <UpdateTourDialog
          tour={selectedTour}
          open={isEditDialogOpen}
          onOpenChange={(isOpen) => {
            setIsEditDialogOpen(isOpen)
            if (!isOpen) {
              setSelectedTour(null)
              fetchTours()
            }
          }}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* Close Dialog */}
      {selectedTour && (
        <CloseToursDialog
          tour={selectedTour}
          open={isCloseDialogOpen}
          onOpenChange={(isOpen) => {
            setIsCloseDialogOpen(isOpen)
            if (!isOpen) {
              setSelectedTour(null)
              fetchTours()
            }
          }}
          onCloseSuccess={handleCloseSuccess}
        />
      )}

      {/* view order dialog */}
      {selectedTour && (
        <OrderToursHistoryDialog
          tour={selectedTour}
          open={isViewOrderDialogOpen}
          onOpenChange={(isOpen) => {
            setIsViewOrderDialogOpen(isOpen)
            if (!isOpen) {
              setSelectedTour(null)
              fetchTours()
            }
          }}
        />
      )}


    </div>
  )
}