'use client'

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCcw } from "lucide-react"
import { toast } from "sonner"
import { VoucherResType } from "@/schemaValidations/admin-voucher.schema"
import { voucherApiRequest } from "@/apiRequests/voucher"
import { VoucherTable } from "@/components/admin/voucher/voucher-table"
import { VoucherTableFilterCard } from "@/components/admin/voucher/voucher-table-filter"
import { CreateVoucherDialog } from "@/components/admin/voucher/create-voucher-dialog"
import { EditVoucherDialog } from "@/components/admin/voucher/edit-voucher-dialog"
import { DeleteVoucherDialog } from "@/components/admin/voucher/delete-voucher-dialog"
import { TablePagination } from "@/components/admin/common-table/table-pagination"

function VoucherDataTable() {
    // Data state
    const [vouchers, setVouchers] = useState<VoucherResType[]>([])
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

    // Dialog states
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [selectedVoucher, setSelectedVoucher] = useState<VoucherResType | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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
    }, [debouncedSearchTerm, statusFilter])

    // Fetch vouchers with filters and pagination
    const fetchVouchers = async () => {
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

            // Search term (code, description contains)
            if (debouncedSearchTerm) {
                filterConditions.push(`contains(code, '${debouncedSearchTerm}') or contains(description, '${debouncedSearchTerm}')`)
            }

            // Status filter
            const now = new Date().toISOString().split("T")[0];
            if (statusFilter === "active") {
                filterConditions.push(`expiryDate gt ${now} and availableVoucher gt 0 and isDeleted eq false`);
            } else if (statusFilter === "expired") {
                filterConditions.push(`expiryDate lt ${now} and isDeleted eq false`);
            } else if (statusFilter === "used-up") {
                filterConditions.push(`availableVoucher eq 0 and expiryDate gt ${now} and isDeleted eq false`);
            } else if (statusFilter === "deleted") {
                filterConditions.push(`isDeleted eq true`);
            } else {
                // default case (e.g. "all")
                // filterConditions.push(`isDeleted eq false`);
            }

            // Combine filter conditions
            if (filterConditions.length > 0) {
                params.append("$filter", filterConditions.join(" and "))
            }

            // Construct the OData query string
            const queryString = `?${params.toString()}`
            console.log(queryString)
            const response = await voucherApiRequest.getOdata(queryString)
            setVouchers(response.payload?.value || [])
            setTotalCount(response.payload["@odata.count"] || 0)
        } catch (error) {
            console.error("Error fetching vouchers:", error)
            toast.error("Không thể tải danh sách voucher")
            setVouchers([])
        } finally {
            setLoading(false)
            setIsRefreshing(false)
        }
    }

    // Fetch vouchers on mount and when dependencies change
    useEffect(() => {
        fetchVouchers()
    }, [currentPage, pageSize, debouncedSearchTerm, statusFilter])

    // Handler functions
    const handleRefresh = () => {
        setIsRefreshing(true)
        fetchVouchers()
    }

    const handleCreateVoucher = () => {
        setCreateDialogOpen(true)
    }

    const handleCreateComplete = () => {
        fetchVouchers()
    }

    const handleEditVoucher = (voucher: VoucherResType) => {
        setSelectedVoucher(voucher)
        setIsEditDialogOpen(true)
    }

    const handleDeleteVoucher = (voucher: VoucherResType) => {
        setSelectedVoucher(voucher)
        setIsDeleteDialogOpen(true)
    }

    const handleEditComplete = () => {
        // Update the voucher in the local state without refetching
        fetchVouchers();
    }

    const handleDeleteComplete = (deletedId: string) => {
        // Remove the voucher from the local state without refetching
        setVouchers((prevVouchers) =>
            prevVouchers.filter((voucher) => voucher.id !== deletedId)
        )
        // Update total count
        setTotalCount(prev => Math.max(0, prev - 1))
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

    // Reset filters
    const resetFilters = () => {
        setSearchTerm("")
        setDebouncedSearchTerm("")
        setStatusFilter("all")
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="mx-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">Quản lý Voucher</CardTitle>
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
                                        <span>Đang tải...</span>
                                    </>
                                ) : (
                                    <>
                                        <RefreshCcw className="h-4 w-4" />
                                        <span>Làm mới</span>
                                    </>
                                )}
                            </Button>

                            <Button
                                variant="core"
                                size="default"
                                className="gap-2"
                                disabled={loading || isRefreshing}
                                onClick={handleCreateVoucher}
                            >
                                <PlusCircle className="h-4 w-4" />
                                <span>Tạo voucher</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {/* Search and Filters */}
                <VoucherTableFilterCard
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                />

                {/* Table */}
                <div className="rounded-md border">
                    <VoucherTable
                        vouchers={vouchers}
                        loading={loading}
                        onEditVoucher={handleEditVoucher}
                        onDeleteVoucher={handleDeleteVoucher}
                        resetFilters={resetFilters}
                    />
                </div>

                {/* Pagination */}
                <TablePagination
                    currentPage={currentPage}
                    loading={loading}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    totalPages={totalPages}
                />
            </Card>

            {/* Create Dialog */}
            <CreateVoucherDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onCreateComplete={handleCreateComplete}
            />

            {/* Edit Dialog */}
            <EditVoucherDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                voucher={selectedVoucher}
                onEditComplete={handleEditComplete}
            />

            {/* Delete Dialog */}
            <DeleteVoucherDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                voucher={selectedVoucher}
                onDeleteComplete={handleDeleteComplete}
            />
        </div>
    )
}

export default VoucherDataTable 