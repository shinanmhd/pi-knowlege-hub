import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  integer,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL DOCS
// Documentation created by the tenant for their own use. Completely private.
// Goes through an approval workflow before publishing.
// ─────────────────────────────────────────────────────────────────────────────
export const internalDocs = pgTable('internal_docs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  contentJson: jsonb('content_json').notNull().default('{}'),
  status: text('status', {
    enum: ['draft', 'submitted', 'approved', 'published', 'archived'],
  })
    .notNull()
    .default('draft'),
  createdBy: uuid('created_by').notNull(),
  approvedBy: uuid('approved_by'),
  reviewDueAt: timestamp('review_due_at'),   // Mandatory review reminder
  expiresAt: timestamp('expires_at'),         // Compliance expiry date
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─────────────────────────────────────────────────────────────────────────────
// DOC APPROVALS
// Records every approval/rejection decision on an internal doc.
// Enforces the 4-eyes principle required by banking compliance.
// ─────────────────────────────────────────────────────────────────────────────
export const docApprovals = pgTable('doc_approvals', {
  id: uuid('id').defaultRandom().primaryKey(),
  docId: uuid('doc_id')
    .notNull()
    .references(() => internalDocs.id, { onDelete: 'cascade' }),
  reviewerId: uuid('reviewer_id').notNull(),
  decision: text('decision', { enum: ['approved', 'rejected'] }).notNull(),
  comment: text('comment'),
  decidedAt: timestamp('decided_at').defaultNow().notNull(),
})

// ─────────────────────────────────────────────────────────────────────────────
// DELTA OVERRIDES
// Allows tenants to extend a Pinetworks Master Doc with their own steps
// without modifying or forking the master content. When the master doc is
// updated, the override is flagged for review.
//
// NOTE: master_doc_id is a cross-DB reference to Landlord DB.
// No FK constraint can be applied here — enforced at the application layer.
// ─────────────────────────────────────────────────────────────────────────────
export const deltaOverrides = pgTable('delta_overrides', {
  id: uuid('id').defaultRandom().primaryKey(),
  masterDocId: uuid('master_doc_id').notNull(), // Landlord DB — no FK (cross-DB)
  overrideSteps: jsonb('override_steps').notNull().default('[]'),
  status: text('status', { enum: ['draft', 'published', 'needs_review', 'archived'] })
    .notNull()
    .default('draft'),
  needsReviewSince: timestamp('needs_review_since'), // Set when master doc is updated
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─────────────────────────────────────────────────────────────────────────────
// USER INTERACTIONS
// Personal overlays a user can place on any document — bookmarks, notes.
// doc_source enum replaces the original is_master_doc boolean to support
// future doc types without schema changes.
// ─────────────────────────────────────────────────────────────────────────────
export const userInteractions = pgTable('user_interactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  docRefId: uuid('doc_ref_id').notNull(), // ID of the doc in its source DB
  docSource: text('doc_source', { enum: ['master', 'internal', 'shared'] }).notNull(),
  notes: text('notes'),
  isBookmarked: boolean('is_bookmarked').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─────────────────────────────────────────────────────────────────────────────
// ISSUE RESOLUTIONS
// "Knowledge Base 2.0" — every incident fix is captured here and linked to
// the relevant documentation. Powers the RAG semantic search sidebar.
// ─────────────────────────────────────────────────────────────────────────────
export const issueResolutions = pgTable('issue_resolutions', {
  id: uuid('id').defaultRandom().primaryKey(),
  problemStatement: text('problem_statement').notNull(),
  stepsToFix: jsonb('steps_to_fix').notNull().default('[]'),
  linkedDocId: uuid('linked_doc_id'),   // Optional link to a doc (cross-DB if master)
  linkedDocSource: text('linked_doc_source', { enum: ['master', 'internal'] }),
  tags: text('tags').array().default([]),
  status: text('status', { enum: ['draft', 'verified', 'deprecated'] })
    .notNull()
    .default('draft'),
  createdBy: uuid('created_by').notNull(),
  updatedBy: uuid('updated_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGS
// Immutable, append-only record of all significant actions.
//
// SECURITY: After running migrations, enforce append-only at the DB level:
//   REVOKE UPDATE, DELETE ON audit_logs FROM app_role;
//   GRANT INSERT, SELECT ON audit_logs TO app_role;
//
// This table intentionally has no updated_at — rows must never be modified.
// ─────────────────────────────────────────────────────────────────────────────
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  action: text('action').notNull(),         // e.g. "doc.viewed", "doc.published"
  resourceType: text('resource_type').notNull(), // e.g. "internal_doc", "master_doc"
  resourceId: uuid('resource_id'),
  ipAddress: text('ip_address'),
  metadata: jsonb('metadata').default('{}'), // Extra context (doc title, etc.)
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─────────────────────────────────────────────────────────────────────────────
// DOC PERMISSIONS
// Per-document ACL entries that override role-based access.
// Enables "Only IT Dept can view this server failover runbook."
// ─────────────────────────────────────────────────────────────────────────────
export const docPermissions = pgTable('doc_permissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  docId: uuid('doc_id').notNull(),
  docSource: text('doc_source', { enum: ['master', 'internal'] }).notNull(),
  principalType: text('principal_type', { enum: ['role', 'user'] }).notNull(),
  principalId: text('principal_id').notNull(), // role name or user UUID
  permissionLevel: text('permission_level', {
    enum: ['read', 'write', 'admin', 'none'],
  }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─────────────────────────────────────────────────────────────────────────────
// API KEYS
// Scoped, rotatable API keys for DaC (Documentation-as-Code) CI/CD integration.
// The raw key is shown once on creation. Only the SHA-256 hash is stored.
// ─────────────────────────────────────────────────────────────────────────────
export const apiKeys = pgTable('api_keys', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  keyHash: text('key_hash').notNull().unique(), // SHA-256 of the raw key only
  scopes: text('scopes').array().notNull().default([]), // e.g. ['docs:write', 'docs:read']
  createdBy: uuid('created_by').notNull(),
  expiresAt: timestamp('expires_at'),
  lastUsedAt: timestamp('last_used_at'),
  revokedAt: timestamp('revoked_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const internalDocsRelations = relations(internalDocs, ({ many }) => ({
  approvals: many(docApprovals),
  permissions: many(docPermissions),
}))

export const docApprovalsRelations = relations(docApprovals, ({ one }) => ({
  doc: one(internalDocs, {
    fields: [docApprovals.docId],
    references: [internalDocs.id],
  }),
}))

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export type InternalDoc = typeof internalDocs.$inferSelect
export type NewInternalDoc = typeof internalDocs.$inferInsert
export type DeltaOverride = typeof deltaOverrides.$inferSelect
export type IssueResolution = typeof issueResolutions.$inferSelect
export type NewIssueResolution = typeof issueResolutions.$inferInsert
export type AuditLog = typeof auditLogs.$inferSelect
export type NewAuditLog = typeof auditLogs.$inferInsert
export type ApiKey = typeof apiKeys.$inferSelect
