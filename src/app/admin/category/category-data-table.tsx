"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCcw } from "lucide-react"
import { TablePagination } from "@/components/admin/common-table/table-pagination"
import { CategoryType } from "@/schemaValidations/category.schema"
import categoryApiRequest from "@/apiRequests/category"
import { CategoryTable } from "@/components/admin/category/category-table"
import { CreateCategoryDialog } from "@/components/admin/category/create-category-dialog"
import { DeleteCategoryDialog } from "@/components/admin/category/delete-category-dialog"
import { EditCategoryDialog } from "@/components/admin/category/edit-category-dialog"
import { DestinationTableFilterCard } from "@/components/admin/destination/destination-table-filter"

export default function CategoryDataTable() {
    // Data state
    const [category, setCategory] = useState<CategoryType[]>([])
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
    const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null)
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
    const fetchCategories = async () => {
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

            //   // Only show non-deleted destinations
            //   filterConditions.push(`isDeleted eq false`)

            // Combine filter conditions
            if (filterConditions.length > 0) {
                params.append("$filter", filterConditions.join(" and "))
            }

            // Ordering
            params.append("$orderby", "createdAt desc")

            // Construct the OData query string
            const queryString = `?${params.toString()}`
            console.log(queryString)
            // Use categoryApiRequest instead of direct fetch
            const response = await categoryApiRequest.getWithOData(queryString)
            console.log(JSON.stringify(response))
            setCategory(response.payload?.value)
            setTotalCount(response.payload["@odata.count"] || 0)
        } catch (error) {
            console.error("Lỗi khi tải :", error)
        } finally {
            setLoading(false)
        }
    }

    // Fetch data with OData parameters
    useEffect(() => {
        fetchCategories()
    }, [currentPage, pageSize, debouncedSearchTerm])

    // Handle refresh
    const handleRefresh = async () => {
        setIsRefreshing(true)
        await fetchCategories()
        setIsRefreshing(false)
    }

    // Handle create
    const handleCreateDestination = () => {
        setIsCreateDialogOpen(true)
    }

    // Handle update
    const handleEditCategory = (category: CategoryType) => {
        setSelectedCategory(category)
        setIsEditDialogOpen(true)
    }

    const handleCreateComplete = () => {
        fetchCategories()
    }

    const handleEditComplete = (category: CategoryType) => {
        setSelectedCategory(null)
        setIsEditDialogOpen(false)
        setCategory(prevCategories =>
            prevCategories.map(cat => (cat.id === category.id ? category : cat))
        )
        // fetchCategories() // Refresh the data to ensure we have the latest version
    }

    // Handle delete
    const handleDeleteCategory = (category: CategoryType) => {
        setSelectedCategory(category)
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteComplete = (deletedId: string) => {
        setCategory(prevCategories => prevCategories.filter(cat => cat.id !== deletedId))
        setSelectedCategory(null)
        setIsDeleteDialogOpen(false)
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
                        <CardTitle className="text-2xl font-bold">Quản lý danh sách categories</CardTitle>
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
                                <span>Thêm danh mục</span>
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
                    <CategoryTable
                        categories={category}
                        loading={loading}
                        onEditCategory={handleEditCategory}
                        onDeleteCategory={handleDeleteCategory}
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
            <CreateCategoryDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onCreateComplete={handleCreateComplete}
            />

            {/* Edit Dialog */}
            <EditCategoryDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                category={selectedCategory}
                onEditComplete={handleEditComplete}
            />

            {/* Delete Dialog */}
            <DeleteCategoryDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                category={selectedCategory}
                onDeleteComplete={handleDeleteComplete}
            />
        </div>
    )
}