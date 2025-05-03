import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface VoucherTableFilterCardProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  pageSize: number
  setPageSize: (value: number) => void
}

export function VoucherTableFilterCard({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  pageSize,
  setPageSize,
}: VoucherTableFilterCardProps) {
  const [inputValue, setInputValue] = useState(searchTerm)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTerm(inputValue)
    }
  }

  const handleInputBlur = () => {
    setSearchTerm(inputValue)
  }

  return (
    <Card className="mx-4 mb-4 border-0 shadow-none">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Label htmlFor="search-voucher" className="text-sm font-medium pb-1 block">
              Tìm kiếm
            </Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-voucher"
                placeholder="Tìm theo mã..."
                className="pl-8"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onBlur={handleInputBlur}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <Label htmlFor="status-filter" className="text-sm font-medium pb-1 block">
              Trạng thái
            </Label>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger id="status-filter" className="w-full">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Còn hiệu lực</SelectItem>
                <SelectItem value="expired">Hết hạn</SelectItem>
                <SelectItem value="used-up">Hết lượt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Page Size */}
          <div>
            <Label htmlFor="page-size" className="text-sm font-medium pb-1 block">
              Hiển thị
            </Label>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger id="page-size" className="w-full">
                <SelectValue placeholder="10 mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 mục</SelectItem>
                <SelectItem value="10">10 mục</SelectItem>
                <SelectItem value="20">20 mục</SelectItem>
                <SelectItem value="50">50 mục</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 