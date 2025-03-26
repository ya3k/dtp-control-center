"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  loading: boolean
  onPreviousPage: () => void
  onNextPage: () => void
  onPageChange?: (page: number) => void
}

export function TablePagination({ 
  currentPage, 
  totalPages, 
  loading, 
  onPreviousPage, 
  onNextPage,
  onPageChange = () => {}
}: PaginationProps) {
  // Function to generate page numbers array
  const getPageNumbers = () => {
    // If 5 or fewer pages, show all
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Otherwise show first, last, current and pages around current
    const pages: (number | string)[] = [];
    
    // Always show first page
    pages.push(1);
    
    // If current page is far from start, add ellipsis
    if (currentPage > 3) {
      pages.push("...");
    }
    
    // Pages before and after current
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add pages around current
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) { // Skip first and last as they're added separately
        pages.push(i);
      }
    }
    
    // If current page is far from end, add ellipsis
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between my-2 mx-3">
      <div className="text-sm text-muted-foreground">
        Trang hiện tại {currentPage}, tổng {totalPages} trang
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPreviousPage} 
          disabled={currentPage === 1 || loading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {pageNumbers.map((page, index) => 
          typeof page === "string" ? (
            // Ellipsis
            <span key={`ellipsis-${index}`} className="px-2 py-1">
              {page}
            </span>
          ) : (
            // Page number button
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              disabled={loading}
              className="min-w-[32px]"
            >
              {page}
            </Button>
          )
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNextPage} 
          disabled={currentPage >= totalPages || loading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
