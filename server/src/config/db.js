
import mongoose from 'mongoose'

let cached = globalThis.mongoose

if (!cached) {
  cached = globalThis.mongoose = {
    conn: null,
    promise: null
  }
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const uri = process.env.MONGO_URI

    if (!uri) {
      throw new Error('MONGO_URI is missing')
    }

    cached.promise = mongoose.connect(uri, {
      bufferCommands: false
    }).then((mongoose) => mongoose)
      .catch((error) => {
        cached.promise = null
        throw error
      })
  }

  cached.conn = await cached.promise

  return cached.conn
}
