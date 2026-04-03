'use client'

import { AppSidebar } from './app-sidebar'
import { buildTenantNav } from '@/lib/constants/nav'
import { Avatar } from '@/components/ui/avatar'

export interface TenantSidebarProps {
  tenantId: string
  tenantName: string
  slug: string
}

/** Client Component — receives only primitive strings from the Server Component shell. */
export function TenantSidebar({ tenantId, tenantName, slug }: TenantSidebarProps) {
  const navSections = buildTenantNav(tenantId)

  const logo = (
    <>
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-overlay text-primary text-[10px] font-bold shrink-0 border border-white/10 uppercase">
        {tenantName.slice(0, 2)}
      </span>
      <span className="text-sm font-semibold text-ink truncate">{tenantName}</span>
    </>
  )

  const footer = (
    <div className="flex items-center gap-2.5 px-1 py-1 rounded-md hover:bg-white/[4%] cursor-pointer transition-colors">
      <Avatar name={tenantName} size="sm" />
      <p className="text-[10px] text-ink-subtle truncate">{slug}.pinetworks.mv</p>
    </div>
  )

  return <AppSidebar logo={logo} navSections={navSections} footer={footer} />
}
