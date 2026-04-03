import { NextRequest, NextResponse } from 'next/server'
import { landlordDb } from '@/lib/db/landlord/client'
import { tenants } from '@/lib/db/landlord/schema'
import { eq } from 'drizzle-orm'

// ─────────────────────────────────────────────────────────────────────────────
// TENANT RESOLVER PROXY
//
// Runs in Node.js runtime before every non-static request.
// Identifies the tenant from the subdomain (e.g. "alpha" from alpha.pinetworks.mv)
// and rewrites the request to the internal /tenant/[tenantId] route group.
//
// The user always sees their original URL — the tenantId is internal only.
//
// Local dev: use subdomains via alpha.localhost:3000
// Add to /etc/hosts: 127.0.0.1  alpha.localhost
//                    127.0.0.1  beta.localhost
// ─────────────────────────────────────────────────────────────────────────────

// In-memory cache: slug → tenant metadata, expires after 5 minutes
// Avoids a DB query on every single request without adding an external dependency
const cache = new Map<string, { tenant: TenantMeta; expiresAt: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

type TenantMeta = { id: string; slug: string; name: string }

async function resolveTenant(slug: string): Promise<TenantMeta | null> {
  const cached = cache.get(slug)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.tenant
  }

  const result = await landlordDb
    .select({ id: tenants.id, slug: tenants.slug, name: tenants.name })
    .from(tenants)
    .where(eq(tenants.slug, slug))
    .limit(1)

  if (!result.length || result[0].slug !== slug) return null

  const tenant = result[0]
  cache.set(slug, { tenant, expiresAt: Date.now() + CACHE_TTL_MS })
  return tenant
}

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  // Extract the subdomain slug
  // Handles: alpha.pinetworks.mv → "alpha"
  //          alpha.localhost:3000 → "alpha"
  //          localhost:3000 → null (Pinetworks admin panel)
  const slug = extractSlug(hostname)

  // No subdomain = Pinetworks admin panel (landlord routes)
  if (!slug) {
    return NextResponse.next()
  }

  let tenant: TenantMeta | null = null

  try {
    tenant = await resolveTenant(slug)
  } catch {
    // DB error — fail open to avoid blocking all traffic
    console.error(`[proxy] Failed to resolve tenant for slug: ${slug}`)
    return NextResponse.next()
  }

  if (!tenant) {
    url.pathname = '/not-found'
    return NextResponse.rewrite(url)
  }

  // Rewrite the request to the internal tenant route group.
  // Route groups with (parentheses) don't appear in URLs — so
  // app/(tenant)/[tenantId]/docs/page.tsx handles the path /{tenantId}/docs.
  // We prepend the tenantId UUID so each tenant's traffic routes to their segment.
  const originalPathname = url.pathname
  url.pathname = `/${tenant.id}${originalPathname === '/' ? '' : originalPathname}`

  const response = NextResponse.rewrite(url)

  // Attach tenant metadata as headers — available in Server Components
  // via headers() without needing to re-query the DB on every render
  response.headers.set('x-tenant-id', tenant.id)
  response.headers.set('x-tenant-slug', tenant.slug)
  response.headers.set('x-tenant-name', tenant.name)

  return response
}

function extractSlug(hostname: string): string | null {
  const host = hostname.split(':')[0]
  if (host === 'localhost') return null
  const parts = host.split('.')
  if (parts.length < 2) return null
  const slug = parts[0]
  if (!slug || slug === 'www') return null
  return slug
}

// Run on all page routes — skip API, static files, and Next.js internals
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|not-found).*)'],
}
