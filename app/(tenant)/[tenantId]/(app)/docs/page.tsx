import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { DocCard } from '@/components/docs/doc-card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/data-display/empty-state'
import { FileText } from 'lucide-react'
import type { DocSummary } from '@/lib/types/doc'

export const metadata: Metadata = { title: 'Docs' }

// Tenant Documentation Page
// Accessible at: alpha.pinetworks.mv/docs (in production)
// Proxy rewrites subdomain → /[tenantId]/docs (route group (app) handles it)
export default async function TenantDocsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>
}) {
  const { tenantId } = await params
  const headersList = await headers()
  const tenantName = headersList.get('x-tenant-name') ?? tenantId

  // Phase 3 will replace this with a real DB query via getTenantDb()
  const docs: DocSummary[] = [
    {
      id: '1',
      title: 'Core Banking Incident Response Runbook',
      status: 'published',
      source: 'master',
      category: 'Incident Procedures',
      excerpt: 'Comprehensive guide for classifying and responding to P1–P4 incidents across core banking systems.',
      createdBy: 'Pinetworks Team',
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      hasDeltaOverride: true,
    },
    {
      id: '2',
      title: 'Network Outage Escalation Matrix',
      status: 'published',
      source: 'master',
      category: 'Incident Procedures',
      excerpt: 'Contact hierarchy and SLA timelines for all network outage severity levels.',
      createdBy: 'Pinetworks Team',
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: '3',
      title: 'Security Incident Classification Guide',
      status: 'submitted',
      source: 'internal',
      category: 'Incident Procedures',
      excerpt: 'Internal classification framework aligned with MMA cybersecurity reporting requirements.',
      createdBy: 'Ibrahim Mohamed',
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: '4',
      title: `${tenantName} Internal DR Procedure`,
      status: 'draft',
      source: 'internal',
      category: 'IT Operations',
      excerpt: 'Disaster recovery procedure tailored for our on-premise infrastructure.',
      createdBy: 'Ahmed Ali',
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Documentation"
        description={`${tenantName} · ${docs.length} documents`}
        breadcrumb={[{ label: 'Docs' }]}
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        }
      />

      {docs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Create your first document or wait for Pinetworks to assign master docs to your organisation."
          action={{ label: 'Create Document' }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {docs.map((doc) => (
            <DocCard key={doc.id} doc={doc} href={`/docs/${doc.id}`} />
          ))}
        </div>
      )}
    </div>
  )
}
