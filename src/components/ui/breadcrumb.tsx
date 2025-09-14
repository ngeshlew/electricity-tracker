import * as React from "react"
import { cn } from "@/lib/utils"

export const Breadcrumb: React.FC<React.HTMLAttributes<HTMLElement>> = ({ className, ...props }) => (
  <nav aria-label="Breadcrumb" className={cn("text-sm text-muted-foreground", className)} {...props} />
)

export const BreadcrumbList: React.FC<React.HTMLAttributes<ol>> = ({ className, ...props }) => (
  <ol className={cn("flex items-center gap-2", className)} {...props} />
)

export const BreadcrumbItem: React.FC<React.LiHTMLAttributes<HTMLLIElement>> = ({ className, ...props }) => (
  <li className={cn("flex items-center gap-2", className)} {...props} />
)

export const BreadcrumbSeparator: React.FC = () => <span className="opacity-50">/</span>

export const BreadcrumbLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({ className, ...props }) => (
  <a className={cn("hover:text-foreground underline-offset-4 hover:underline", className)} {...props} />
)

export const BreadcrumbPage: React.FC = ({ children }) => <span className="text-foreground">{children}</span>

