/** Possible states in the document approval workflow. */
export type DocStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'published'
  | 'archived'
  | 'rejected'

/** Whether a document originates from the Landlord (master) or the Tenant. */
export type DocSource = 'master' | 'internal' | 'shared'

/** A lightweight document summary used in card grids and tables. */
export interface DocSummary {
  id: string
  title: string
  status: DocStatus
  source: DocSource
  category?: string
  excerpt?: string
  createdBy?: string
  updatedAt?: Date | string | null
  hasDeltaOverride?: boolean
  reviewDueAt?: Date | string | null
  expiresAt?: Date | string | null
}

/** Delta override status. */
export type OverrideStatus = 'draft' | 'published' | 'needs_review' | 'archived'

/** A delta override applied by a tenant on a master document. */
export interface DeltaOverride {
  id: string
  masterDocId: string
  status: OverrideStatus
  needsReviewSince?: Date | string | null
  createdBy?: string
  updatedAt?: Date | string | null
}
