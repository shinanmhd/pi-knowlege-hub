import { NextRequest, NextResponse } from 'next/server'
import { landlordDb } from '@/lib/db/landlord/client'
import { tenants } from '@/lib/db/landlord/schema'
import { eq } from 'drizzle-orm'

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL: RESOLVE TENANT
//
// Called only by middleware.ts to resolve a tenant slug to its metadata.
// This route runs in the Node.js runtime (not Edge) so it can use ioredis
// and the postgres driver.
//
// Flow:
//   1. Check Redis cache for "tenant:{slug}"  (TTL = 5 min)
//   2. On miss: query Landlord DB
//   3. Populate Redis cache
//   4. Return tenant metadata (id, slug, name)
//
// NEVER returns the db_vault_ref or any secret data.
// ─────────────────────────────────────────────────────────────────────────────

// Simple in-memory cache as a fallback for when Redis is unavailable
// In production this is replaced by the Redis layer (added in Phase 1 hardening)
const memCache = new Map<string, { data: object; expiresAt: number }>()

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 })
  }

  // Check in-memory cache first
  const cached = memCache.get(slug)
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data)
  }

  try {
    const tenant = await landlordDb
      .select({
        id: tenants.id,
        slug: tenants.slug,
        name: tenants.name,
        status: tenants.status,
      })
      .from(tenants)
      .where(eq(tenants.slug, slug))
      .limit(1)
      .then((rows) => rows[0] ?? null)

    if (!tenant || tenant.status !== 'active') {
      return NextResponse.json(null, { status: 404 })
    }

    // Cache for 5 minutes
    memCache.set(slug, {
      data: tenant,
      expiresAt: Date.now() + 5 * 60 * 1000,
    })

    return NextResponse.json(tenant)
  } catch (error) {
    console.error('[resolve-tenant] Landlord DB query failed:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
