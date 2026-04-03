import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { FileText, Wrench, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/data-display/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { DocStatusBadge } from '@/components/docs/doc-status-badge'
import { Alert } from '@/components/feedback/alert'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function TenantDashboardPage({
  params,
}: {
  params: Promise<{ tenantId: string }>
}) {
  const { tenantId } = await params
  const headersList = await headers()
  const tenantName = headersList.get('x-tenant-name') ?? tenantId

  return (
    <div>
      <PageHeader
        title={`Welcome back`}
        description={`${tenantName} · Knowledge Platform`}
      />

      {/* Expiry alert */}
      <Alert variant="warning" title="2 documents expiring soon" className="mb-6">
        Review and re-approve before the expiry date to keep your compliance record clean.
      </Alert>

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Published Docs"    value="48"  accentColor="success" icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="Pending Review"    value="5"   accentColor="warning" icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Issue Resolutions" value="124" accentColor="primary" icon={<Wrench className="h-4 w-4" />} />
        <StatCard label="Master Doc Overrides" value="7" accentColor="secondary" icon={<FileText className="h-4 w-4" />} />
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Document Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <tbody>
              {[
                { title: 'Core Banking Incident Response Runbook', status: 'published' as const, by: 'Ahmed Ali',    time: '2h ago'   },
                { title: 'Network Outage Escalation Matrix',        status: 'submitted' as const, by: 'Fathimath S.', time: '5h ago'   },
                { title: 'Security Incident Classification Guide',  status: 'approved'  as const, by: 'Ibrahim M.',   time: 'Yesterday'},
                { title: 'BML Internal DR Procedure v2',            status: 'draft'     as const, by: 'Ahmed Ali',    time: '2d ago'   },
              ].map((doc, i) => (
                <tr key={i} className="border-b border-white/[4%] last:border-0 hover:bg-white/[2%] transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-ink font-medium text-sm">{doc.title}</p>
                    <p className="text-ink-subtle text-xs mt-0.5">{doc.by}</p>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <DocStatusBadge status={doc.status} />
                      <span className="text-xs text-ink-subtle w-16 text-right">{doc.time}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
