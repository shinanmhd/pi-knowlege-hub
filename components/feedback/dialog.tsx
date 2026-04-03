'use client'

import { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'

export interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
  footer?: React.ReactNode
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
}

export function Dialog({ open, onClose, title, description, size = 'md', children, footer }: DialogProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal
        aria-labelledby={title ? 'dialog-title' : undefined}
        className={cn(
          'relative z-10 w-full rounded-xl bg-surface border border-white/10 shadow-2xl',
          sizeClasses[size],
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 p-6 pb-4">
            <div>
              {title && (
                <h2 id="dialog-title" className="text-base font-semibold text-ink">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-ink-muted">{description}</p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 -mt-1 -mr-1">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Body */}
        {children && <div className="px-6 py-4">{children}</div>}

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[6%]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
