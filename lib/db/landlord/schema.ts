import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  unique,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─────────────────────────────────────────────────────────────────────────────
// TENANTS
// Registry of all clients. The slug is used for subdomain resolution
// (e.g. "alpha" maps to alpha.pinetworks.mv).
//
// SECURITY: db_vault_ref stores only a Key Vault reference key, never the raw
// connection string. The app resolves the actual connection at runtime via
// Azure Key Vault.
// ─────────────────────────────────────────────────────────────────────────────
export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  domain: text('domain').unique(), // Custom domain e.g. docs.acme.com
  dbVaultRef: text('db_vault_ref').notNull(), // e.g. "tenants/alpha/db-conn" — Key Vault key
  status: text('status', { enum: ['onboarding', 'active', 'suspended'] })
    .notNull()
    .default('onboarding'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─────────────────────────────────────────────────────────────────────────────
// AUTH CONFIGS
// Azure Entra ID credentials per tenant. Each tenant uses their own App
// Registration so they maintain full sovereignty over their user identities.
//
// SECURITY: azure_vault_ref stores only the Key Vault reference for the
// client secret. The raw secret is never written to this database.
// ─────────────────────────────────────────────────────────────────────────────
export const authConfigs = pgTable('auth_configs', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' })
    .unique(),
  azureClientId: text('azure_client_id').notNull(),
  azureVaultRef: text('azure_vault_ref').notNull(), // Key Vault ref for client secret
  azureTenantId: text('azure_tenant_id').notNull(), // The bank's own Azure tenant ID
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─────────────────────────────────────────────────────────────────────────────
// DOC CATEGORIES
// Hierarchical categories for organizing master documentation.
// ─────────────────────────────────────────────────────────────────────────────
export const docCategories = pgTable('doc_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  parentId: uuid('parent_id'), // Self-referencing — no FK to avoid circular dep
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─────────────────────────────────────────────────────────────────────────────
// MASTER DOCS
// The source of truth for Pinetworks IP documentation. Visible to all
// assigned tenants. Tenants can layer Delta Overrides on top but cannot
// edit the master content.
// ─────────────────────────────────────────────────────────────────────────────
export const masterDocs = pgTable('master_docs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  contentJson: jsonb('content_json').notNull().default('{}'),
  checksum: text('checksum'), // SHA-256 of content_json for integrity verification
  version: integer('version').notNull().default(1),
  categoryId: uuid('category_id').references(() => docCategories.id),
  status: text('status', {
    enum: ['draft', 'submitted', 'approved', 'published', 'archived'],
  })
    .notNull()
    .default('draft'),
  createdBy: uuid('created_by').notNull(), // Pinetworks admin user ID
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─────────────────────────────────────────────────────────────────────────────
// DOC VERSIONS
// Full version history of every master doc. Enables rollback and provides
// a compliance audit trail of content changes.
// ─────────────────────────────────────────────────────────────────────────────
export const docVersions = pgTable('doc_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  masterDocId: uuid('master_doc_id')
    .notNull()
    .references(() => masterDocs.id, { onDelete: 'cascade' }),
  contentJson: jsonb('content_json').notNull(),
  checksum: text('checksum'),
  versionNumber: integer('version_number').notNull(),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─────────────────────────────────────────────────────────────────────────────
// DOC ASSIGNMENTS
// Controls which tenants can see which master docs. A tenant cannot access
// a master doc unless an explicit assignment row exists.
// ─────────────────────────────────────────────────────────────────────────────
export const docAssignments = pgTable(
  'doc_assignments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    masterDocId: uuid('master_doc_id')
      .notNull()
      .references(() => masterDocs.id, { onDelete: 'cascade' }),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    assignedAt: timestamp('assigned_at').defaultNow().notNull(),
  },
  (t) => [unique().on(t.masterDocId, t.tenantId)],
)

// ─────────────────────────────────────────────────────────────────────────────
// TENANT MIGRATION STATE
// Tracks exactly which schema version each tenant DB is on.
// Critical for the fan-out migration runner — prevents re-running successful
// migrations and enables targeted retry of failed ones.
// ─────────────────────────────────────────────────────────────────────────────
export const tenantMigrationState = pgTable('tenant_migration_state', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  migrationVersion: text('migration_version').notNull(),
  status: text('status', {
    enum: ['pending', 'success', 'failed', 'retrying'],
  })
    .notNull()
    .default('pending'),
  errorMessage: text('error_message'),
  appliedAt: timestamp('applied_at').defaultNow().notNull(),
})

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN USERS
// Internal Pinetworks staff that have access to the Landlord dashboard.
// Synced from Microsoft Entra ID on first login.
// ─────────────────────────────────────────────────────────────────────────────
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  azureAdId: text('azure_ad_id').unique(), // nullable for future non-Microsoft users
  role: text('role', { enum: ['superadmin', 'support', 'viewer'] })
    .notNull()
    .default('viewer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const tenantsRelations = relations(tenants, ({ one, many }) => ({
  authConfig: one(authConfigs, {
    fields: [tenants.id],
    references: [authConfigs.tenantId],
  }),
  docAssignments: many(docAssignments),
  migrationState: many(tenantMigrationState),
}))

export const masterDocsRelations = relations(masterDocs, ({ one, many }) => ({
  category: one(docCategories, {
    fields: [masterDocs.categoryId],
    references: [docCategories.id],
  }),
  versions: many(docVersions),
  assignments: many(docAssignments),
}))

export const docAssignmentsRelations = relations(docAssignments, ({ one }) => ({
  masterDoc: one(masterDocs, {
    fields: [docAssignments.masterDocId],
    references: [masterDocs.id],
  }),
  tenant: one(tenants, {
    fields: [docAssignments.tenantId],
    references: [tenants.id],
  }),
}))

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export type Tenant = typeof tenants.$inferSelect
export type NewTenant = typeof tenants.$inferInsert
export type AuthConfig = typeof authConfigs.$inferSelect
export type MasterDoc = typeof masterDocs.$inferSelect
export type NewMasterDoc = typeof masterDocs.$inferInsert
export type DocAssignment = typeof docAssignments.$inferSelect
export type TenantMigrationState = typeof tenantMigrationState.$inferSelect
export type AdminUser = typeof adminUsers.$inferSelect
export type NewAdminUser = typeof adminUsers.$inferInsert

