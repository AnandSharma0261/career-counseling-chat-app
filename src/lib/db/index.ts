/**
 * Database connection configuration using Drizzle ORM with SQLite/Turso
 * Supports both local development and production cloud database
 */
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Create database client based on environment
let client;
let isMemoryDatabase = false;

try {
  const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
  
  console.log(`🔗 Connecting to database: ${databaseUrl.substring(0, 20)}...`);
  
  if (databaseUrl.startsWith('libsql://')) {
    // Turso cloud database
    console.log('📡 Using Turso cloud database');
    client = createClient({
      url: databaseUrl,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  } else if (databaseUrl.startsWith('file:') && process.env.VERCEL) {
    // Fallback to memory only on Vercel with file database
    console.log('⚠️  Vercel detected with file database, using memory fallback');
    client = createClient({
      url: ':memory:',
    });
    isMemoryDatabase = true;
  } else {
    // Local development with file database
    console.log('💻 Using local file database');
    client = createClient({
      url: databaseUrl,
    });
  }
} catch (error) {
  console.error('Database connection error:', error);
  // Final fallback to memory database
  client = createClient({
    url: ':memory:',
  });
  isMemoryDatabase = true;
}

// Create Drizzle database instance with schema
export const db = drizzle(client, { schema });

// Initialize database function
export async function ensureDbInitialized() {
  if (!isMemoryDatabase) {
    console.log('✅ Using persistent database - no initialization needed');
    return true;
  }

  try {
    // Only initialize if using memory database
    const { initializeMemoryDatabase } = await import('./init');
    await initializeMemoryDatabase();
    console.log('✅ Memory database initialized');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

// Export database connection for use throughout the application
export default db;
