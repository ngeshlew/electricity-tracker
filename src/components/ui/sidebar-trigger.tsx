import * as React from "react"
import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isCollapsed?: boolean
  onToggle?: () => void
}

const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, isCollapsed = false, onToggle, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className={cn(
          "h-8 w-8 p-0 hover:bg-sidebar-accent",
          className
        )}
        {...props}
      >
        <PanelLeft className="h-4 w-4 text-sidebar-foreground" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
    )
  }
)
SidebarTrigger.displayName = "SidebarTrigger"

export { SidebarTrigger }
