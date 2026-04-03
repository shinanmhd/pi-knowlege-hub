import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-ink-muted">
            {label}
            {props.required && <span className="ml-0.5 text-danger">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full min-h-24 rounded-md bg-surface border text-sm text-ink placeholder:text-ink-subtle',
            'px-3 py-2.5 resize-y transition-colors outline-none',
            'focus:border-primary/60 focus:ring-2 focus:ring-primary/20',
            error
              ? 'border-danger/50 focus:border-danger focus:ring-danger/20'
              : 'border-white/10 hover:border-white/20',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            className,
          )}
          {...props}
        />
        {error  && <p className="text-xs text-danger">{error}</p>}
        {!error && hint && <p className="text-xs text-ink-subtle">{hint}</p>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'
