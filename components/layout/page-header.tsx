import { cn } from '@/lib/utils/cn'
import { Breadcrumb, type BreadcrumbItem } from '@/components/navigation/breadcrumb'

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  breadcrumb?: BreadcrumbItem[]
  actions?: React.ReactNode
}

export function PageHeader({ title, description, breadcrumb, actions, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)} {...props}>
      <div className="min-w-0">
        {breadcrumb && breadcrumb.length > 0 && (
          <Breadcrumb items={breadcrumb} className="mb-2" />
        )}
        <h1 className="text-lg font-semibold text-ink leading-tight">{title}</h1>
        {description && (
          <p className="mt-0.5 text-sm text-ink-muted">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  )
}
