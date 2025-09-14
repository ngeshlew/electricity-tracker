import * as React from "react"
import { cn } from "@/lib/utils"

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

const Separator: React.FC<SeparatorProps> = ({ orientation = "horizontal", className, ...props }) => {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        orientation === "vertical" ? "h-full w-px" : "h-px w-full",
        "shrink-0 bg-border",
        className
      )}
      {...props}
    />
  )
}

export { Separator }

