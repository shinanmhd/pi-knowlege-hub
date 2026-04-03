import Link from 'next/link'
import { ArrowRight, Shield, Sparkles, TriangleAlert, BookOpen, Lock } from 'lucide-react'

interface TenantLandingProps {
  tenantName: string
  tenantSlug: string
}

// ─── Feature card data ──────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Shield,
    iconColor: 'text-primary',
    glowColor: 'rgba(99,102,241,0.15)',
    title: 'Version Controlled',
    description:
      'Every change is logged with a full audit trail and approval workflow — built for regulated environments.',
  },
  {
    icon: Sparkles,
    iconColor: 'text-secondary',
    glowColor: 'rgba(34,211,238,0.15)',
    title: 'AI-Powered Search',
    description:
      'Semantic search across your entire knowledge base using RAG technology. Find answers, not just keywords.',
  },
  {
    icon: TriangleAlert,
    iconColor: 'text-warning',
    glowColor: 'rgba(245,158,11,0.15)',
    title: 'Delta Overrides',
    description:
      'Customize master documents for your organization without losing upstream updates from Pinetworks.',
  },
]

export function TenantLanding({ tenantName, tenantSlug }: TenantLandingProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      {/* ── Background glows (decorative, non-interactive) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        {/* Primary radial glow — centered behind hero */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.14) 0%, transparent 70%)',
          }}
        />
        {/* Secondary cyan glow — upper right */}
        <div
          className="absolute right-0 top-0 h-[400px] w-[500px]"
          style={{
            background:
              'radial-gradient(ellipse at 100% 0%, rgba(34,211,238,0.07) 0%, transparent 60%)',
          }}
        />
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(99,102,241,1) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* ── Navigation ──────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b border-white/[0.06]"
        style={{ background: 'rgba(10,10,15,0.75)', backdropFilter: 'blur(24px)' }}
      >
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <BookOpen className="h-4 w-4 text-primary" />
            </span>
            <span className="font-semibold text-ink">
              <span className="text-primary">PI</span> Knowledge
            </span>
          </Link>

          {/* Org pill + sign-in */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] px-3 py-1 text-xs text-ink-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {tenantName}
            </span>
            <Link
              href="/api/auth/signin"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dim transition-colors"
            >
              Sign In
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center">
        {/* Security badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.07] px-4 py-1.5 text-xs font-medium text-primary">
          <Lock className="h-3 w-3" />
          Secure Knowledge Platform
        </div>

        {/* Headline */}
        <h1
          className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
          style={{ letterSpacing: '-0.03em' }}
        >
          Your organization's knowledge,{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            secured and always in sync.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-xl text-base sm:text-lg text-ink-muted leading-relaxed">
          Centralized documentation for regulated industries. SOPs, policies, and
          technical guides — version controlled, AI-searchable, and compliance ready.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/api/auth/signin"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg active:scale-100"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              boxShadow: '0 0 24px rgba(99,102,241,0.3)',
            }}
          >
            Sign in to {tenantName}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-ink hover:bg-white/[0.08] transition-colors"
          >
            Learn more
          </a>
        </div>

        {/* Subtle stats row */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {[
            { value: '100%', label: 'Audit tracked' },
            { value: 'AI', label: 'Semantic search' },
            { value: 'SOC 2', label: 'Compliance ready' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-ink">{value}</p>
              <p className="text-xs text-ink-subtle mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ── Features ────────────────────────────────────────── */}
      <section id="features" className="relative px-6 pb-24">
        {/* Section fade-in divider */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-px"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(99,102,241,0.25), transparent)',
          }}
        />

        <div className="max-w-5xl mx-auto pt-16">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-ink-subtle mb-12">
            Built for regulated industries
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, iconColor, glowColor, title, description }) => (
              <div
                key={title}
                className="group relative rounded-2xl border border-white/[0.08] bg-surface p-7 transition-all duration-300 hover:bg-surface-raised hover:border-white/[0.12]"
              >
                {/* Card hover glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${glowColor} 0%, transparent 70%)`,
                  }}
                />
                {/* Icon */}
                <div
                  className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08]"
                  style={{ background: glowColor.replace('0.15', '0.1') }}
                >
                  <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-ink mb-2">{title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-6 px-6 text-center">
        <p className="text-xs text-ink-subtle">
          Powered by{' '}
          <span className="text-ink-muted font-medium">PI Networks</span>
          {' · '}
          &copy; {new Date().getFullYear()}
          {' · '}
          <span className="text-ink-subtle/60">{tenantSlug}.pinetworks.mv</span>
        </p>
      </footer>
    </div>
  )
}
