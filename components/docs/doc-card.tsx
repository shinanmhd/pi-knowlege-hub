import Link from 'next/link'
import { Lock, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatRelativeTime, truncate } from '@/lib/utils/format'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DocStatusBadge } from './doc-status-badge'
import type { DocSummary } from '@/lib/types/doc'

export interface DocCardProps {
  doc: DocSummary
  href: string
  className?: string
}

export function DocCard({ doc, href, className }: DocCardProps) {
  const isExpiringSoon =
    doc.expiresAt && new Date(doc.expiresAt).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000

  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col gap-3 rounded-lg border border-white/[6%] bg-surface p-4',
        'hover:border-white/12 hover:bg-surface-raised transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        className,
      )}
    >
      {/* Top row: status + badges */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <DocStatusBadge status={doc.status} />
          {doc.source === 'master' && (
            <Badge variant="outline" size="sm">
              <Lock className="h-2.5 w-2.5" />
              Master
            </Badge>
          )}
          {doc.hasDeltaOverride && (
            <Badge variant="warning" size="sm">
              Δ Override
            </Badge>
          )}
          {isExpiringSoon && (
            <Badge variant="warning" size="sm">
              Expiring soon
            </Badge>
          )}
        </div>
        <Bookmark className="h-3.5 w-3.5 shrink-0 text-ink-subtle/40 group-hover:text-ink-subtle transition-colors" />
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-ink leading-snug group-hover:text-white transition-colors">
        {doc.title}
      </p>

      {/* Category tag */}
      {doc.category && (
        <span className="w-fit rounded bg-primary-muted px-2 py-0.5 text-[10px] font-medium text-primary">
          {doc.category}
        </span>
      )}

      {/* Excerpt */}
      {doc.excerpt && (
        <p className="text-xs text-ink-subtle leading-relaxed line-clamp-2">
          {truncate(doc.excerpt, 120)}
        </p>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center gap-2 pt-1">
        {doc.createdBy && <Avatar name={doc.createdBy} size="xs" />}
        <span className="text-[11px] text-ink-subtle flex-1 min-w-0 truncate">
          {doc.createdBy && <span className="text-ink-muted">{doc.createdBy} · </span>}
          {formatRelativeTime(doc.updatedAt)}
        </span>
      </div>
    </Link>
  )
}
