import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { NavItem } from '@/components/navigation/nav-item'
import { Separator } from '@/components/ui/separator'
import type { NavSection } from '@/lib/constants/nav'

export interface AppSidebarProps {
  logo: React.ReactNode
  logoHref?: string
  navSections: NavSection[]
  footer?: React.ReactNode
  className?: string
}

export function AppSidebar({ logo, logoHref = '/', navSections, footer, className }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full w-60 shrink-0 flex-col border-r border-white/[6%] bg-surface',
        className,
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center px-4 border-b border-white/[6%]">
        <Link href={logoHref} className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded">
          {logo}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navSections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-ink-subtle">
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <NavItem
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    badge={item.badge}
                  />
                </li>
              ))}
            </ul>
            {si < navSections.length - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </nav>

      {/* Footer slot */}
      {footer && (
        <>
          <Separator />
          <div className="p-3">{footer}</div>
        </>
      )}
    </aside>
  )
}
