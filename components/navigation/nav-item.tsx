'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import type { LucideIcon } from 'lucide-react'

export interface NavItemProps {
  href: string
  label: string
  icon: LucideIcon
  badge?: string | number
  collapsed?: boolean
}

export function NavItem({ href, label, icon: Icon, badge, collapsed }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        isActive
          ? 'bg-primary/15 text-primary'
          : 'text-ink-muted hover:text-ink hover:bg-white/[4%]',
        collapsed && 'justify-center px-2',
      )}
    >
      <Icon
        className={cn(
          'shrink-0 transition-colors',
          collapsed ? 'h-5 w-5' : 'h-4 w-4',
          isActive ? 'text-primary' : 'text-ink-subtle group-hover:text-ink-muted',
        )}
      />
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && badge != null && (
        <span className="ml-auto shrink-0 rounded-full bg-surface-overlay text-ink-subtle text-[10px] font-medium px-1.5 min-w-5 text-center">
          {badge}
        </span>
      )}
    </Link>
  )
}
