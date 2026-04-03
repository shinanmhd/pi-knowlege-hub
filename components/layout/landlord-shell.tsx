import { LandlordSidebar } from './landlord-sidebar'

/** Server Component shell for the Landlord (Pinetworks Admin) side. */
export function LandlordShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <LandlordSidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
