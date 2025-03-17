"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OpTourSearchBar } from "./op-tour-search-bar"
import { OpTourRatingFilter } from "./op-tour-rating-filter"
import { OpTourPageSizeSelector } from "./op-tour-page-size"

interface FilterCardProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    minRating: number
    setMinRating: (value: number) => void
    pageSize: number
    setPageSize: (value: number) => void
}

export function OpTourFilterCard({
    searchTerm,
    setSearchTerm,
    minRating,
    setMinRating,
    pageSize,
    setPageSize
}: FilterCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Search & Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <OpTourSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <OpTourRatingFilter minRating={minRating} setMinRating={setMinRating} />
                    <OpTourPageSizeSelector pageSize={pageSize} setPageSize={setPageSize} />
                </div>
            </CardContent>
        </Card>
    )
}
