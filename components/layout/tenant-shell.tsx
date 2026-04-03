import { TenantSidebar } from './tenant-sidebar'
import type { TenantContext } from '@/lib/types/tenant'

export interface TenantShellProps {
  children: React.ReactNode
  tenant: TenantContext
}

/** Server Component shell for the Tenant side (e.g. bml.pinetworks.mv).
 *  Only primitive strings are passed across the Server→Client boundary. */
export function TenantShell({ children, tenant }: TenantShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      {/* Thin indigo top accent indicates this is a tenant session */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-primary z-50" />
      <TenantSidebar
        tenantId={tenant.tenantId}
        tenantName={tenant.name}
        slug={tenant.slug}
      />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
