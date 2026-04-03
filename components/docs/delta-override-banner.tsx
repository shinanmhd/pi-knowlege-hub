import { TriangleAlert, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { formatRelativeTime } from '@/lib/utils/format'

export interface DeltaOverrideBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  needsReview?: boolean
  masterUpdatedAt?: Date | string | null
  onReview?: () => void
  onViewDetails?: () => void
}

export function DeltaOverrideBanner({
  needsReview = false,
  masterUpdatedAt,
  onReview,
  onViewDetails,
  className,
  ...props
}: DeltaOverrideBannerProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-md border-l-2 px-4 py-3 text-sm',
        needsReview
          ? 'bg-warning/[6%] border-warning text-ink'
          : 'bg-warning/[4%] border-warning/50 text-ink',
        className,
      )}
      {...props}
    >
      <TriangleAlert className={cn('h-4 w-4 mt-0.5 shrink-0', needsReview ? 'text-warning' : 'text-warning/70')} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-ink">
          Pinetworks Master Document
          {needsReview && (
            <span className="ml-2 text-xs font-normal text-warning">
              · Master updated {formatRelativeTime(masterUpdatedAt)} — review your override
            </span>
          )}
        </p>
        <p className="text-xs text-ink-muted mt-0.5">
          Your organisation has a Delta Override applied. Sections marked with{' '}
          <span className="font-semibold text-warning">Δ</span> show your customisations.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {onViewDetails && (
          <Button variant="ghost" size="sm" onClick={onViewDetails}>
            Details
          </Button>
        )}
        {needsReview && onReview && (
          <Button variant="outline" size="sm" onClick={onReview} className="border-warning/30 text-warning hover:bg-warning/10">
            <RefreshCw className="h-3 w-3" />
            Review
          </Button>
        )}
      </div>
    </div>
  )
}
