"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"

type TransactionFilterCardProps = {
  searchTerm: string
  setSearchTerm: (value: string) => void
  typeFilter: string
  setTypeFilter: (value: string) => void
  dateFilter: {
    startDate: Date | undefined
    endDate: Date | undefined
  }
  setDateFilter: (value: { startDate: Date | undefined; endDate: Date | undefined }) => void
  pageSize: number
  setPageSize: (value: number) => void
}

export function TransactionFilterCard({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  dateFilter,
  setDateFilter,
  pageSize,
  setPageSize,
}: TransactionFilterCardProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Reset date filter
  const handleResetDateFilter = () => {
    setDateFilter({
      startDate: undefined,
      endDate: undefined,
    })
  }

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return ""
    return format(date, "dd/MM/yyyy", { locale: vi })
  }

  // Get date filter display text
  const getDateFilterDisplay = () => {
    if (!dateFilter.startDate && !dateFilter.endDate) return "Chọn thời gian"
    
    if (dateFilter.startDate && dateFilter.endDate) {
      return `${formatDate(dateFilter.startDate)} - ${formatDate(dateFilter.endDate)}`
    }
    
    if (dateFilter.startDate) return `Từ ${formatDate(dateFilter.startDate)}`
    return `Đến ${formatDate(dateFilter.endDate)}`
  }

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search input */}
        <div className="space-y-2">
          <Label htmlFor="search">Tìm kiếm</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Tìm kiếm giao dịch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Transaction type filter */}
        <div className="space-y-2">
          <Label htmlFor="type-filter">Loại giao dịch</Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger id="type-filter">
              <SelectValue placeholder="Chọn loại giao dịch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Deposit">Nạp tiền</SelectItem>
              <SelectItem value="Withdraw">Rút tiền</SelectItem>
              <SelectItem value="Transfer">Chuyển tiền</SelectItem>
              <SelectItem value="ThirdPartyPayment">Thanh toán bên thứ ba</SelectItem>
              <SelectItem value="Payment">Thanh toán</SelectItem>
              <SelectItem value="Receive">Nhận tiền</SelectItem>
              <SelectItem value="Refund">Hoàn tiền</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date range filter */}
        <div className="space-y-2">
          <Label>Thời gian giao dịch</Label>
          <div className="flex gap-2">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    (dateFilter.startDate || dateFilter.endDate) && "text-primary"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {getDateFilterDisplay()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateFilter.startDate || new Date()}
                  selected={{
                    from: dateFilter.startDate,
                    to: dateFilter.endDate,
                  }}
                  onSelect={(range) => {
                    setDateFilter({
                      startDate: range?.from,
                      endDate: range?.to,
                    })
                    if (range?.to) {
                      setIsCalendarOpen(false)
                    }
                  }}
                  locale={vi}
                />
                <div className="p-2 border-t flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleResetDateFilter()
                      setIsCalendarOpen(false)
                    }}
                  >
                    Xoá
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Page size */}
        <div className="space-y-2">
          <Label htmlFor="page-size">Hiển thị</Label>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(parseInt(value))}
          >
            <SelectTrigger id="page-size">
              <SelectValue placeholder="Số lượng mỗi trang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 giao dịch</SelectItem>
              <SelectItem value="25">25 giao dịch</SelectItem>
              <SelectItem value="50">50 giao dịch</SelectItem>
              <SelectItem value="100">100 giao dịch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter tags and reset buttons would go here if needed */}
      {(searchTerm || typeFilter !== "all" || dateFilter.startDate || dateFilter.endDate) && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm("")
              setTypeFilter("all")
              handleResetDateFilter()
            }}
            className="text-sm"
          >
            Xoá bộ lọc <X className="h-3 w-3 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}