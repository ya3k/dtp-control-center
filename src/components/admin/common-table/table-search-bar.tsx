"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  placeHolder?: string
}

export function TableSearchBar({ searchTerm, setSearchTerm , placeHolder }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeHolder ? `${placeHolder}` : `Tìm kiếm`}
        className="pl-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}