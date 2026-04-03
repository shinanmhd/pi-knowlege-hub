import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

const variants = {
  default:     'bg-primary text-white hover:bg-primary-dim active:scale-[0.98]',
  secondary:   'bg-surface-raised text-ink hover:bg-surface-overlay border border-white/10',
  outline:     'border border-white/10 text-ink hover:bg-surface hover:border-white/20',
  ghost:       'text-ink-muted hover:text-ink hover:bg-surface',
  destructive: 'bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20',
  link:        'text-primary underline-offset-4 hover:underline h-auto px-0 py-0',
} as const

const sizes = {
  sm:   'h-8 px-3 text-xs gap-1.5 rounded',
  md:   'h-9 px-4 text-sm gap-2 rounded-md',
  lg:   'h-10 px-5 text-sm gap-2 rounded-md',
  icon: 'h-9 w-9 rounded-md',
} as const

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas',
        'disabled:pointer-events-none disabled:opacity-40 select-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
