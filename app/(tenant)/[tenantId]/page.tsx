import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { TenantLanding } from '@/components/marketing/tenant-landing'

// Dynamic metadata using tenant name from proxy headers
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenantId: string }>
}): Promise<Metadata> {
  await params
  const h = await headers()
  const tenantName = h.get('x-tenant-name') ?? 'Your Organization'
  return {
    title: `${tenantName} | Knowledge Platform`,
    description: `${tenantName}'s centralized documentation hub — version controlled, AI-searchable, and compliance ready.`,
  }
}

// This page is the public-facing landing shown when a user visits
// their organization's subdomain before logging in.
// Route: (tenant)/[tenantId]/page.tsx  →  URL: /{tenantId} (rewritten from tenant.domain/)
// No shell layout wraps this — it has its own navbar and is fully standalone.
export default async function TenantIndexPage({
  params,
}: {
  params: Promise<{ tenantId: string }>
}) {
  await params
  const h = await headers()

  const tenantName = h.get('x-tenant-name') ?? 'Your Organization'
  const tenantSlug = h.get('x-tenant-slug') ?? 'org'

  return <TenantLanding tenantName={tenantName} tenantSlug={tenantSlug} />
}
