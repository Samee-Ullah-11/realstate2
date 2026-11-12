// Demo mode: runs the API on a throwaway in-memory MongoDB filled with the sample listings.
// Nothing to install or sign up for, but all data is lost when it stops. Run with: npm run demo
import { fileURLToPath } from 'node:url'
import { MongoMemoryServer } from 'mongodb-memory-server'

// Reuse the database binary the tests already downloaded, whatever folder this is started from.
process.env.MONGOMS_DOWNLOAD_DIR ??= fileURLToPath(
  new URL('../node_modules/.cache/mongodb-memory-server', import.meta.url)
)

const mongo = await MongoMemoryServer.create()
process.env.MONGO_URI = mongo.getUri()
await import('./seed.js')
await import('./index.js')
