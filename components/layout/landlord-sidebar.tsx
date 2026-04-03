'use client'

import { AppSidebar } from './app-sidebar'
import { landlordNav } from '@/lib/constants/nav'
import { Avatar } from '@/components/ui/avatar'

/** Client Component — imports landlordNav internally so no functions cross the Server/Client boundary. */
export function LandlordSidebar() {
  const logo = (
    <>
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white text-xs font-bold shrink-0">
        PN
      </span>
      <span className="text-sm font-semibold text-ink">Pinetworks Admin</span>
    </>
  )

  const footer = (
    <div className="flex items-center gap-2.5 px-1 py-1 rounded-md hover:bg-white/[4%] cursor-pointer transition-colors">
      <Avatar name="Admin User" size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-ink truncate">Admin User</p>
        <p className="text-[10px] text-ink-subtle truncate">admin@pinetworks.mv</p>
      </div>
    </div>
  )

  return <AppSidebar logo={logo} navSections={landlordNav} footer={footer} />
}
