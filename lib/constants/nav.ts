import {
  LayoutDashboard,
  Users,
  BookOpen,
  Database,
  FileText,
  Settings,
  Search,
  Wrench,
  ScrollText,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string | number
}

export interface NavSection {
  label?: string
  items: NavItem[]
}

/** Navigation for the Landlord (Pinetworks Admin) side. */
export const landlordNav: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Tenants', href: '/tenants', icon: Users },
      { label: 'Master Docs', href: '/master-docs', icon: BookOpen },
      { label: 'Migrations', href: '/migrations', icon: Database },
      { label: 'Audit Logs', href: '/audit-logs', icon: ScrollText },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', href: '/settings', icon: Settings },
      { label: 'Help', href: '/help', icon: HelpCircle },
    ],
  },
]

/** Navigation for the Tenant side. `tenantId` is injected at runtime. */
export function buildTenantNav(tenantId: string): NavSection[] {
  const base = `/tenant/${tenantId}`
  return [
    {
      items: [
        { label: 'Dashboard', href: `${base}/dashboard`, icon: LayoutDashboard },
        { label: 'Docs', href: `${base}/docs`, icon: FileText },
        { label: 'Resolutions', href: `${base}/resolutions`, icon: Wrench },
        { label: 'Search', href: `${base}/search`, icon: Search },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: 'Settings', href: `${base}/settings`, icon: Settings },
        { label: 'Audit Log', href: `${base}/audit-logs`, icon: ScrollText },
      ],
    },
  ]
}
