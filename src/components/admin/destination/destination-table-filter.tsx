import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DestinationTableFilterCardProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  pageSize: number
  setPageSize: (value: number) => void
}

export function DestinationTableFilterCard({
  searchTerm,
  setSearchTerm,
  pageSize,
  setPageSize,
}: DestinationTableFilterCardProps) {
  return (
    <CardContent>
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Search */}
        <div className="w-full md:w-1/3">
          <Label htmlFor="search">Tìm kiếm</Label>
          <Input
            id="search"
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Page Size */}
        <div className="w-full md:w-1/6">
          <Label htmlFor="pageSize">Số lượng hiển thị</Label>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger id="pageSize">
              <SelectValue placeholder="Select page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardContent>
  )
}