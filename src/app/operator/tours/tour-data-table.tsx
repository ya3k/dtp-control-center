"use client"

import { useEffect, useState } from "react"
import tourApiService from "@/apiRequests/tour"
import { tourOdataResType, TourResType } from "@/schemaValidations/tour-operator.shema"
import { OpTourFilterCard } from "@/components/operator/tours/tour-page/op-tour-filter-card"
import { OpTourPagination } from "@/components/operator/tours/tour-page/op-tour-pagination"
import { OpTourTable } from "@/components/operator/tours/tour-page/op-tour-table"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { UpdateTourDialog } from "@/components/operator/tours/edit-tour/edit-tour-dialog"
import { TablePagination } from "@/components/admin/common-table/table-pagination"

export default function OpTourDataTable() {
  // Data state
  const [tours, setTours] = useState<tourOdataResType[]>([])
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
  const [minRating, setMinRating] = useState<number>(0)

  //Edit state
  const [selectedTour, setSelectedTour] = useState<tourOdataResType | null>(null)
  const [editTourId, setEditTourId] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)


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
  }, [debouncedSearchTerm, minRating])

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

      // Rating
      if (minRating > 0) {
        filterConditions.push(`avgStar ge ${minRating}`)
      }

      // Combine filter conditions
      if (filterConditions.length > 0) {
        params.append("$filter", filterConditions.join(" and "))
      }

      // Construct the OData query string
      const queryString = `?${params.toString()}`

      // Use tourApiService instead of direct fetch
      const response = await tourApiService.getWithOData(queryString)
      console.log(queryString)
      setTours(response.payload?.value)
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
  }, [currentPage, pageSize, debouncedSearchTerm, minRating])


  //handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    fetchTours();
    setIsRefreshing(false)
  }

  //handle update success
  const handleEditTour = (tour: tourOdataResType) => {
    setSelectedTour(tour)
    setIsEditDialogOpen(true)
  }
  const handleUpdateSuccess = () => {
    // setIsEditDialogOpen(false)
    setSelectedTour(null)
    fetchTours(); // Refresh the data
  }
  // Function to truncate description text
  const truncateDescription = (text: string, maxLength = 100): string => {
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
    setMinRating(0)
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="mx-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Tour Management</CardTitle>
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



        {/* Search and Rating Filter */}
        <OpTourFilterCard searchTerm={searchTerm} setSearchTerm={setSearchTerm} minRating={minRating} setMinRating={setMinRating} pageSize={pageSize} setPageSize={setPageSize} />
        {/* Table */}
        <div className="rounded-md border">
          <OpTourTable tours={tours} totalCount={totalCount} loading={loading} pageSize={pageSize} resetFilters={resetFilters} truncateDescription={truncateDescription} onEditTour={handleEditTour} />
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
    </div>
  )
}