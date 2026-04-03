import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Dynamic tenant DB client factory.
// Creates and caches a Drizzle instance per tenant connection string.
// This is the core of the multi-tenant data isolation pattern.
//
// In production: connectionString is resolved from Azure Key Vault at runtime.
// In local dev:  connectionString comes from env vars (TENANT_*_DATABASE_URL).

type TenantDb = ReturnType<typeof drizzle<typeof schema>>

// Module-level Map caches one connection pool per tenant.
// This persists across requests within the same server process.
const connectionCache = new Map<string, { sql: postgres.Sql; db: TenantDb }>()

export function getTenantDb(tenantId: string, connectionString: string): TenantDb {
  if (connectionCache.has(tenantId)) {
    return connectionCache.get(tenantId)!.db
  }

  const sql = postgres(connectionString, {
    max: 5,          // Smaller pool per tenant to avoid exhausting DB connections
    idle_timeout: 30,
    connect_timeout: 10,
    prepare: false,  // Required for PgBouncer compatibility
  })

  const db = drizzle(sql, { schema })
  connectionCache.set(tenantId, { sql, db })

  return db
}

// Used by the fan-out migration runner to get a raw SQL connection
export function getTenantSql(tenantId: string, connectionString: string): postgres.Sql {
  if (connectionCache.has(tenantId)) {
    return connectionCache.get(tenantId)!.sql
  }
  getTenantDb(tenantId, connectionString) // Initialises the cache entry
  return connectionCache.get(tenantId)!.sql
}

export type TenantDbClient = TenantDb
