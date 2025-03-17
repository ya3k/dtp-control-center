"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableSearchBar } from "./table-search-bar"
import { TablePageSizeSelector } from "./table-page-size"

interface FilterCardProps {
    searchTerm: string
    setSearchTerm: (value: string) => void   
    pageSize: number
    setPageSize: (value: number) => void
}

export function TableFilterCard({
    searchTerm,
    setSearchTerm,
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
                </div>
            </CardContent>
        </Card>
    )
}
