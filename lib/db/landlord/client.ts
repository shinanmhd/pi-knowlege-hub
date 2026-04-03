import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Singleton connection to the Landlord DB.
// This runs in the Node.js runtime (never Edge) and is safe to use in
// Server Components, API routes, and Server Actions.
//
// The connection is module-scoped — Next.js hot-reload in dev can create
// multiple instances, so we guard against that with the global cache.

declare global {
  // eslint-disable-next-line no-var
  var _landlordConnection: postgres.Sql | undefined
}

function getLandlordConnection() {
  if (!process.env.LANDLORD_DATABASE_URL) {
    throw new Error('LANDLORD_DATABASE_URL is not set')
  }

  if (!global._landlordConnection) {
    global._landlordConnection = postgres(process.env.LANDLORD_DATABASE_URL, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
      // Prepare: false is important for PgBouncer compatibility in production
      prepare: false,
    })
  }

  return global._landlordConnection
}

export const landlordDb = drizzle(getLandlordConnection(), { schema })
export type LandlordDb = typeof landlordDb
