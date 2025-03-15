"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableSearchBar } from "../common-table/table-search-bar"
import { TablePageSizeSelector } from "../common-table/table-page-size"
import { CompanyLicenseFilter } from "./company-license-filter";


interface FilterCardProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    licenseFilter: string;
    setLicenseFilter: (value: string) => void;
    pageSize: number;
    setPageSize: (value: number) => void;
}

export function CompanyTableFilterCard({
    searchTerm,
    setSearchTerm,
    licenseFilter,
    setLicenseFilter,
    pageSize,
    setPageSize
}: FilterCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tìm kiếm và lọc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <TableSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TablePageSizeSelector pageSize={pageSize} setPageSize={setPageSize} />
                    <CompanyLicenseFilter licenseFilter={licenseFilter} setLicenseFilter={setLicenseFilter} />
                </div>
            </CardContent>
        </Card>
    )
}
