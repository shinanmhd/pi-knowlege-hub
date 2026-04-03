/** Status of a tenant account in the platform. */
export type TenantStatus = 'onboarding' | 'active' | 'suspended'

/** Resolved tenant metadata injected by middleware into request headers. */
export interface TenantContext {
  tenantId: string
  slug: string
  name: string
  domain?: string | null
  status: TenantStatus
}

/** Summary row used in the landlord tenant health table. */
export interface TenantSummary {
  id: string
  name: string
  slug: string
  domain?: string | null
  status: TenantStatus
  dbRegion?: string
  lastActive?: Date | string | null
}

/** Status of a fan-out migration job for a tenant DB. */
export type MigrationStatus = 'pending' | 'success' | 'failed' | 'retrying'

/** A migration record shown in the landlord migration queue. */
export interface MigrationRecord {
  id: string
  tenantId: string
  tenantName: string
  migrationVersion: string
  status: MigrationStatus
  appliedAt?: Date | string | null
  errorMessage?: string | null
}
