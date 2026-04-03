import { cn } from '@/lib/utils/cn'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card } from '@/components/ui/card'

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  trend?: { value: string; direction: 'up' | 'down' | 'flat' }
  accentColor?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary'
  icon?: React.ReactNode
}

const accentBorder = {
  primary:   'border-l-primary/60',
  success:   'border-l-success/60',
  warning:   'border-l-warning/60',
  danger:    'border-l-danger/60',
  secondary: 'border-l-secondary/60',
} as const

const trendStyle = {
  up:   { icon: TrendingUp,   className: 'text-success' },
  down: { icon: TrendingDown, className: 'text-danger'  },
  flat: { icon: Minus,        className: 'text-ink-subtle' },
} as const

export function StatCard({ label, value, trend, accentColor = 'primary', icon, className, ...props }: StatCardProps) {
  const TrendIcon = trend ? trendStyle[trend.direction].icon : null
  return (
    <Card
      className={cn(
        'p-5 flex flex-col gap-3 border-l-2',
        accentBorder[accentColor],
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-ink-muted uppercase tracking-wide">{label}</p>
        {icon && <span className="text-ink-subtle">{icon}</span>}
      </div>
      <p className="text-2xl font-semibold text-ink tabular-nums">{value}</p>
      {trend && TrendIcon && (
        <div className={cn('flex items-center gap-1 text-xs font-medium', trendStyle[trend.direction].className)}>
          <TrendIcon className="h-3.5 w-3.5" />
          {trend.value}
        </div>
      )}
    </Card>
  )
}
