import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

// This config targets a single tenant DB for generating migration files.
// The actual fan-out migration runner applies these files to ALL tenant DBs.
// Set TENANT_DATABASE_URL to whichever tenant DB you want to inspect/generate for.
export default defineConfig({
  schema: './lib/db/tenant/schema.ts',
  out: './drizzle/tenant',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.TENANT_ALPHA_DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})
