import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton skeleton--text", className)}
      {...props}
    />
  )
}

function ChartSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton h-64 w-full", className)}
      {...props}
    />
  )
}

function CardSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton h-32 w-full", className)}
      {...props}
    />
  )
}

/**
 * LoadingCard Component
 * Skeleton loading state for stat cards matching Timezone-inspired design
 */
function LoadingCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-card text-card-foreground flex flex-col border shadow-sm", className)} {...props}>
      <div className="px-4 pt-4 pb-4 text-center">
        <div className="skeleton skeleton--text" style={{ width: '60%', margin: '0 auto 24px' }}></div>
        <div className="skeleton skeleton--text" style={{ width: '40%', margin: '0 auto 16px', height: '40px' }}></div>
        <div className="skeleton skeleton--text" style={{ width: '30%', margin: '0 auto' }}></div>
      </div>
    </div>
  )
}

export { Skeleton, ChartSkeleton, CardSkeleton, LoadingCard }
