import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
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
      className={cn(
        "animate-pulse rounded-md bg-muted h-64 w-full",
        className
      )}
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
      className={cn(
        "animate-pulse rounded-md bg-muted h-32 w-full",
        className
      )}
      {...props}
    />
  )
}

/**
 * LoadingCard Component
 * Improved skeleton loading state for stat cards with better visual hierarchy
 */
function LoadingCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-card text-card-foreground flex flex-col border rounded-md p-6", className)} {...props}>
      <div className="space-y-4">
        {/* Title skeleton */}
        <Skeleton className="h-4 w-3/4 mx-auto" />
        {/* Value skeleton */}
        <Skeleton className="h-10 w-1/2 mx-auto" />
        {/* Description skeleton */}
        <Skeleton className="h-3 w-2/3 mx-auto" />
      </div>
    </div>
  )
}

/**
 * TextSkeleton Component
 * Skeleton for text lines with varying widths
 */
function TextSkeleton({
  lines = 3,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}

/**
 * TableSkeleton Component
 * Skeleton for table rows
 */
function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { rows?: number; columns?: number }) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className="h-4 flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export { Skeleton, ChartSkeleton, CardSkeleton, LoadingCard, TextSkeleton, TableSkeleton }
