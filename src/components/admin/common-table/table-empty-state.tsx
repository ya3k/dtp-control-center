"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
    mess: string
    resetFilters: () => void
}

export function TableEmptyState({ mess,resetFilters }: EmptyStateProps) {
    return (
        <TableRow>
            <TableCell colSpan={4} className="text-center py-10">
                <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-muted-foreground">{mess}</p>
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                    Xóa lọc
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}