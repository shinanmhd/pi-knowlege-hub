import { LandlordSidebar } from './landlord-sidebar'
import type { User } from 'next-auth'

/** Server Component shell for the Landlord (Pinetworks Admin) side. */
export function LandlordShell({ children, user }: { children: React.ReactNode; user?: User }) {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <LandlordSidebar user={user} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
