import type { DocStatus } from '@/lib/types/doc'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'

const statusConfig: Record<
  DocStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'outline' | 'muted' }
> = {
  draft:     { label: 'Draft',     variant: 'muted'    },
  submitted: { label: 'In Review', variant: 'default'  },
  approved:  { label: 'Approved',  variant: 'success'  },
  published: { label: 'Published', variant: 'success'  },
  archived:  { label: 'Archived',  variant: 'outline'  },
  rejected:  { label: 'Rejected',  variant: 'danger'   },
}

export interface DocStatusBadgeProps {
  status: DocStatus
  className?: string
  size?: 'sm' | 'md'
}

export function DocStatusBadge({ status, className, size = 'sm' }: DocStatusBadgeProps) {
  const { label, variant } = statusConfig[status]
  return (
    <Badge variant={variant} size={size} dot className={cn(className)}>
      {label}
    </Badge>
  )
}
