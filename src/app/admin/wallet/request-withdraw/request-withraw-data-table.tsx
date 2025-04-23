"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import { TablePagination } from "@/components/admin/common-table/table-pagination"
import { AdminExternalTransactionType } from "@/schemaValidations/wallet.schema"
import { walletApiRequest } from "@/apiRequests/wallet"
import { TransactionFilterCard } from "@/components/operator/wallet/transaction/transaction-filter-card"
import { RequestWithdrawTable } from "@/components/operator/wallet/transaction/request-withdraw-table"

export default function RequestWithdrawDataTable() {
  // Data state
  const [withdrawRequests, setWithdrawRequests] = useState<AdminExternalTransactionType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>(`all`)
  const [dateFilter, setDateFilter] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined
  })

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset to first page when search/filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, statusFilter, dateFilter])

  // Fetch withdrawal requests
  const fetchWithdrawRequests = async () => {
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
      
      // Sorting
      params.append("$orderby", "createdAt desc")

      // Filtering
      const filterConditions: string[] = []

      // Search term (description contains)
      if (debouncedSearchTerm) {
        filterConditions.push(`contains(description, '${debouncedSearchTerm}')`)
      }

      // Type filter - only get withdraw requests
      filterConditions.push(`type eq 'Withdraw'`)

      // Status filter
      if (statusFilter !== "all") {
        filterConditions.push(`status eq '${statusFilter}'`)
      }

      // Date range filter
      if (dateFilter.startDate) {
        const startDateStr = dateFilter.startDate.toISOString()
        filterConditions.push(`createAt ge ${startDateStr}`)
      }
      
      if (dateFilter.endDate) {
        const endDateStr = dateFilter.endDate.toISOString()
        filterConditions.push(`createAt le ${endDateStr}`)
      }

      // Combine filter conditions
      if (filterConditions.length > 0) {
        params.append("$filter", filterConditions.join(" and "))
      }

      // Construct the OData query string
      const queryString = `?${params.toString()}`

      // Fetch withdrawal requests
      const response = await walletApiRequest.getAdminTransactionWithOData(queryString)
      console.log(JSON.stringify(response))
      setWithdrawRequests(response.payload?.value)
      setTotalCount(response.payload["@odata.count"] || 0)
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch withdrawal requests when dependencies change
  useEffect(() => {
    fetchWithdrawRequests()
  }, [currentPage, pageSize, debouncedSearchTerm, statusFilter, dateFilter])

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchWithdrawRequests()
    setIsRefreshing(false)
  }

  // Handle approving a withdrawal request
  const handleApproveRequest = async (requestId: string) => {
    try {
     
      console.log(`Approving request ${requestId}`)
      const res = await walletApiRequest.acceptWithdraw(requestId);
      console.log(JSON.stringify(res))
      
      // Refresh the list after approval
      fetchWithdrawRequests()
    } catch (error) {
      console.error("Error approving withdrawal request:", error)
    }
  }

  // Handle rejecting a withdrawal request
  const handleRejectRequest = async (requestId: string) => {
    try {
      // Implement rejection API call here
      // await walletApiRequest.rejectWithdrawRequest(requestId)
      console.log(`Rejecting request ${requestId}`)
      
      // Refresh the list after rejection
      fetchWithdrawRequests()
    } catch (error) {
      console.error("Error rejecting withdrawal request:", error)
    }
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

  // Handle direct page selection
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setDebouncedSearchTerm("")
    setStatusFilter("all")
    setDateFilter({
      startDate: undefined,
      endDate: undefined
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="mx-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Yêu cầu rút tiền</CardTitle>
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
                    <span>Đang làm mới...</span>
                  </>
                ) : (
                  <>
                    <RefreshCcw className="h-4 w-4" />
                    <span>Làm mới</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Filter card - Using the existing TransactionFilterCard but adapting the props */}
        <TransactionFilterCard 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          typeFilter={statusFilter} 
          setTypeFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          pageSize={pageSize} 
          setPageSize={setPageSize}
        />

        {/* Table */}
        <div className="rounded-md border">
          <RequestWithdrawTable 
            withdrawRequests={withdrawRequests} 
            loading={loading} 
            resetFilters={resetFilters}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
          />
        </div>

        {/* Pagination */}
        <TablePagination 
          currentPage={currentPage} 
          loading={loading} 
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage} 
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Card>
    </div>
  )
}
