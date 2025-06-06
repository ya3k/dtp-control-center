import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        active:
          "border-transparent bg-green-600 font-bold shadow hover:bg-green-600 text-yellow-400",
        refund: "border-transparent bg-yellow-500 font-bold shadow hover:bg-yellow-600 text-black",
        transfer: "border-transparent bg-blue-500 font-bold shadow hover:bg-blue-600 text-white",
        success: "border-transparent bg-green-500 font-bold shadow hover:bg-green-600 text-white",
        pending: "border-transparent bg-yellow-500 font-bold shadow hover:bg-yellow-600 text-black",
        submitted: "border-transparent bg-blue-500 font-bold shadow hover:bg-blue-600 text-white",
        cancel: "border-transparent bg-red-500 font-bold shadow hover:bg-red-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
