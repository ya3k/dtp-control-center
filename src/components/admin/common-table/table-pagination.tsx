"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  loading: boolean
  onPreviousPage: () => void
  onNextPage: () => void
}

export function TablePagination({ 
  currentPage, 
  totalPages, 
  loading, 
  onPreviousPage, 
  onNextPage 
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPreviousPage} 
          disabled={currentPage === 1 || loading}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNextPage} 
          disabled={currentPage >= totalPages || loading}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
