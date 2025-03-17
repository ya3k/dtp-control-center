"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RatingFilterProps {
  minRating: number
  setMinRating: (value: number) => void
}

export function OpTourRatingFilter({ minRating, setMinRating }: RatingFilterProps) {
  return (
    <div className="space-y-2">
      <Label>Minimum Rating</Label>
      <Select
        value={minRating.toString()}
        onValueChange={(value) => setMinRating(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Any Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Any Rating</SelectItem>
          <SelectItem value="1">1+ Stars</SelectItem>
          <SelectItem value="2">2+ Stars</SelectItem>
          <SelectItem value="3">3+ Stars</SelectItem>
          <SelectItem value="4">4+ Stars</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
