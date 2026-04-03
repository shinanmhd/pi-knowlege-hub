import type { Metadata } from 'next'
import { Users, BookOpen, Database, Activity } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/data-display/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'

export const metadata: Metadata = { title: 'Dashboard' }

// Landlord Admin Dashboard
// Accessible at: pinetworks.mv (no subdomain) or localhost:3000 in local dev
export default function LandlordDashboard() {
  return (
    <div>
      <PageHeader
        title="Platform Overview"
        description="Pinetworks Knowledge Platform · Admin Console"
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Active Tenants"
          value="47"
          accentColor="success"
          icon={<Users className="h-4 w-4" />}
          trend={{ value: '+3 this month', direction: 'up' }}
        />
        <StatCard
          label="Master Documents"
          value="312"
          accentColor="primary"
          icon={<BookOpen className="h-4 w-4" />}
        />
        <StatCard
          label="Pending Migrations"
          value="2"
          accentColor="warning"
          icon={<Database className="h-4 w-4" />}
        />
        <StatCard
          label="Platform Uptime"
          value="99.97%"
          accentColor="success"
          icon={<Activity className="h-4 w-4" />}
          trend={{ value: 'Last 30 days', direction: 'flat' }}
        />
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Tenant Health Table */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Tenant Health</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[6%]">
                  {['Tenant', 'Domain', 'Status', 'Region', 'Last Active'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-ink-subtle uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Bank of Maldives', slug: 'bml', domain: 'bml.pinetworks.mv', status: 'active',      region: 'Azure SEA',  last: '2m ago' },
                  { name: 'MMA',              slug: 'mma', domain: 'mma.pinetworks.mv', status: 'active',      region: 'Azure SEA',  last: '1h ago' },
                  { name: 'Dhiraagu',         slug: 'dhi', domain: 'dhi.pinetworks.mv', status: 'active',      region: 'Azure SEA',  last: '3h ago' },
                  { name: 'STO',              slug: 'sto', domain: 'sto.pinetworks.mv', status: 'onboarding',  region: '—',          last: 'Today'  },
                  { name: 'MTCC',             slug: 'mtc', domain: 'mtc.pinetworks.mv', status: 'active',      region: 'Azure West', last: '1d ago' },
                  { name: 'Ooredoo Maldives', slug: 'oor', domain: 'oor.pinetworks.mv', status: 'suspended',   region: 'Azure SEA',  last: '7d ago' },
                ].map((t) => (
                  <tr key={t.slug} className="border-b border-white/[4%] last:border-0 hover:bg-white/[2%] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={t.name} size="sm" />
                        <span className="text-ink font-medium">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-muted font-mono text-xs">{t.domain}</td>
                    <td className="px-4 py-3">
                      <Badge
                        dot
                        variant={t.status === 'active' ? 'success' : t.status === 'onboarding' ? 'default' : 'danger'}
                        size="sm"
                      >
                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-ink-subtle text-xs">{t.region}</td>
                    <td className="px-4 py-3 text-ink-subtle text-xs">{t.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Migration Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Migration Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { tenant: 'STO', version: '0002_add_doc_permissions', progress: 65, status: 'running' },
              { tenant: 'Ooredoo',version: '0002_add_doc_permissions', progress: 0, status: 'queued' },
            ].map((m, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-ink">{m.tenant}</span>
                  <Badge variant={m.status === 'running' ? 'default' : 'muted'} size="sm" dot>
                    {m.status}
                  </Badge>
                </div>
                <p className="text-[10px] text-ink-subtle font-mono">{m.version}</p>
                <div className="h-1.5 rounded-full bg-surface-overlay overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
