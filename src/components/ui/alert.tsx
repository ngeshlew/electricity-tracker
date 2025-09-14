import * as React from "react"
import { cn } from "@/lib/utils"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive"
}

export const Alert: React.FC<AlertProps> = ({ className, variant = "default", ...props }) => {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4",
        variant === "destructive" ? "text-destructive border-destructive/50 bg-destructive/10" : "text-foreground",
        className
      )}
      {...props}
    />
  )
}

export const AlertTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
)

export const AlertDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
)

