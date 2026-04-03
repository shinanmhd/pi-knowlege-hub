import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'
import { FileX2 } from 'lucide-react'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
}

export function EmptyState({
  icon: Icon = FileX2,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-white/10 py-16 px-8 text-center',
        className,
      )}
      {...props}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-raised text-ink-subtle">
        <Icon className="h-6 w-6" />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {description && <p className="text-xs text-ink-muted max-w-xs mx-auto">{description}</p>}
      </div>
      {action && (
        <Button size="sm" variant="outline" {...(action.href ? { onClick: action.onClick } : { onClick: action.onClick })}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
