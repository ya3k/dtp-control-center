"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableSearchBar } from "@/components/admin/common-table/table-search-bar"
import { TablePageSizeSelector } from "@/components/admin/common-table/table-page-size"

interface FilterCardProps {
    searchTerm: string
    setSearchTerm: (value: string) => void   
    pageSize: number
    setPageSize: (value: number) => void
    roleFilter?: string
    setRoleFilter?: (value: string) => void
    companyFilter?: string
    setCompanyFilter?: (value: string) => void
}

export function UserTableFilterCard({
    searchTerm,
    setSearchTerm,
    pageSize,
    setPageSize,
    roleFilter = "",
    setRoleFilter = () => {},
    companyFilter = "",
    setCompanyFilter = () => {}
}: FilterCardProps) {
    const [roles, setRoles] = useState<{id: string, name: string}[]>([])
    const [companies, setCompanies] = useState<{id: string, name: string}[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchFilterData = async () => {
            setLoading(true)
            try {
                // Fetch roles for dropdown
                const rolesResponse = await userApi.getRoles()
                setRoles(rolesResponse?.payload || [])
                
                // Fetch companies for dropdown
                const companiesResponse = await userApi.getCompanies()
                setCompanies(companiesResponse?.payload || [])
            } catch (error) {
                console.error("Error fetching filter data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchFilterData()
    }, [])

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
                    <div className="space-y-2">
                        <Label htmlFor="role-filter">Vai trò</Label>
                        <Select
                            value={roleFilter}
                            onValueChange={setRoleFilter}
                            disabled={loading || roles.length === 0}
                        >
                            <SelectTrigger id="role-filter">
                                <SelectValue placeholder="Tất cả vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Tất cả vai trò</SelectItem>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                        {role.name}
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
                            disabled={loading || companies.length === 0}
                        >
                            <SelectTrigger id="company-filter">
                                <SelectValue placeholder="Tất cả công ty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Tất cả công ty</SelectItem>
                                {companies.map((company) => (
                                    <SelectItem key={company.id} value={company.id}>
                                        {company.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <TablePageSizeSelector pageSize={pageSize} setPageSize={setPageSize} />
                </div>
            </CardContent>
        </Card>
    )
}