import { headers } from 'next/headers'
import { TenantShell } from '@/components/layout/tenant-shell'
import type { TenantContext } from '@/lib/types/tenant'

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tenantId: string }>
}) {
  const { tenantId } = await params
  const headersList = await headers()

  const tenant: TenantContext = {
    tenantId,
    slug:   headersList.get('x-tenant-slug')   ?? tenantId,
    name:   headersList.get('x-tenant-name')   ?? tenantId,
    status: (headersList.get('x-tenant-status') as TenantContext['status']) ?? 'active',
  }

  return <TenantShell tenant={tenant}>{children}</TenantShell>
}
