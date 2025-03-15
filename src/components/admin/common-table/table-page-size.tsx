"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PageSizeSelectorProps {
  pageSize: number
  setPageSize: (value: number) => void
}

export function TablePageSizeSelector({ pageSize, setPageSize }: PageSizeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Số lượng danh mục mỗi trang</Label>
      <Select 
        value={pageSize.toString()} 
        onValueChange={(value) => setPageSize(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="5" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}