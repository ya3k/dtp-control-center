"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Loader2, Trash2 } from "lucide-react"
import { DestinationType } from "@/schemaValidations/admin-destination.schema"

interface DestinationTableProps {
  destinations: DestinationType[]
  loading: boolean
  onEditDestination: (destination: DestinationType) => void
  onDeleteDestination: (destination: DestinationType) => void // Add this prop
  resetFilters: () => void
}

export function DestinationTable({
  destinations,
  loading,
  onEditDestination,
  onDeleteDestination, // Add this prop
  resetFilters,
}: DestinationTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (destinations.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium">Không tìm thấy điểm đến nào</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Thử thay đổi bộ lọc hoặc tìm kiếm để xem nhiều kết quả hơn.
        </p>
        <Button variant="link" onClick={resetFilters} className="mt-2">
          Reset filters
        </Button>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">ID</TableHead>
            <TableHead>Tên điểm đến</TableHead>
            <TableHead>Vĩ độ</TableHead>
            <TableHead>Kinh độ</TableHead>
            <TableHead>Người tạo</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {destinations.map((destination) => (
            <TableRow key={destination.id}>
              <TableCell className="font-medium truncate max-w-[120px]">
                {destination.id.split('-')[0]}...
              </TableCell>
              <TableCell>{destination.name}</TableCell>
              <TableCell>{destination.latitude}</TableCell>
              <TableCell>{destination.longitude}</TableCell>
              <TableCell>{destination.createdBy}</TableCell>
              <TableCell>{new Date(destination.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditDestination(destination)}
                    title="Chỉnh sửa"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    onClick={() => onDeleteDestination(destination)}
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}