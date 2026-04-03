import { cn } from '@/lib/utils/cn'
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react'

const variants = {
  info:    { icon: Info,          classes: 'bg-primary/8 border-primary/20 text-ink',    iconClass: 'text-primary'  },
  success: { icon: CheckCircle2,  classes: 'bg-success/8 border-success/20 text-ink',    iconClass: 'text-success'  },
  warning: { icon: AlertTriangle, classes: 'bg-warning/8 border-warning/20 text-ink',    iconClass: 'text-warning'  },
  danger:  { icon: XCircle,       classes: 'bg-danger/8 border-danger/20 text-ink',      iconClass: 'text-danger'   },
} as const

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants
  title?: string
  onDismiss?: () => void
}

export function Alert({ variant = 'info', title, children, onDismiss, className, ...props }: AlertProps) {
  const { icon: Icon, classes, iconClass } = variants[variant]
  return (
    <div
      role="alert"
      className={cn('flex gap-3 rounded-md border p-4 text-sm', classes, className)}
      {...props}
    >
      <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', iconClass)} />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="text-ink-muted leading-relaxed">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 text-ink-subtle hover:text-ink transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
