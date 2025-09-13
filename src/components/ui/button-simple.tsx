import * as React from "react"
import { cn } from "@/lib/utils-simple"

// Simple button variants without external dependencies
const buttonVariants = {
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary",
      ghost: "hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent",
      link: "text-primary underline-offset-4 hover:underline focus-visible:ring-primary",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  }
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variants.variant
  size?: keyof typeof buttonVariants.variants.size
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = buttonVariants.variants.variant[variant]
    const sizeClasses = buttonVariants.variants.size[size]
    
    return (
      <button
        className={cn(
          buttonVariants.base,
          variantClasses,
          sizeClasses,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }