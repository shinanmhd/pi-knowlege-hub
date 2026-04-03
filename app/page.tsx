import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Wrench, Cpu } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Pinetworks Knowledge Platform' }

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-canvas px-6">
      <div className="w-full max-w-lg text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white text-xl font-bold shadow-lg shadow-primary/25">
            PN
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-ink tracking-tight">
            Pinetworks Knowledge Platform
          </h1>
          <p className="text-ink-muted text-base leading-relaxed">
            The institutional memory of the Maldives&apos; digital economy.
            Multi-tenant documentation & incident intelligence.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-3 text-left">
          {[
            { icon: BookOpen, label: 'Documentation', desc: 'Master + tenant docs with delta overrides' },
            { icon: Wrench,   label: 'Resolutions',   desc: 'RAG-powered incident knowledge base' },
            { icon: Cpu,      label: 'Intelligence',  desc: 'Ask My Docs with semantic search' },
          ].map(({ icon: Icon, label, desc }) => (
            <Card key={label} className="p-4">
              <CardContent className="p-0 space-y-2">
                <Icon className="h-5 w-5 text-primary" />
                <p className="text-xs font-semibold text-ink">{label}</p>
                <p className="text-[11px] text-ink-subtle leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary-dim transition-colors"
          >
            Admin Console <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/tenant/demo/dashboard"
            className="inline-flex items-center justify-center h-10 px-5 text-sm font-medium rounded-md border border-white/10 text-ink hover:bg-surface hover:border-white/20 transition-colors"
          >
            Tenant Demo
          </Link>
        </div>

        <p className="text-xs text-ink-subtle">
          Tenants access via their subdomain · e.g.{' '}
          <span className="font-mono text-ink-muted">kanmathi-shop.pinetworks.net</span>
        </p>
      </div>
    </div>
  )
}
