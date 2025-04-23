"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OpTourSearchBar } from "./op-tour-search-bar"
import { OpTourPageSizeSelector } from "./op-tour-page-size"
import { FormProvider, useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface FilterCardProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    isDeleted: boolean | null
    setIsDeleted: (value: boolean | null) => void
    pageSize: number
    setPageSize: (value: number) => void
}

export function OpTourFilterCard({
    searchTerm,
    setSearchTerm,
    isDeleted,
    setIsDeleted,
    pageSize,
    setPageSize
}: FilterCardProps) {
    // Create form instance
    const form = useForm()
    
    // Convert boolean | null to string for the select component
    const statusValue = isDeleted === null ? "all" : isDeleted ? "false" : "true"

    // Handle status change
    const handleStatusChange = (value: string) => {
        switch (value) {
            case "all":
                setIsDeleted(null)
                break
            case "true":
                setIsDeleted(false)
                break
            case "false":
                setIsDeleted(true)
                break
            default:
                setIsDeleted(null)
        }
    }

    return (
        <FormProvider {...form}>
            <Card>
                <CardHeader>
                    <CardTitle>Tìm kiếm và Lọc</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <OpTourSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Trạng thái</Label>
                            <Select value={statusValue} onValueChange={handleStatusChange}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="true">Đang hoạt động</SelectItem>
                                    <SelectItem value="false">Đã đóng</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <OpTourPageSizeSelector pageSize={pageSize} setPageSize={setPageSize} />
                    </div>
                </CardContent>
            </Card>
        </FormProvider>
    )
}
