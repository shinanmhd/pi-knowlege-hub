// Loads .env.local before any other module initializes.
// Import this as the FIRST import in any CLI script (seed, migration helpers, etc.)
// that needs environment variables but runs outside the Next.js runtime.
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
