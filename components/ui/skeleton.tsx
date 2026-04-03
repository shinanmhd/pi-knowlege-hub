import { cn } from '@/lib/utils/cn'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-surface-raised',
        className,
      )}
      {...props}
    />
  )
}

/** Preset skeleton for a text line. */
export function SkeletonText({ className, ...props }: SkeletonProps) {
  return <Skeleton className={cn('h-3.5 w-full', className)} {...props} />
}

/** Preset skeleton for a card block. */
export function SkeletonCard({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn('p-5 rounded-lg border border-white/[6%] bg-surface space-y-3', className)} {...props}>
      <Skeleton className="h-4 w-2/3" />
      <SkeletonText className="w-full" />
      <SkeletonText className="w-4/5" />
    </div>
  )
}
