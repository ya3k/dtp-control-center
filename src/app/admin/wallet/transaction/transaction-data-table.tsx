"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import { TablePagination } from "@/components/admin/common-table/table-pagination"
import { TransactionType, DetailedTransactionType } from "@/schemaValidations/wallet.schema"
import { walletApiRequest } from "@/apiRequests/wallet"
import { TransactionFilterCard } from "@/components/operator/wallet/transaction/transaction-filter-card"
import { TransactionTable } from "@/components/operator/wallet/transaction/transaction-table"
import { TransactionDetailsDialog } from "@/components/operator/wallet/transaction/transaction-details-dialog"

export default function TransactionDataTable() {
  // Data state
  const [transactions, setTransactions] = useState<TransactionType[]>([])
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
  const [typeFilter, setTypeFilter] = useState<string>(`all`)
  const [dateFilter, setDateFilter] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined
  })

  // Transaction details state
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | null>(null)
  const [detailedTransaction, setDetailedTransaction] = useState<DetailedTransactionType | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)

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
  }, [debouncedSearchTerm, typeFilter, dateFilter])

  // Fetch transactions
  const fetchTransactions = async () => {
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

      // Transaction type filter
      if (typeFilter !== "all") {
        filterConditions.push(`type eq '${typeFilter}'`)
      }

      // Date range filter
      if (dateFilter.startDate) {
        const startDateStr = dateFilter.startDate.toISOString()
        filterConditions.push(`createdAt ge ${startDateStr}`)
      }
      
      if (dateFilter.endDate) {
        const endDateStr = dateFilter.endDate.toISOString()
        filterConditions.push(`createdAt le ${endDateStr}`)
      }

      // Combine filter conditions
      if (filterConditions.length > 0) {
        params.append("$filter", filterConditions.join(" and "))
      }

      // Construct the OData query string
      const queryString = `?${params.toString()}`

      // Fetch transactions
      const response = await walletApiRequest.getTransactionWithOData(queryString)
      setTransactions(response.payload?.value)
      setTotalCount(response.payload["@odata.count"] || 0)
    } catch (error) {
      console.error("Error fetching transaction data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch transactions when dependencies change
  useEffect(() => {
    fetchTransactions()
  }, [currentPage, pageSize, debouncedSearchTerm, typeFilter, dateFilter])

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchTransactions()
    setIsRefreshing(false)
  }

  // Handle viewing transaction details
  const handleViewDetails = async (transaction: TransactionType) => {
    setSelectedTransaction(transaction)
    setIsDetailsDialogOpen(true)
    setIsLoadingDetails(true)
    
    try {
      const response = await walletApiRequest.transactionDetail(transaction.transactionId)
      if (response.status === 200) {
        setDetailedTransaction(response.payload)
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error)
    } finally {
      setIsLoadingDetails(false)
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
    setTypeFilter("all")
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
            <CardTitle className="text-2xl font-bold">Lịch sử giao dịch</CardTitle>
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

        {/* Filter card - This will be created separately */}
        <TransactionFilterCard 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          typeFilter={typeFilter} 
          setTypeFilter={setTypeFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          pageSize={pageSize} 
          setPageSize={setPageSize} 
        />

        {/* Table */}
        <div className="rounded-md border">
          <TransactionTable 
            transactions={transactions} 
            loading={loading} 
            resetFilters={resetFilters}
            onViewDetails={handleViewDetails} 
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

      {/* Transaction Details Dialog */}
      {selectedTransaction && (
        <TransactionDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          transaction={selectedTransaction}
          detailedTransaction={detailedTransaction}
          isLoading={isLoadingDetails}
        />
      )}
    </div>
  )
}