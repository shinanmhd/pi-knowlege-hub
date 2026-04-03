'use client'

import { AppSidebar } from './app-sidebar'
import { landlordNav } from '@/lib/constants/nav'
import { Avatar } from '@/components/ui/avatar'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import type { User } from 'next-auth'

/** Client Component — imports landlordNav internally so no functions cross the Server/Client boundary. */
export function LandlordSidebar({ user }: { user?: User }) {
  const logo = (
    <>
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white text-xs font-bold shrink-0">
        PN
      </span>
      <span className="text-sm font-semibold text-ink">Pinetworks Admin</span>
    </>
  )

  const footer = (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2.5 px-1 py-1 rounded-md">
        <Avatar name={user?.name || "Admin User"} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-ink truncate">{user?.name || "Admin User"}</p>
          <p className="text-[10px] text-ink-subtle truncate">{user?.email || "admin@pinetworks.mv"}</p>
        </div>
      </div>
      <button 
        onClick={() => signOut({ callbackUrl: '/login' })} 
        className="flex items-center w-full px-2 py-1.5 text-xs font-medium text-ink-subtle hover:text-ink hover:bg-white/[4%] rounded-md transition-colors"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </button>
    </div>
  )

  return <AppSidebar logo={logo} navSections={landlordNav} footer={footer} />
}
