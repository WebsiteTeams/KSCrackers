import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.log('⚠️  MONGODB_URI is not defined in env. Fallback mock database is active.');
}

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastConnectedAt: number;
}

// Global interface expansion for caching
declare global {
  var mongoose: MongooseConnection | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, lastConnectedAt: 0 };
}

function isConnectionAlive(conn: typeof mongoose | null): boolean {
  if (!conn) return false;
  try {
    const state = conn.connection.readyState;
    return state === 1;
  } catch {
    return false;
  }
}

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    return null;
  }

  if (cached && isConnectionAlive(cached.conn)) {
    return cached.conn;
  }

  if (cached) {
    cached.conn = null;
    cached.promise = null;
  }

  if (cached && !cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ Connected to MongoDB Atlas');
      if (cached) {
        cached.lastConnectedAt = Date.now();
      }
      return mongooseInstance;
    });
  }

  try {
    if (cached && cached.promise) {
      cached.conn = await cached.promise;
    }
  } catch (e) {
    if (cached) {
      cached.conn = null;
      cached.promise = null;
    }
    console.error('❌ MongoDB Connection Error:', e);
    return null;
  }

  return cached ? cached.conn : null;
}
