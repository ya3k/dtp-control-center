"use client"

import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
}

export function OpTourStarRating({ rating }: StarRatingProps) {
  return (
    <div className="flex items-center">
      {rating > 0 ? rating.toFixed(1) : "N/A"}
      <Star className="h-4 w-4 ml-1 text-yellow-500" fill={rating > 0 ? "currentColor" : "none"} />
    </div>
  )
}