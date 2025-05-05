"use client"

import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableSearchBar } from "@/components/admin/common-table/table-search-bar"
import { TablePageSizeSelector } from "@/components/admin/common-table/table-page-size"
import { Role } from "@/schemaValidations/admin-user.schema"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useAuthContext } from "@/providers/AuthProvider"
import { UserRoleEnum } from "@/types/user"

interface FilterCardProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    pageSize: number
    setPageSize: (value: number) => void
    roleFilter?: string
    setRoleFilter?: (value: string) => void
    companyFilter?: string
    setCompanyFilter?: (value: string) => void
    onClearFilters?: () => void
    companies: { id: string, name: string }[]
    loadingCompanies?: boolean
}

export function UserTableFilterCard({
    searchTerm,
    setSearchTerm,
    pageSize,
    setPageSize,
    roleFilter = "",
    setRoleFilter = () => { },
    companyFilter = "",
    setCompanyFilter = () => { },
    onClearFilters,
    companies = [],
    loadingCompanies = false
}: FilterCardProps) {
    // Get all roles from the Role enum
    const roleOptions = Object.values(Role)
    // Handle clearing all filters
    const { user } = useAuthContext();

    const handleClearFilters = () => {
        setSearchTerm("")
        setRoleFilter("all")
        setCompanyFilter("all")
        setPageSize(10)

        // Call external handler if provided
        if (onClearFilters) {
            onClearFilters()
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tìm kiếm và lọc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <TableSearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    placeHolder="Tìm theo tên người dùng hoặc email..."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {user?.roleName === UserRoleEnum.Admin &&
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="role-filter">Vai trò</Label>
                                <Select
                                    value={roleFilter}
                                    onValueChange={setRoleFilter}
                                >
                                    <SelectTrigger id="role-filter">
                                        <SelectValue placeholder="Tất cả vai trò" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả vai trò</SelectItem>
                                        {roleOptions.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company-filter">Công ty</Label>
                                <Select
                                    value={companyFilter}
                                    onValueChange={setCompanyFilter}
                                    disabled={loadingCompanies || companies.length === 0}
                                >
                                    <SelectTrigger id="company-filter">
                                        <SelectValue placeholder="Tất cả công ty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả công ty</SelectItem>
                                        {companies.map((company) => (
                                            <SelectItem key={company.id} value={company.name}>
                                                {company.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    }




                    <TablePageSizeSelector pageSize={pageSize} setPageSize={setPageSize} />
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="flex items-center gap-1"
                >
                    <RefreshCw className="h-4 w-4" />
                    <span>Xóa bộ lọc</span>
                </Button>
            </CardFooter>
        </Card>
    )
}