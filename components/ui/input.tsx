import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, prefixIcon, suffixIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-ink-muted">
            {label}
            {props.required && <span className="ml-0.5 text-danger">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixIcon && (
            <span className="absolute left-3 text-ink-subtle pointer-events-none">{prefixIcon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-9 rounded-md bg-surface border text-sm text-ink placeholder:text-ink-subtle',
              'transition-colors outline-none',
              'focus:border-primary/60 focus:ring-2 focus:ring-primary/20',
              error
                ? 'border-danger/50 focus:border-danger focus:ring-danger/20'
                : 'border-white/10 hover:border-white/20',
              prefixIcon  ? 'pl-9'  : 'pl-3',
              suffixIcon  ? 'pr-9'  : 'pr-3',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              className,
            )}
            {...props}
          />
          {suffixIcon && (
            <span className="absolute right-3 text-ink-subtle pointer-events-none">{suffixIcon}</span>
          )}
        </div>
        {error  && <p className="text-xs text-danger">{error}</p>}
        {!error && hint && <p className="text-xs text-ink-subtle">{hint}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
