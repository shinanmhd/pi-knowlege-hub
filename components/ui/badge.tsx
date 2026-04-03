import { cn } from '@/lib/utils/cn'

const variants = {
  default:     'bg-primary/15 text-primary border border-primary/25',
  success:     'bg-success/10 text-success border border-success/20',
  warning:     'bg-warning/10 text-warning border border-warning/20',
  danger:      'bg-danger/10 text-danger border border-danger/20',
  secondary:   'bg-secondary/10 text-secondary border border-secondary/20',
  outline:     'border border-white/15 text-ink-muted',
  muted:       'bg-surface-raised text-ink-muted border border-white/5',
} as const

const sizes = {
  sm: 'h-5 px-1.5 text-[10px] rounded',
  md: 'h-6 px-2 text-xs rounded',
  lg: 'h-7 px-2.5 text-xs rounded-md',
} as const

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  dot?: boolean
}

const dotColors: Record<keyof typeof variants, string> = {
  default:   'bg-primary',
  success:   'bg-success',
  warning:   'bg-warning',
  danger:    'bg-danger',
  secondary: 'bg-secondary',
  outline:   'bg-ink-muted',
  muted:     'bg-ink-subtle',
}

export function Badge({ className, variant = 'default', size = 'md', dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium whitespace-nowrap',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  )
}
