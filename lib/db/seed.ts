// ─────────────────────────────────────────────────────────────────────────────
// LOCAL DEVELOPMENT SEED SCRIPT
// Populates the Landlord DB with two generic test tenants so you can
// immediately test multi-tenant routing without manually inserting data.
//
// Run: npm run db:seed
//
// Test after seeding:
//   1. Add to /etc/hosts:  127.0.0.1  alpha.localhost
//                          127.0.0.1  beta.localhost
//   2. Visit: http://alpha.localhost:3000/docs
//   3. Visit: http://beta.localhost:3000/docs
//   Each should show a different tenant name — proving isolation works.
// ─────────────────────────────────────────────────────────────────────────────

import './load-env'
import { landlordDb } from './landlord/client'
import { tenants, docCategories } from './landlord/schema'

async function seed() {
  console.log('🌱 Seeding Landlord DB...')

  // Upsert tenants (safe to re-run)
  const [tenantA, tenantB] = await landlordDb
    .insert(tenants)
    .values([
      {
        name: 'Demo Company Alpha',
        slug: 'alpha',
        domain: 'alpha.pinetworks.mv',
        // In production this would be a real Azure Key Vault reference.
        // For local dev we use a placeholder — the actual connection string
        // comes from the TENANT_ALPHA_DATABASE_URL env var instead.
        dbVaultRef: 'local-dev/alpha/db-conn',
        status: 'active',
      },
      {
        name: 'Demo Company Beta',
        slug: 'beta',
        domain: 'beta.pinetworks.mv',
        dbVaultRef: 'local-dev/beta/db-conn',
        status: 'active',
      },
    ])
    .onConflictDoNothing()
    .returning()

  if (tenantA) console.log(`  ✓ Tenant created: ${tenantA.name} (${tenantA.id})`)
  if (tenantB) console.log(`  ✓ Tenant created: ${tenantB.name} (${tenantB.id})`)

  // Seed doc categories
  await landlordDb
    .insert(docCategories)
    .values([
      { name: 'Core Infrastructure', slug: 'core-infrastructure' },
      { name: 'Processes & Workflows', slug: 'processes-workflows' },
      { name: 'Security Procedures', slug: 'security-procedures' },
      { name: 'Onboarding', slug: 'onboarding' },
    ])
    .onConflictDoNothing()

  console.log('  ✓ Doc categories seeded')
  console.log('✅ Seed complete.\n')
  console.log('Next steps:')
  console.log('  1. Add to /etc/hosts: 127.0.0.1  alpha.localhost beta.localhost')
  console.log('  2. Visit: http://alpha.localhost:3000/docs')
  console.log('  3. Visit: http://beta.localhost:3000/docs')

  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
