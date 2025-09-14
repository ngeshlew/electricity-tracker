import { Toaster as Sonner, toast } from "sonner"

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      theme="system"
      toastOptions={{ className: "border border-border bg-card text-foreground" }}
    />
  )
}

export { toast }

